"use strict"

const BASEURL = "http://localhost:3000";
// node visual properties
const NODERADIUS = 8;
const NODEFILL = "black";
// link visual properties
const LINKSTROKEOPACITY = '1';
const LINKSTROKEWIDTH = '2px';
const UPDATERATE = 100000;

/*************  Application starts here  *************/

var event_handler = new EventHandler();
var graph_data = new GraphData($('.floor').length);
var graph_drawer = new MultiGraphDrawer();
var ui = new UI();

$(function() {
  ui.init();
  ui.setFloorImageDimensions();

  graph_data.getDataForDisplay();
  var display_timer = setInterval(function() {
    graph_data.getDataForDisplay();
  }, UPDATERATE);

  // add click event listener to edit graph button
  $('.edit-btn').on('click', function() {
    clearInterval(display_timer);
    event_handler.editBtnClicked(this.dataset.floorNumber);

    // add event handler to cancel button
    $('.cancel-btn').on('click', function() {
      event_handler.cancelBtnClicked();
    });

    // add event handler to save button
    $('.save-btn').on('click', function() {
      event_handler.saveBtnClicked();
    });
  });
}); // end application block

/***********************  END  ***********************/


/*********************  UI Class  ********************/

function UI() {
  this.svgWidth = null;
  this.svgHeight = null;
}

UI.prototype.init = function() {
  this.setFloorImageDimensions();
  this.setScrollToLink();
  this.setNavbars();
}

UI.prototype.setFloorImageDimensions = function() {
  // SVG stage and floorplan image properties
  var graph_container = document.getElementsByClassName('graph-container');
  var graph_container_style = window.getComputedStyle(graph_container[0]);
  var floor_img = document.getElementsByClassName('floor-img');
  var floor_img_style = window.getComputedStyle(floor_img[0]);
  var img_border = parseFloat(floor_img_style.getPropertyValue('border-top-width'));
  var container_width = parseFloat(graph_container_style.getPropertyValue('width'));
  var container_height = parseFloat(graph_container_style.getPropertyValue('height'));

  this.svgWidth = container_width - img_border;
  this.svgHeight = container_height - img_border;

  for (var i = 0; i < floor_img.length; i++) {
    floor_img[i].style.width = this.svgWidth.toString() + 'px';
    floor_img[i].style.height = this.svgHeight.toString() + 'px';
  }
}

UI.prototype.setScrollToLink = function() {
  $('.floor-link').on('click', function() {
    var link = '#floor' + this.dataset.floorNumber.toString();
    var top_offset = $('.main-nav').outerHeight(); // offset covered by navbar

    $('html, body').animate({
      scrollTop: $(link).offset().top - top_offset
    }, 750);
  });
}

UI.prototype.setNavbars = function() {
  var main_nav = $('.main-nav');
  var side_nav = $('.nav-side');

  // compute for the scroll top value where the header is not seen anymore
  var header = document.getElementsByClassName('nav-top')[0];
  var header_styles = window.getComputedStyle(header);
  var scroll_offset = parseInt(header_styles.getPropertyValue('height'))
    + parseInt(header_styles.getPropertyValue('margin-bottom'));

  // classes to be added
  var mn_class = 'main-nav-scrolled';
  var sn_class = 'nav-side-scrolled';

  // set the margin bottom of main nav to negative of its height
  main_nav.css('margin-bottom', (main_nav.outerHeight() * (-1)).toString() + 'px');

  $(window).scroll(function() {
    // if header is not seen anymore
    if ($(this).scrollTop() > scroll_offset) {
      main_nav.addClass(mn_class);

      var sn_width = side_nav.css('width');
      side_nav.addClass(sn_class);
      side_nav.css('width', sn_width);
    }
    // if header can be seen in the window
    else {
      main_nav.removeClass(mn_class);
      side_nav.removeClass(sn_class);
    }
  });
}

/*******************  END UI Class  ******************/


/****************  EventHandler Class  ***************/

function EventHandler() {}

