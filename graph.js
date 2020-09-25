var network;							// Network objects
var data, edges;						// Networks data
var container;							// Networks DOM object
var options = {							// Networks initialization options
	layout:{improvedLayout:true},
	physics: {enabled: true},
	interaction: {
		dragNodes: true,
		dragView: false,
		zoomView: false
	},
	autoResize: true,
	nodes: {
		shape: "dot",
		scaling: {
			label: {
				min: 2,
				max: 2,
			},
		},
	},
};
var nodeColor = "#ffffff";				// Background color of non-sink nodes
var nodeFontColor = "#000000";			// Font color of non-sink nodes
var sinkColor = "#000000";				// Background color of sink nodes
var sinkFontColor = "#ffffff";			// Font color of sink nodes

// create an array with nodes (offset measured in seconds)
var nodes = new vis.DataSet([
	{id: 1, label: '1'},
	{id: 2, label: '2'},
	{id: 3, label: '3'},
	{id: 4, label: '4'},
]);


// Orient max cycle in the counterclockwise direction:
var edges = new vis.DataSet([
	{from: 1, to: 2, value: 7},
	{from: 1, to: 3, value: 1},
	{from: 2, to: 3, value: 3},
	{from: 1, to: 4, value: 2},
	{from: 4, to: 2, value: 20},
]);

var minValue = 1
var maxValue = 20

// Startup function:
function createNetwork(){
	// Adds arrow information to edges:
	edges.forEach(function(item){
		arrowWidth = 12;
		if (item.value) {
			arrowWidth = 12+(34*item.value/(maxValue-minValue))
		};
		item.arrows = {
			to: {
				enabled: true,
				type: "image",
		        imageWidth: arrowWidth,
		        imageHeight: 22,
		        src: "arrow.svg"
			},
		};
		item.endPointOffset = {
			to: -8*(item.value/(maxValue-minValue))
		};
		edges.update(item);
	});
	// Creates network:
	container = document.getElementById('main-network');
	data = {
		nodes: nodes,
		edges: edges
	};
	network = new vis.Network(container, data, options);
	// Starts function that will be called on every frame:
	setTimeout(function(){
		requestAnimationFrame(fire);
	}, 700);
}


// Main recurring function, being called every keyframe:
function fire(){
	// Repeat itself:
	requestAnimationFrame(fire);
}


window.onload = function(){
	createNetwork();
}
