"use strict"

/**********************  START  **********************/
/******  Global variables for graph properties  ******/

// node visual properties
var nodeRadius = 8;
var nodeFill = "black";

// link visual properties
var link_stroke_opacity = '1';
var link_stroke_width = '2px';
var control_radius = 100;

// SVG stage properties
var graph_container = document.getElementsByClassName('graph-container')[0];
var graph_container_style = window.getComputedStyle(graph_container);
var w = parseFloat(graph_container_style.getPropertyValue('width'));
var h = parseFloat(graph_container_style.getPropertyValue('height'));

// Floorplan image properties
var floor_img = document.getElementsByClassName('floor-img');

for (var i = 0; i < floor_img.length; i++) {
  floor_img[i].style.width = w + 'px';
  floor_img[i].style.height = h + 'px';
  floor_img[i].style.position = 'absolute';
  floor_img[i].style.zIndex = '-1';
}

/***********************  END  ***********************/


/**********************  START  **********************/
/*************  Application starts here  *************/

$(function() {
  ajax_call_for_display_graph();

  // add click event listener to edit graph button
  $('.button.edit').on('click', function() {
    // detach the edit button but retain its event listeners
    // replace it with a save button and cancel button
    var edit_graph_btn = $('#edit-graph-btn').detach();
    $('#graph-controls').append(
      "<div>"
      + "<button type='button' id='save'>Save Graph</button>"
      + "</div>");
    $('#graph-controls').append(
      "<div>"
      + "<button type='button' id='cancel'>Cancel</button>"
      + "</div>");

    // "graph" object will be the storage of the graph data coming from
    // the ajax call
    var graph = {};

    // ajax call to get graph data
    $.ajax({
      url: 'http://localhost:3000/nodes',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        graph = {
          nodes: response.nodes,
          links: response.edges
        };

        $('#graph-container svg').remove();
        draw_graph_for_edit(graph);
      },
      error: function(req, status, err) {
        console.log(status, err);
      }
    });

    $('#cancel-edit-btn').on('click', function() {
      $('#save-graph-btn').remove();
      $('#cancel-edit-btn').remove();
      edit_graph_btn.appendTo($('#graph-controls'));

      $('#graph-container svg').remove();
      ajax_call_for_display_graph();
    });

    $('#save-graph-btn').on('click', function() {
      function get_updated_nodes() {
        var nodes = [];

        for (var i = 0; i < graph.nodes.length; i++) {
          if (graph.nodes[i].fixed == true) {
            nodes.push({
              'id': graph.nodes[i].id,
              'x': graph.nodes[i].x,
              'y': graph.nodes[i].y
            });
          }
        }

        return nodes;
      };

      var updated_nodes = get_updated_nodes();

      // if there are modified nodes
      if (updated_nodes.length !== 0) {
        $.ajax({
          url: 'http://localhost:3000/nodes/update',
          type: 'POST',
          data: {nodes: JSON.stringify(updated_nodes)},
          dataType: 'json',
          success: function(response) {
            if (response.success) {
              $('#save-graph-btn').remove();
              $('#cancel-edit-btn').remove();
              edit_graph_btn.appendTo($('#graph-controls'));

              $('#graph-container svg').remove();
              ajax_call_for_display_graph();
            }
          },
          error: function(req, status, err) {
            console.log(status, err);
          }
        });
      }
      // if there are no modified nodes
      else {
        $('#save-graph-btn').remove();
        $('#cancel-edit-btn').remove();
        edit_graph_btn.appendTo($('#graph-controls'));

        $('#graph-container svg').remove();
        ajax_call_for_display_graph();
      }

    });
  });
}); // end application block

/***********************  END  ***********************/

/*  This function gets the graph data containing the nodes with their
    coordinates set and the links in between nodes. After a successful AJAX call,
    it calls the draw_graph_for_display function and it passes to the function
    the graph data from the AJAX call.
*/
function ajax_call_for_display_graph() {
  // ajax call for guest users
  $.ajax({
    url: 'http://localhost:3000/nodes_for_display',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      draw_graph_for_display(response);
    },
    error: function(req, status, err) {
      console.log(status, err);
    }
  });
}