EventHandler.prototype.editBtnClicked = function(floorNumber) {
  // remove the edit button and replace it with a save
  // button and cancel button
  var edit_btns = $('.edit-btn').remove();
  var floor_labels = $('.floor-label');

  // remove all DOM elements inside the floor-group div
  var floor_group = $('.floor-group')[0];
  while (floor_group.firstChild) {
    floor_group.removeChild(floor_group.firstChild);
  }

  // add the new floor label inside the floor group div
  floor_group.innerHTML = this.newFloorLabel(floorNumber);

  // add css properties to the floor image
  var newFloorImg = $('.floor-img')[0];
  newFloorImg.style.width = ui.svgWidth.toString() + 'px';
  newFloorImg.style.height = ui.svgHeight.toString() + 'px';
  newFloorImg.style.position = 'absolute';
  newFloorImg.style.zIndex = '-1';

  graph_data.getDataForEdit(floorNumber);
}

EventHandler.prototype.getUpdatedNodes = function() {
  var nodes = graph_data.graphDrawer.nodes;
  var modifiedNodes = [];

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].fixed == true) {
      modifiedNodes.push({
        'id': nodes[i].id,
        'x': nodes[i].x,
        'y': nodes[i].y
      });
    }
  }

  return modifiedNodes;
}

EventHandler.prototype.updateNodes = function(updatedNodes) {
  $.ajax({
    url: BASEURL + '/nodes/update',
    type: 'POST',
    data: {nodes: JSON.stringify(updatedNodes)},
    dataType: 'json',
    success: function(response) {
      location.reload();
    }
  });
}

EventHandler.prototype.cancelBtnClicked = function() {
  location.reload();
}

EventHandler.prototype.saveBtnClicked = function() {
  var updatedNodes = this.getUpdatedNodes();

  // if there are modified nodes
  if (updatedNodes.length !== 0) {
    this.updateNodes(updatedNodes);
  }
}

EventHandler.prototype.newFloorLabel = function(floorNumber) {
  // create the new floor label div with corresponding floor number
  var newFloorLabel = ''
    + '<div class="floor" id="floor' + floorNumber.toString() + '">'
      + '<div class="floor-label">'
        + '<span>Floor ' + floorNumber.toString() + '</span>'
        + '<button type="button" class="success button save-btn">Save Graph</button>'
        + '<button type="button" class="success button cancel-btn">Cancel</button>'
      + '</div> <!-- end .floor-label -->'
      + '<div class="floor-graph">'
        + '<div class="graph-container">'
          + '<img src="/images/floorplan7.jpg" class="floor-img">'
        + '</div> <!-- end .graph-container -->'
      + '</div> <!-- end .floor-graph -->'
    + '</div> <!-- end .floor#floor1 -->';

    return newFloorLabel;
}

/**************  END EventHandler Class  *************/


/****************  GraphPerFloor Class  **************/

function GraphPerFloor(floorNumber, nodes, links) {
  this.nodes = nodes;
  this.links = links;
  this.floorNumber = floorNumber;
}

/**************  END GraphPerFloor Class  ************/


/******************  GraphData Class  ****************/

function GraphData(floorCount) {
  this.floorCount = floorCount;
  this.graphData = null;
  this.graphPerFloor = [];
  this.graphDrawer = null;
}

/*  This function gets the graph data containing the nodes with their
    coordinates set and the links in between nodes. After a successful AJAX call,
    it calls the draw_graph_for_display function and it passes to the function
    the graph data from the AJAX call.
*/
GraphData.prototype.getDataForDisplay = function() {
  var graphDataObj = this;

  // ajax call for guest users
  $.ajax({
    url: BASEURL + "/nodes_for_display",
    type: "GET",
    dataType: "json",
    success: function(graphData) {
      graphDataObj.getGraphPerFloor(graphData);
      graph_drawer.drawGraphsForDisplay(graphDataObj.graphPerFloor);

    },
    error: function(req, status, err) {
      console.log(status, err);
    }
  });
}

