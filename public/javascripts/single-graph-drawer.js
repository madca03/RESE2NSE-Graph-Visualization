/***************  SingleGraphDrawer Class  ***********/

function SingleGraphDrawer(floor) {
  this.floorNumber = floor.floorNumber;
  this.nodes = floor.nodes;
  this.links = floor.links;
  this.svgStage = null;
  this.width = ui.svgWidth;
  this.height = ui.svgHeight;
  this.linkSelection = null;
  this.nodeSelection = null;
  this.floorSelector = "div#floor" + this.floorNumber.toString() + " .graph-container";
  this.force = null;
  this.forEdit = false;
  this.baseGraphContainerWidth = 866;
  this.baseGraphContainerHeight = 396;
  this.updateJustEnabled = floor.updateJustEnabled;
}

SingleGraphDrawer.prototype.createArrowHead = function() {
  // build the arrow.
  if (this.svgStage.select("defs")[0][0] === null) {
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
}

SingleGraphDrawer.prototype.drawGraphDisplay = function() {
  // initial graph display
  this.initSVGStage();
  this.createArrowHead();
  this.getLinkSelection();
  this.getNodeSelection();
  this.scaleNodePosition();
  this.createSVGLinks();
  this.createSVGNodes();
}

SingleGraphDrawer.prototype.updateGraphDisplay = function() {
  // This block is for normal graph update
    this.getSVGStage();
    this.removeSVGLinks();

    this.getNodeSelection();
    this.getLinkSelection();

    this.scaleNodePosition();
    this.createSVGLinks();

    if (this.updateJustEnabled) {
      this.removeSVGNodes();
      this.getNodeSelection();
      this.createSVGNodes();
    }
}

SingleGraphDrawer.prototype.updateArchiveGraphDisplay = function() {
  // This block is for updating the graph display for archive graph dataset
    this.getSVGStage();
    this.removeSVGLinks();
    this.removeSVGNodes();

    this.getNodeSelection();
    this.getLinkSelection();

    this.scaleNodePosition();
    this.createSVGLinks();
    this.createSVGNodes();
}

SingleGraphDrawer.prototype.removeSVGLinks = function() {
  $(this.floorSelector + " svg g.links-group").empty();
}

SingleGraphDrawer.prototype.removeSVGNodes = function() {
  $(this.floorSelector + " svg g.nodes-group").empty();
}

SingleGraphDrawer.prototype.scaleNodePosition = function() {
  var currentSVGWidth = this.width;
  var currentSVGHeight = this.height;
  var baseGraphContainerWidth = this.baseGraphContainerWidth;
  var baseGraphContainerHeight = this.baseGraphContainerHeight;

  // change cx and cy attribute of the circle for the window resize event
  this.nodeSelection.selectAll('circle')
    .attr('cx', function(d) {
      var scaledX = (currentSVGWidth * d.x_coordinate) / baseGraphContainerWidth;
      return scaledX;
    })
    .attr('cy', function(d) {
      var scaledY = (currentSVGHeight * d.y_coordinate) / baseGraphContainerHeight;
      return scaledY;
    });

  // change the x and y attribute of the node label (svg text) for the window resize event
  this.nodeSelection.selectAll('text')
    .attr("x", function(d) {
      var scaledX = (currentSVGWidth * d.x_coordinate) / baseGraphContainerWidth;
      return scaledX;
    })
    .attr("y", function(d) {
      var scaledY = (currentSVGHeight * d.y_coordinate) / baseGraphContainerHeight;
      return scaledY;
    });
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
  this.svgStage = d3.select(this.floorSelector).select('svg');
  this.svgStage.attr("width", this.width);
  this.svgStage.attr("height", this.height);
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

/**
 * This method SVG nodes from the previous graph dataset.
 */
SingleGraphDrawer.prototype.removeOldSVGNodes = function() {
  this.nodeSelection = this.svgStage.select("g.nodes-group")
    .selectAll("g.node")
    .data([]);
   this.nodeSelection.exit().remove();
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

/**
 * This method updates the link selection by binding the new link data
 * to the SVG links.path.
 */
SingleGraphDrawer.prototype.updateSVGLinkSelection = function() {
  this.linkSelection = this.linkSelection.data(this.links);
}

/**
 * This method updates the node selection by binding the new node data
 * to the SVG g.nodes
 */
SingleGraphDrawer.prototype.updateSVGNodeSelection = function() {
  this.nodeSelection = this.nodeSelection.data(this.nodes);
}

SingleGraphDrawer.prototype.computeLinkCurvature = function() {
  // The "d" attribute of the SVG path element specifies the type of path
  // that links the two nodes. In this case, the type of path is an arc
  this.linkSelection.attr("d", function(d) {
    var d1 = {
      x: d.source.scaledX,
      y: d.source.scaledY
    };

    var d2 = {
      x: d.target.scaledX,
      y: d.target.scaledY
    };

    // get the x and y differentials
    var dx = (d2.x - d1.x);
    var dy = (d2.y - d1.y);

    // compute for the distance between the two points
    var dr = Math.sqrt(dx * dx + dy * dy);

    // get the midpoint of the two points
    var midx = (d2.x + d1.x) / 2.0;
    var midy = (d2.y + d1.y) / 2.0;

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
      switch (d.status) {
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
    switch (d.status) {
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
        return d.scaledX;
      }
    })
    .attr("cy", function(d) {
      if (graphForEdit) {
        return "0px";
      } else {
        return d.scaledY;
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
    switch (d.type) {
      case 'Temperature':
        return '#FFF44D';
        break;
      case 'Humidity':
        return '#E8850C';
        break;
      case 'Light':
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
    .attr("x", function(d) { return d.scaledX; })
    .attr("y", function(d) { return d.scaledY; })
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