/*  arguments: Graph object that contains the nodes and links information
    return: create SVG DOM elements for the nodes and links

    This function is called when the admin users would like to edit the
    graph visual properties. All of the nodes (set and unset) are displayed
    in the SVG stage.
*/
function draw_graph_for_edit(graph) {
  // Create an SVG (Scalable Vector Graphics) for the graph visualization
  var vis = d3.select("div#graph-container").append("svg:svg")
      .attr("width", w)
      .attr("height", h);

  vis.append("rect")
    .attr("width", w)
    .attr("height", h)
    .style("fill", "none");

  // storage for modified array of links
  var links = [];

  // get the references to source and target nodes of each link
  // given the name of the node
  graph.links.forEach(function(link) {
    var source_node = graph.nodes.filter(function(node) {
      return node.id === link.source;
    })[0];
    var target_node = graph.nodes.filter(function(node) {
      return node.id === link.target;
    })[0];

    links.push({
      source: source_node,
      target: target_node,
      traffic: link.traffic
    });
  });

  graph.nodes.forEach(function(node) {
    if (node.x_coordinate !== null) {
      node.x = node.x_coordinate;
      node.y = node.y_coordinate;
    }
  });

  var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(links)
    .size([w, h])
    .start();

  var link = vis.append("svg:g").selectAll("path.link")
    .data(links)
    .enter()
    .append("svg:path")
    .attr("class", "link")

  // set the initial position (start and end points)
  // and the curvature of the links
  link.attr("d", function(d) {
    var dx = d.target.x - d.source.x;
    var dy = d.target.y - d.source.y;
    var dr = Math.sqrt(dx * dx + dy * dy);

    return "M" + d.source.x + "," + d.source.y
      + "A" + dr + "," + dr
      + " 0 0,1 " + d.target.x
      + "," + d.target.y;
  });

  // add css styles to links
  link.attr('stroke', function(d) {
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
    })
    .attr('stroke-opacity', link_stroke_opacity)
    .attr('stroke-width', function(d) {
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
    })
    .attr('fill', 'none');

  // Add drag and drop functionality to the nodes
  var node_drag = d3.behavior.drag()
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
      force.stop() // stops the force auto positioning before you start dragging
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

  // Create nodes by adding SVG g elements inside the SVG stage.
  // The SVG g (group) element allows us to separate svg elements for each node.
  var node = vis.selectAll("g.node")
      .data(graph.nodes)
    .enter().append("svg:g")
      .attr("class", "node")
      .call(node_drag);

  // Add a SVG circle element that will visually represent the
  // node inside a node group.
  node.append("svg:circle").attr("class", "circle")
    .attr("cx", function(d) { return "0px"; })
    .attr("cy", function(d) { return "0px"; })
    .attr("r", nodeRadius)
    .attr('stroke', 'black')
    .attr('stroke-width', '2px')
    .attr("fill", function(d) {
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

  // Add a label to a node by adding a SVG text element inside a node group
  node.append("svg:text").attr("class", "nodetext")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.label; });

  force.on("tick", tick);

  /* This function is called whenever a node is drag to a new position.
    Return: Moves the node and other svg elements related to it to a new position.
      It also calculates the new curvature for the link between nodes.
  */
  function tick() {
    link.attr("d", function(d) {
      var dx = d.target.x - d.source.x;
      var dy = d.target.y - d.source.y;
      var dr = Math.sqrt(dx * dx + dy * dy);

      return "M" + d.source.x + "," + d.source.y
        + "A" + dr + "," + dr
        + " 0 0,1 " + d.target.x
        + "," + d.target.y;
    });

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
} // end for function draw_graph_for_edit

/*
  arguments: graph object containing the nodes and links
  return: create SVG DOM elements for the nodes and links

  This function is used when the graph is in view mode. Only those nodes
  that have their coordinates set will be displayed in view mode.
*/
function draw_graph_for_display(graph) {
  // add a SVG stage element inside div#graph-container with its
  // width and height equal to the width and height of div#graph-container
  var vis = d3.select("div#floor1 .graph-container").append("svg:svg")
      .attr("width", w)
      .attr("height", h);

  // storage for modified array of links
  var links = [];

  // get the object references to source and target nodes
  // of each link given the name of the node
  graph.links.forEach(function(link) {
    var source_node = graph.nodes.filter(function(node) {
      return node.id === link.source;
    })[0];
    var target_node = graph.nodes.filter(function(node) {
      return node.id === link.target;
    })[0];

    links.push({
      source: source_node,
      target: target_node,
      traffic: link.traffic
    });
  });

  // Create the links by adding SVG path elements inside the SVG stage.
  var link = vis.append("svg:g").selectAll("path.link")
    .data(links)
    .enter()
    .append("svg:path")
    .attr("class", "link")

  // The "d" attribute of the SVG path element specifies the type of path
  // that links the two nodes. In this case, the type of path is an arc
  link.attr("d", function(d) {
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


      var con_c = ((d1.x*d1.x) + (d1.y*d1.y) - (d2.x*d2.x) - (d2.y*d2.y)) / (2*(d2.y-d1.y));
      var con_d = (d2.x-d1.x) / (d2.y-d1.y);

      var a = (1 + (con_d*con_d));
      var b = (2*con_c*con_d - 2*midx + 2*con_d*midy);
      var c = ((midx*midx) + (con_c*con_c) + (2*con_c*midy) + (midy*midy) - (control_radius*control_radius));

      var discriminant = (b*b) - (4*a*c);

      var px1 = (-b + Math.sqrt(discriminant)) / (2*a);
      var px2 = (-b - Math.sqrt(discriminant)) / (2*a);

      // difference between node point and px1 (px2)
      var dpx1 = Math.abs(px1 - d1.x);
      var dpx2 = Math.abs(px2 - d1.x);

      // (px,py) is the coordinate of the control point
      // for the quadratic bezier curve
      var px = 0;

      if (dpx1 > dpx2) {
        px = px2;
      } else {
        px = px1;
      }

      var py = (-1)*con_c - (con_d*px);

      // if the midpoint is near the top side of the svg stage
      if ((midy - control_radius) < 0) {
        py = 0;
      }
      // if the midpoint is near the bottom side of the svg stage
      else if ((midy + control_radius) > h) {
        py = h;
      }

      // if the midpoint is near the left side of the svg stage
      if ((midx - control_radius) < 0) {
          px = 0;
      }
      // if the midpoint is near the right side of the svg stage
      else if ((midx + control_radius) > w) {
        px = w;
      }

      // return a quadratic bezier curve
      return "M " + d1.x + "," + d1.y
        + " Q " + px + "," + py
        + " " + d2.x + "," + d2.y;
    });

  // add css styles to links
  link.attr('stroke', function(d) {
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
    })
    .attr('stroke-opacity', link_stroke_opacity)
    .attr('stroke-width', function(d) {
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
    })
    .attr('fill', 'none');

  function handle_mouse_over(d, i) {

  }

  function handle_mouse_out(d, i) {

  }

  // Create nodes by adding SVG g elements inside the SVG stage.
  // The SVG g (group) element allows us to separate svg elements for each node.
  var node = vis.selectAll("g.node")
      .data(graph.nodes)
    .enter().append("svg:g")
      .attr("class", "node");

  // add a svg:circle element inside a node group
  node.append("svg:circle").attr("class", "circle")
    .attr("cx", function(d) { return d.x_coordinate; })
    .attr("cy", function(d) { return d.y_coordinate; })
    .attr("r", nodeRadius)
    .attr('stroke', 'black')
    .attr('stroke-width', '2px')
    .attr("fill", function(d) {
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
    })
    .on('mouseover', handle_mouse_over)
    .on('mouseout', handle_mouse_out);

  // add a svg:text element inside a node group
  // and set the x and y attributes of the svg:text element
  // similar to the node's svg:circle element's x and y attributes
  node.append("svg:text").attr("class", "nodetext")
    .attr("x", function(d) {
      return d.x_coordinate;
    })
    .attr("y", function(d) {
      return d.y_coordinate;
    })
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.label; });

  /*
    Arguments: node_data is an object containing the node's properties
    Returns the html code to be placed in the tooltip area
  */
  function tooltip_contents(node_data) {
    var html = ""
      + "<div class='tooltip-row'>Mac Address: " + node_data.mac_address + "</div>"
      + "<div class='tooltip-row'>Last Transmission: " + node_data.last_transmission + "</div>"
      + "<div class='tooltip-row'>Packets Sent: " + node_data.packets_sent + "</div>"
      + "<div class='tooltip-row'>Packets Received: " + node_data.packets_received + "</div>";
    return html;
  }

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
        var contents = tooltip_contents($(this).prop("__data__"));
        return contents;
      }
    }
  });
} // end function draw_graph_for_display