GraphData.prototype.getDataForEdit = function(floorNumber) {
  var graphDataObj = this;

  // ajax call to get graph data
  $.ajax({
    url: BASEURL + '/nodes/' + floorNumber.toString(),
    type: 'GET',
    dataType: 'json',
    success: function(graph) {
      var links = graphDataObj.modifyLinks(graph.nodes, graph.links);
      var nodes = graphDataObj.modifyNodes(graph.nodes);

      graphDataObj.graphDrawer = new SingleGraphDrawer(nodes, links, floorNumber);
      graphDataObj.graphDrawer.drawGraphForEdit();
    },
    error: function(req, status, err) {
      console.log(status, err);
    }
  });
}

/*  arguments: unsorted graph dataset
    return: Returns an array of graph dataset where each graph dataset element
      corresponds to one floor.
*/
GraphData.prototype.getGraphPerFloor = function(graphData) {
  this.graphData = graphData;

  for (var i = 0; i < this.floorCount; i++) {
    var nodes = this.graphData.nodes.filter(function(node) {
      return node.floor_number === (i + 1);
    })

    var links = this.graphData.links.filter(function(link) {
      return link.floor_number === (i + 1);
    });

    links = this.modifyLinks(nodes, links);

    this.graphPerFloor.push(new GraphPerFloor(i + 1, nodes, links));
  }
}

GraphData.prototype.modifyLinks = function(nodes, links) {
  var modifiedLinks = [];

  for (var i = 0; i < links.length; i++) {
    var sourceNode = null;
    var targetNode = null;

    for (var j = 0; j < nodes.length; j++) {
      if (nodes[j].id === links[i].source) {
        sourceNode = nodes[j];
      } else if (nodes[j].id === links[i].target) {
        targetNode = nodes[j];
      }

      if (sourceNode !== null && targetNode !== null) {
        break;
      }
    }

    modifiedLinks.push({
      source: sourceNode,
      target: targetNode,
      traffic: links[i].traffic
    });
  }

  return modifiedLinks;
}

GraphData.prototype.modifyNodes = function(nodes) {
  var modifiedNodes = [];
  nodes.forEach(function(node) {
    if (node.x_coordinate !== null) {
      node.x = node.x_coordinate;
      node.y = node.y_coordinate;
    }
    modifiedNodes.push(node);
  });

  return modifiedNodes;
}

/****************  END GraphData Class  **************/


/***************  MultiGraphDrawer Class  ************/

function MultiGraphDrawer() {
  this.graphsDisplayed = false;
}

/*
  @param graphPerFloor = array
*/
MultiGraphDrawer.prototype.drawGraphsForDisplay = function(graphPerFloor) {
  for (var i = 0; i < graphPerFloor.length; i++) {
    if (this.graphsDisplayed) {
      (new SingleGraphDrawer(graphPerFloor[i].nodes, graphPerFloor[i].links,
        graphPerFloor[i].floorNumber)).updateGraphDisplay();
    }
    else {
      (new SingleGraphDrawer(graphPerFloor[i].nodes, graphPerFloor[i].links,
        graphPerFloor[i].floorNumber)).drawGraphDisplay();
    }
  }

  if (this.graphsDisplayed === false) this.graphsDisplayed = true;
}

/*************  END MultiGraphDrawer Class  **********/


/***************  SingleGraphDrawer Class  ***********/

function SingleGraphDrawer(nodes, links, floorNumber) {
  this.floorNumber = floorNumber;
  this.nodes = nodes;
  this.links = links;
  this.svgStage = null;
  this.width = ui.svgWidth;
  this.height = ui.svgHeight;
  this.linkSelection = null;
  this.nodeSelection = null;
  this.floorSelector = "div#floor" + floorNumber.toString() + " .graph-container";
  this.force = null;
  this.forEdit = false;
}

SingleGraphDrawer.prototype.createArrowHead = function() {
  // build the arrow.
  this.svgStage.append("defs")
    .append("marker")
      .attr("id", "end")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 13)
      .attr("refY", 0)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5");
}

