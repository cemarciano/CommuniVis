var network;							// Network objects
var data, edges;						// Networks data
var container;							// Networks DOM object
var options = {							// Networks initialization options
	layout: {randomSeed: 44},
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
	{id: 21, label: "Businessman #3"},
	{id: 22, label: "Elon Musk", informed: true},
	{id: 25, label: "Patriotic Person #1"},
]);


// Orient max cycle in the counterclockwise direction:
var edges = new vis.DataSet([
	{from: 1, to: 3, informed: true},
	{from: 1, to: 2, informed: true},
	{from: 1, to: 6},
	{from: 1, to: 7},
	{from: 1, to: 8},
	{from: 1, to: 9},
	{from: 1, to: 10},
	{from: 1, to: 11},
	{from: 1, to: 14},
	{from: 1, to: 15},
	{from: 1, to: 16},
	{from: 1, to: 19},
	{from: 1, to: 21},
	{from: 1, to: 25},
	{from: 2, to: 3, informed: true},
	{from: 2, to: 4, informed: true},
	{from: 2, to: 5, informed: true},
	{from: 2, to: 6},
	{from: 2, to: 7},
	{from: 2, to: 9},
	{from: 2, to: 10},
	{from: 2, to: 11},
	{from: 2, to: 12},
	{from: 2, to: 16},
	{from: 2, to: 17},
	{from: 2, to: 18},
	{from: 2, to: 19},
	{from: 2, to: 21},
	{from: 2, to: 22, informed: true},
	{from: 2, to: 25},
	{from: 3, to: 4, informed: true},
	{from: 3, to: 5, informed: true},
	{from: 3, to: 9},
	{from: 3, to: 10},
	{from: 3, to: 11},
	{from: 3, to: 14},
	{from: 3, to: 19},
	{from: 3, to: 21},
	{from: 3, to: 22, informed: true},
	{from: 3, to: 25},
	{from: 4, to: 12},
	{from: 4, to: 15},
	{from: 4, to: 16},
	{from: 4, to: 17},
	{from: 4, to: 22, informed: true},
	{from: 5, to: 9},
	{from: 5, to: 13},
	{from: 5, to: 18},
	{from: 5, to: 19},
	{from: 22, to: 21},
	{from: 22, to: 17},
	{from: 22, to: 8},

]);

var minValue = 1
var maxValue = 20

// Startup function:
function createNetwork(){
	// Adds arrow information to edges:
	edges.forEach(function(item){
		if (item.informed){
			item.value = 5;
		} else {
			arrowWidth = 12;
			item.arrows = {
				to: {
					enabled: true,
					type: "image",
					imageWidth: arrowWidth,
					imageHeight: 22,
					src: "arrow.svg"
				},
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
	var radiusInf = 200
	var radiusNot = 435
network.on('initRedraw', function () {
	var idsInf = data.nodes.get({
		filter: function (item) {
			return (item.informed === true);
		}
	}).map(item => item.id);
	var idsNot = data.nodes.get({
		filter: function (item) {
			return (item.informed !== true);
		}
	}).map(item => item.id);
  var dInf = 2 * Math.PI / idsInf.length // Angular pitch
  var dNot = 2 * Math.PI / idsNot.length // Angular pitch
  idsInf.forEach(function(id, i) {
    var x = radiusInf * Math.cos(dInf * i)
    var y = radiusInf * Math.sin(dInf * i)
    network.moveNode(id, x, y)
  })
  idsNot.forEach(function(id, i) {
    var x = radiusNot * Math.cos(dNot * i)
    var y = radiusNot * Math.sin(dNot * i)
    network.moveNode(id, x, y)
  })
})
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
