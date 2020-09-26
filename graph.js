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
	{id: 1, label: 'Bolsonaro', informed: true},
	{id: 2, label: 'W.H.O.', informed: true},
	{id: 3, label: 'Trump', informed: true},
	{id: 4, label: 'Cardi B', informed: true},
	{id: 5, label: 'Justin Trudeau', informed: true},
	{id: 6, label: "Bolsonaro's Son #1"},
	{id: 7, label: "Bolsonaro's Son #2"},
	{id: 8, label: "Religious Person #1"},
	{id: 9, label: "Religious Person #2"},
	{id: 10, label: "Religious Person #3"},
	{id: 11, label: "Religious Person #4"},
	{id: 12, label: "Feminist Person #1"},
	{id: 13, label: "Very Poor Person #1"},
	{id: 14, label: "Very Poor Person #2"},
	{id: 15, label: "Very Poor Person #3"},
	{id: 16, label: "Rebel Teenager #1"},
	{id: 17, label: "Vegan Person #1"},
	{id: 18, label: "Businessman #1"},
	{id: 19, label: "Businessman #2"},
	{id: 20, label: "Businessman #3"},
	{id: 21, label: "Businessman #4"},
	{id: 22, label: "Elon Musk", informed: true},
	{id: 23, label: "Macron", informed: true},
	{id: 24, label: "Angela Merkel", informed: true},
	{id: 25, label: "Patriotic Person #1"},
]);


// Orient max cycle in the counterclockwise direction:
var edges = new vis.DataSet([
	{from: 1, to: 3, value: 1},
	{from: 1, to: 2, value: 1},
	{from: 2, to: 1, value: 1},
	{from: 2, to: 3, value: 1},
	{from: 2, to: 4, value: 1},
	{from: 2, to: 5, value: 1},
	{from: 2, to: 6, value: 1},
	{from: 2, to: 7, value: 1},
	{from: 2, to: 9, value: 1},
	{from: 2, to: 12, value: 1},
	{from: 2, to: 16, value: 1},
	{from: 2, to: 17, value: 1},
	{from: 2, to: 18, value: 1},
	{from: 2, to: 19, value: 1},
	{from: 2, to: 20, value: 1},
	{from: 2, to: 21, value: 1},
	{from: 2, to: 22, value: 1},
	{from: 2, to: 23, value: 1},
	{from: 2, to: 24, value: 1},
	{from: 3, to: 4, value: 1},
	{from: 3, to: 5, value: 1},
	{from: 3, to: 9, value: 1},
	{from: 3, to: 19, value: 1},
	{from: 3, to: 20, value: 1},
	{from: 3, to: 21, value: 1},
	{from: 3, to: 22, value: 1},
	{from: 3, to: 23, value: 1},
	{from: 3, to: 24, value: 1},
]);

var minValue = 1
var maxValue = 20

// Startup function:
function createNetwork(){
	// Adds arrow information to edges:
	edges.forEach(function(item){
		if (!item.informed){
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
		}
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