SingleGraphDrawer.prototype.drawGraphDisplay = function() {
  // initial graph display
  this.initSVGStage();
  this.createArrowHead();
  this.getLinkSelection();
  this.getNodeSelection();
  this.createSVGLinks();
  this.createSVGNodes();
}

SingleGraphDrawer.prototype.updateGraphDisplay = function() {
  // update graph display
  this.getSVGStage();
  this.removeOldSVGLinks();
  this.updateSVGLinks();
}

SingleGraphDrawer.prototype.drawGraphForEdit = function() {
  this.forEdit = true;
  this.initSVGStage();
  this.initForceLayout();
  this.getNodeSelection();
  this.createSVGNodesForEdit();
  this.addNodeDragBehavior();
}

SingleGraphDrawer.prototype.createSVGNodesForEdit = function() {
  this.nodeSelection.enter().append("g")
    .attr("class", "node");

  this.createNodeCircle();
  this.createNodeLabel();
}

SingleGraphDrawer.prototype.getNodeDragBehavior = function() {
  var force = this.force;
  var tick = this.getTick();

  var nodeDrag = d3.behavior.drag()
    .on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);

  /* arguments: d = node object,
        i = index of the node object from the node array defined in the graph object
    return: This function stops the force-layout algorithm of d3js when
      a node is being dragged so that the force-layout will not affect the
      placing of the node to its new position.
  */
  function dragstart(d, i) {
    force.stop(); // stops the force auto positioning before you start dragging
  }

  /* arguments: d = node object,
        i = index of the node object from the node array defined in the graph object
    return: This function saves the new coordinate of the node to px,py,x,y
      properties of the node object. After that, the tick function is called
      to make visual changes to the position of the node and other svg elements
      related to it.
  */
  function dragmove(d, i) {
    d.px += d3.event.dx;
    d.py += d3.event.dy;
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    tick(); // this is the key to make it work together with updating both px,py,x,y on d !
  }

  /*  arguments: d = node object,
        i = index of the node object from the node array defined in the graph object
      return: After dragging a node, the node's "fixed" property will be set to true.
        This will prevent the force-layout algorithm of d3js to make changes to
        this node when other nodes are dragged.
  */
  function dragend(d, i) {
    d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
    tick();
    force.resume();
  }

  return nodeDrag;
}

