// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Influx = require('influxdb-nodejs');
const influxClient = new Influx('INSERT IFLUXDB URL HERE');
const influxWriter = influxClient.write('INSERT INFLUXDB NAME HERE');

const serialport = require('serialport')
const createTable = require('data-table')
var port = new serialport('/dev/ttyUSB0',{baudRate:9600});
//Using Readline delimeter with custom delimeter
const Readline = serialport.parsers.Readline;
const parser = new Readline({delimiter: '\r\n'});

port.pipe(parser);
//-------------------------------------
const fieldSchema = {
	totalTime:	'integer',
	distance:	'integer',
	timeTo500m:	'integer',
	spm:		'integer',
	watt:		'integer',
	calph:		'integer',
	level:		'integer'
}
//-----------------------------------

serialport.list((err, ports) => {
  console.log('ports', ports);
  if (err) {
    document.getElementById('error').textContent = err.message
    return
  } else {
    document.getElementById('error').textContent = ''
  }

  if (ports.length === 0) {
    document.getElementById('error').textContent = 'No ports discovered'
  }

  const headers = Object.keys(ports[0])
  const table = createTable(headers)
  tableHTML = ''
  table.on('data', data => tableHTML += data)
  table.on('end', () => document.getElementById('ports').innerHTML = tableHTML)
  ports.forEach(port => table.write(port))
  table.end();
})

port.on('open', function() {
	port.flush();

	/* The following writes are being issued from the windows application
	 * It is quite possible that they are needed for the application to
	 * present info about the connected device
	 *
	 * port.write("C\n");
	 * console.log(port.read());
	 * port.write("T\n");
	 * console.log(port.read());
	 * port.write("V\n");
	 * console.log(port.read());
	 * port.write("L\n");
	 * console.log(port.read());
	 * port.write("H\n");
	 * console.log(port.read());
	 * port.write("R\n");
	 * console.log(port.read());
	 */

	console.log('Port is open');

	parser.on('data',function(data){
		if(data.length == 29){
			console.log("Data read")
			var totalMinutes=	parseInt(data.slice(3,5), 10);
			var	totalSeconds=	parseInt(data.slice(5,7),10);
			var totalTime=		totalMinutes*60+totalSeconds;
			var	distance=		parseInt(data.slice(7,12),10);
			var	MinutesTo500m=	parseInt(data.slice(13,15),10);
			var	SecondsTo500m=	parseInt(data.slice(15,17),10);
			var timeTo500m = 	MinutesTo500m*60+SecondsTo500m;
			var	spm=			parseInt(data.slice(17,20),10);
			var	watt=			parseInt(data.slice(20,23),10);
			var	calph=			parseInt(data.slice(23,27),10);
			var	level=			parseInt(data.slice(27,29),10);
			console.log("Total Time : " 	+totalMinutes+ ":"+totalSeconds );
			console.log("Distance : "		+distance+ "m");
			console.log("Time to 500m : "	+MinutesTo500m+ ":"+SecondsTo500m);
			console.log("SPM : " 			+spm);
			console.log("WATT : " 			+watt);
			console.log("cal/h : "			+calph);
			console.log("Level : " 			+level);

			influxClient.write('rowingdata')
			.field({
				totalTime:	totalTime,
				distance:	distance,
				timeTo500m:	timeTo500m,
				spm:		spm,
				watt:		watt,
				calph:		calph,
				level:		level,
    		})
			.then(()=>console.info('write point success'))
			.catch(err => console.error('write point fail', err))
		}
		else{
			console.log("Invalid data input")
		}
	});
});
