// instantiate our graph!
var graph = new Rickshaw.Graph( {
	element: document.getElementById("chart"),
	width: 900,
	height: 500,
	interpolation: 'step-after',
	series: new Rickshaw.Series([{ name: 'This' }])
} );
var slider = new Rickshaw.Graph.RangeSlider( {
	graph: graph,
	element: document.getElementById('slider')
} );
var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	graph: graph
} );
var annotator = new Rickshaw.Graph.Annotate( {
	graph: graph,
	element: document.getElementById('timeline')
} );
var legend = new Rickshaw.Graph.Legend( {
	graph: graph,
	element: document.getElementById('legend')
} );
var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
	graph: graph,
	legend: legend
} );
// a little monkey punching
legend.shelving = shelving;
graph.series.legend = legend;
var order = new Rickshaw.Graph.Behavior.Series.Order( {
	graph: graph,
	legend: legend
} );
var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
	graph: graph,
	legend: legend
} );
var axes = new Rickshaw.Graph.Axis.Time( {
	graph: graph
} );
axes.render();
var smoother = new Rickshaw.Graph.Smoother( {
	graph: graph,
	element: $('#smoother')
} );
var offset_form = document.getElementById('offset_form');
offset_form.addEventListener("change", function(e) {
	var offsetMode = e.target.value;
	if (offsetMode == 'lines') {
		graph.setRenderer('line');
		graph.offset = 'zero';
	} else {
		graph.setRenderer('stack');
		graph.offset = offsetMode;
	}
	graph.update();
}, false );
// add some data every so often
var tv = 1000;
graph.series.setTimeInterval(tv);
setInterval( function() {
	var data = { This: 3 };
	var randInt = Math.floor(Math.random()*100);
	if (randInt > 10) {
		data.That = randInt;
}
	if (randInt > 15) {
		data.TheOtherThing = randInt;
	}
	graph.series.addData(data);
	graph.update();
}, tv );
var resize = function() {
  graph.configure({
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.75
  });
  graph.render();
}
window.addEventListener('resize', resize);
resize();