SingleGraphDrawer.prototype.getTick = function() {
  var node = this.nodeSelection;

  /* This function is called whenever a node is drag to a new position.
    Return: Moves the node and other svg elements related to it to a new position.
      It also calculates the new curvature for the link between nodes.
  */
  var tick = function() {
    node.select('circle.circle')
      .attr('transform', function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    node.select("text.nodetext")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
  }

  return tick;
}

SingleGraphDrawer.prototype.addNodeDragBehavior = function() {
  this.nodeSelection.call(this.getNodeDragBehavior());
  this.force.on("tick", this.getTick());
}

SingleGraphDrawer.prototype.initForceLayout = function() {
  this.force = d3.layout.force()
    .nodes(this.nodes)
    .links(this.links)
    .size([ui.svgWidth, ui.svgHeight])
    .start();
}

SingleGraphDrawer.prototype.initSVGStage = function() {
  this.svgStage = d3.select(this.floorSelector).append("svg")
    .attr("width", this.width)
    .attr("height", this.height);

  // add svg group elements for the links and nodes
  this.svgStage.append("g").attr("class", "links-group");
  this.svgStage.append("g").attr("class", "nodes-group");
}

SingleGraphDrawer.prototype.getSVGStage = function() {
  this.svgStage = d3.select(this.floorSelector);
}

SingleGraphDrawer.prototype.getLinkSelection = function() {
  this.linkSelection = this.svgStage.select("g.links-group")
    .selectAll("path.link")
    .data(this.links);
}

SingleGraphDrawer.prototype.getNodeSelection = function() {
  this.nodeSelection = this.svgStage.select("g.nodes-group")
    .selectAll("g.node")
    .data(this.nodes);
}

SingleGraphDrawer.prototype.createSVGLinks = function() {
  this.createArrowHead();

  // "Enter" sub-selection
  this.linkSelection.enter()
    .append("path")
    .attr("class", "link")
    .attr("marker-end", "url(#end)"); // add the marker

  this.computeLinkCurvature();
  this.setStylesToLinks();
}

SingleGraphDrawer.prototype.removeOldSVGLinks = function() {
  this.linkSelection = this.svgStage.select("g.links-group")
    .selectAll("path.link").data([]);
  this.linkSelection.exit().remove();
}

SingleGraphDrawer.prototype.updateSVGLinks = function() {
  this.linkSelection = this.linkSelection.data(this.links);
  this.createSVGLinks();
}

SingleGraphDrawer.prototype.computeLinkCurvature = function() {
  // The "d" attribute of the SVG path element specifies the type of path
  // that links the two nodes. In this case, the type of path is an arc
  this.linkSelection.attr("d", function(d) {
    var d1 = {
      x: d.source.x_coordinate,
      y: d.source.y_coordinate
    };

    var d2 = {
      x: d.target.x_coordinate,
      y: d.target.y_coordinate
    };

    // get the x and y differentials
    var dx = (d.target.x_coordinate - d.source.x_coordinate);
    var dy = (d.target.y_coordinate - d.source.y_coordinate);

    // compute for the distance between the two points
    var dr = Math.sqrt(dx * dx + dy * dy);

    // get the midpoint of the two points
    var midx = (d.target.x_coordinate + d.source.x_coordinate) / 2.0;
    var midy = (d.target.y_coordinate + d.source.y_coordinate) / 2.0;


    var conC = ((d1.x*d1.x) + (d1.y*d1.y) - (d2.x*d2.x) - (d2.y*d2.y)) / (2*(d2.y-d1.y));
    var conD = (d2.x-d1.x) / (d2.y-d1.y);

    // 40% of midpoint distance
    var linkRadius = 0.4 * dr / 2;

    var a = (1 + (conD*conD));
    var b = (2*conC*conD - 2*midx + 2*conD*midy);
    var c = ((midx*midx) + (conC*conC) + (2*conC*midy) + (midy*midy) - (linkRadius*linkRadius));

    var discriminant = (b*b) - (4*a*c);

    var px1 = (-b + Math.sqrt(discriminant)) / (2*a);
    var px2 = (-b - Math.sqrt(discriminant)) / (2*a);

    // difference between node point (source node) and px1 (px2)
    var dpx1 = Math.abs(px1 - d1.x);
    var dpx2 = Math.abs(px2 - d1.x);

    // (px,py) is the coordinate of the control point
    // for the quadratic bezier curve
    var px = 0;

    if (dpx1 > dpx2) {
      // link is concave left or concave down
      px = px2;
    } else {
      // link is concave right or concave up
      px = px1;
    }

    var py = (-1)*conC - (conD*px);

    // if the midpoint is near the top side of the svg stage
    if ((midy - linkRadius) < 0) {
      py = 0;
    }
    // if the midpoint is near the bottom side of the svg stage
    else if ((midy + linkRadius) > ui.svgHeight) {
      py = ui.svgHeight;
    }

    // if the midpoint is near the left side of the svg stage
    if ((midx - linkRadius) < 0)  {
        px = 0;
    }
    // if the midpoint is near the right side of the svg stage
    else if ((midx + linkRadius) > ui.svgWidth) {
      px = ui.svgWidth;
    }

    // return a quadratic bezier curve
    return "M " + d1.x + "," + d1.y
      + " Q " + px + "," + py
      + " " + d2.x + "," + d2.y;
  });
}

SingleGraphDrawer.prototype.setStylesToLinks = function() {
  this.setLinkStroke();
  this.setLinkStrokeWidth();
  this.linkSelection.attr('stroke-opacity', LINKSTROKEOPACITY);
  this.linkSelection.attr('fill', 'none');
}

SingleGraphDrawer.prototype.setLinkStroke = function() {
  this.linkSelection.attr('stroke', function(d) {
      switch (d.traffic) {
        case 'heavy':
          return '#FF0000';
          break;
        case 'moderate':
          return '#0000CD';
          break;
        case 'light':
          return '#008000';
          break;
      }
    });
}

SingleGraphDrawer.prototype.setLinkStrokeWidth = function()  {
  this.linkSelection.attr('stroke-width', function(d) {
    switch (d.traffic) {
      case 'heavy':
        return '6px';
        break;
      case 'moderate':
        return '3px';
        break;
      case 'light':
        return '1px';
        break;
    }
  });
}

SingleGraphDrawer.prototype.createSVGNodes = function() {
  this.nodeSelection.enter()
    .append("g")
    .attr("class", "node");

  this.createNodeCircle();
  this.createNodeLabel();
  this.createTooltip();
}

// add a svg:circle element inside a node group
SingleGraphDrawer.prototype.createNodeCircle = function() {
  var graphForEdit = this.forEdit;
  var nodeCircle = this.nodeSelection.append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) {
      if (graphForEdit) {
        return "0px";
      } else {
        return d.x_coordinate;
      }
    })
    .attr("cy", function(d) {
      if (graphForEdit) {
        return "0px";
      } else {
        return d.y_coordinate;
      }
    })
    .attr("r", NODERADIUS);

  this.setStylesToCircle(nodeCircle);
  this.setNodeColor(nodeCircle);

  if (!this.forEdit) {
    this.addClickEventToCircle(nodeCircle);
  }
}

SingleGraphDrawer.prototype.addClickEventToCircle = function(nodeCircle) {
  nodeCircle.on("click", function() {
    var nodeID = this.__data__.id;

    window.open(BASEURL + "/node/" + nodeID, "_blank");
  });
  nodeCircle.attr("cursor", "pointer");
}

SingleGraphDrawer.prototype.setStylesToCircle = function(nodeCircle) {
  nodeCircle.attr("stroke", "black")
    .attr("stroke-width", "2px");
}

SingleGraphDrawer.prototype.setNodeColor = function(nodeCircle) {
  nodeCircle.attr("fill", function(d) {
    switch (d.sensor_type) {
      case 'Temperature':
        return '#FFF44D';
        break;
      case 'Humidity':
        return '#E8850C';
        break;
      case 'Light Intensity':
        return '#FF0093';
        break;
      case 'Pressure':
        return '#76FFED';
        break;
    }
  });
}

// add a svg:text element inside a node group
// and set the x and y attributes of the svg:text element
// similar to the node's svg:circle element's x and y attributes
SingleGraphDrawer.prototype.createNodeLabel = function() {
  this.nodeSelection.append("text")
    .attr("class", "nodetext")
    .attr("x", function(d) { return d.x_coordinate; })
    .attr("y", function(d) { return d.y_coordinate; })
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.label; });
}

SingleGraphDrawer.prototype.createTooltip = function() {
  var singleGraphDrawerObj = this;

  // Add tooltip functionality to each circle SVG DOM element
  // having a class name 'circle'
  $('circle.circle').qtip({
    // "this" currently points to a single circle SVG DOM element
    style: {
      classes: 'custom-tooltip'  // add user-defined classes to the tooltip
    },
    content: {
      // $(this).prop("__data__") returns an object
      // containing the node's properties
      title: function(event, api) {
        return $(this).prop("__data__").label;
      },
      text: function(event, api) {
        var contents = singleGraphDrawerObj.tooltipContents($(this).prop("__data__"));
        return contents;
      }
    }
  });
}

SingleGraphDrawer.prototype.tooltipContents = function(node_data) {
  var html = ""
    + "<div class='tooltip-row'>Mac Address: " + node_data.mac_address + "</div>"
    + "<div class='tooltip-row'>Last Transmission: " + node_data.last_transmission + "</div>"
    + "<div class='tooltip-row'>Packets Sent: " + node_data.packets_sent + "</div>"
    + "<div class='tooltip-row'>Packets Received: " + node_data.packets_received + "</div>";
  return html;
}

/*************  END SingleGraphDrawer Class  *********/
