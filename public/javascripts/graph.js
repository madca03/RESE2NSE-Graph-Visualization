"use strict"

/*************  Constants  *************/

const BASEURL = "http://localhost:3000";
// node visual properties
const NODERADIUS = 8;
const NODEFILL = "black";
// link visual properties
const LINKSTROKEOPACITY = '1';
const LINKSTROKEWIDTH = '2px';
const UPDATERATE = 1000;

/*************  Application starts here  *************/

var floorCount = $('.floor').length;

// This wlll be the storage for all of the Floor objects.
var floors = [];

var ui = new UI();
var graphData = new GraphDataFetcher(floorCount, floors);

$(function() {
  ui.init();
  var eventHandler = new EventHandler();
  ui.setTimeSlider();

  graphData.getDataForDisplay();
  var display_timer = setInterval(function() {
    graphData.getDataForDisplay();
  }, UPDATERATE);

  // for (var i = 1; i <= 120; i++) {
  //     setTimeout(function() {
  //       graphData.getDataForDisplay();
  //     }, 1000 * i);
  // }


  // setTimeout(function() {
  //   graphData.getDataForDisplay();
  // }, 1000);

  // setTimeout(function() {
  //   graphData.getDataForDisplay();
  // }, 6000);

  // function is called when the browser is resized
  window.onresize = function() {
    ui.updateUIOnBrowserResize();
    graphData.getDataForDisplay();

    clearInterval(display_timer);

    display_timer = setInterval(function() {
      graphData.getDataForDisplay();
    }, UPDATERATE);
  }

  // add click event listener to edit graph button
  $('.edit-btn').on('click', function() {
    clearInterval(display_timer);
    eventHandler.editBtnClicked($(this).data("floorNumber"));

    // add event handler to cancel button
    $('.cancel-btn').on('click', function() {
      eventHandler.cancelBtnClicked();
    });

    // add event handler to save button
    $('.save-btn').on('click', function() {
      eventHandler.saveBtnClicked();
    });
  });
}); // end application block

/***********************  END  ***********************/


/*********************  UI Class  ********************/

function UI() {
  this.svgWidth = null;
  this.svgHeight = null;
  this.baseSVGWidth = 866;
  this.baseSVGHeight = 396;
  this.initialDisplay = true;
  this.archive_date = [];
}

/**
 * This method initializes the UI components to be used for the graph display.
 */
UI.prototype.init = function() {
  this.setFloorImageDimensions();
  this.setScrollToLink();
  this.setNavbars();
}

/**
 * This method adds a time slider for each graph display. It first gets the
 * total number of archive from the database and it uses this data to set
 * the maximum value for the slider.
 */
UI.prototype.setTimeSlider = function() {
  var thisObj = this;

  $(".slider-range").slider({
      range: "max",
      min: 1,
      disabled: true,
      slide: function(event, ui) {
          var floorNumber = $(this).data("floorNumber");
          var floor = null;

          for (var i = 0; i < floors.length; i++) {
            if (floors[i].floorNumber === floorNumber) {
              floor = floors[i];
              break;
            }
          }

          // update the time-label of the graph
          var date = new Date(thisObj.archive_date[ui.value - 1].datetime_archive);

          var date_options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'long'
          };

          $("#slider-time-" + floor.floorNumber)
            .html(date.toLocaleString('en-us', date_options));
      },
      change: function(event, ui) {
        var max = $(".slider-range").slider("option", "max");
        var floorNumber = $(this).data("floorNumber");
        var floor = null;

        // global variable "floors"
        // find the floor object corresponding to this slider
        for (var i = 0; i < floors.length; i++) {
          if (floors[i].floorNumber === floorNumber) {
            floor = floors[i];
            break;
          }
        }

        if (ui.value != max) {
          /*
            disable the update on the floor so that the graph for the
            time specified is shown.
            continuously update other floors whose ui.value is equal to
            the max time.
          */

          floor.updateDisabled = true;
          if (floor.recentlyDisabled) {
            floor.updateJustEnabled = false;
          }

          // update the display for the specific floor to show the graph
          // for the chosen time.
          graphData.getArchiveDataForDisplay(floorNumber, ui.value);

        } else {
          if (floor.updateDisabled) {
            floor.updateDisabled = false;
            floor.updateJustEnabled = true;
          }
        }
      }
  });
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

UI.prototype.updateUIOnBrowserResize = function() {
  this.setFloorImageDimensions();
  this.updateSideNav();
}

UI.prototype.updateSideNav = function() {
  var sideNav = $('.nav-side');
  var parentDivWidth = sideNav.parent().width();

  sideNav.width(parentDivWidth);
}

/**
 * This method updates the slider range to accomodate the new archive data
 * stored in the database.
 *
 * @param {Number} archive_count: current total of archive sets in the database
 */
UI.prototype.updateSliderRange = function(archive_count) {
  var sliders = $('.slider-range').toArray();

  // for each slider, update the slider value if the current slider is
  // pointing to the max value
  for (var i = 0; i < sliders.length; i++) {
    var currentSliderValue = $(sliders[i]).slider("option", "value");
    var currentSliderMax = $(sliders[i]).slider("option", "max");

    if (currentSliderValue === currentSliderMax) {
      $(sliders[i]).slider("option", "value", archive_count);
    }
  }

  // update the max value of all the sliders to the current archive count
  $('.slider-range').slider("option", "max", archive_count);

  // for the initial/first graph display, enable the use of the slider and
  // set the current slider value to archive_count
  if (this.initialDisplay) {
    $('.slider-range').slider("option", "disabled", false);
    $('.slider-range').slider("value", archive_count);
    this.initialDisplay = false;
  }
}

UI.prototype.updateArchiveDate = function(archive_date) {
  // update the array of archive dates
  for (var i = this.archive_date.length; i < archive_date.length; i++) {
    this.archive_date.push(archive_date[i]);
  }

  var sliders = $('.slider-range').toArray();
  var currentMax = $('.slider-range').slider("option", "max");

  for (var i = 0; i < sliders.length; i++) {
    var currentValue = $(sliders[i]).slider("option", "value");

    if (currentValue === currentMax) {
      var slider_time = $(sliders[i]).prev().children('.slider-time')[0]
      var date = new Date(this.archive_date[this.archive_date.length - 1].datetime_archive);

      var date_options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'long'
      }

      $(slider_time).html(date.toLocaleString('en-us', date_options));
    }
  }
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

  graphData.getDataForEdit(floorNumber);
}

EventHandler.prototype.getUpdatedNodes = function() {
  var nodes = graphData.graphDrawer.nodes;
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


/****************  Floor Class  **************/

function Floor(floorNumber, nodes, links) {
  this.nodes = nodes;
  this.links = links;
  this.floorNumber = floorNumber;
  this.updateDisabled = false;
  this.updateJustEnabled = false;
}

/**************  END Floor Class  ************/


/******************  GraphDataFetcher Class  ****************/

function GraphDataFetcher(floorCount, floors) {
  this.floorCount = floorCount;
  this.floors = floors;
  this.graphDrawer = new MultiGraphDrawer();
  this.initialDataFetch = true;
}

/**
  * This function gets the graph data containing the nodes with their
  * coordinates set and the links in between nodes. After a successful AJAX
  * call, it calls the draw_graph_for_display function and it passes to the
  * function the graph data from the AJAX call.
  * (in data.graph)
  *
  * Also included in the data is the current count of the archive sets.
  * (in data.archive_count)
  *
  * This function should only be called for the graph display of guest users.
  */

GraphDataFetcher.prototype.getDataForDisplay = function() {
  // ajax call for guest users
  var request = $.ajax({
    url: BASEURL + "/nodes_for_display",
    type: "GET",
    dataType: "json",

    // Pass the GraphDataFetcher object to the ajax request so that it can be used
    // on the ajax's function callbacks
    context: this
  });

  request.done(function(data, textStatus, jqXHR) {
    // separate the graph data per floor
    this.getGraphPerFloor(data.graph);

    // draw all of the graphs
    this.graphDrawer.drawGraphsForDisplay(this.floors);

    // update the maximum value of the slider to the total archive count
    ui.updateSliderRange(data.archive_count);

    // update the array of archive dates stores in the UI object
    ui.updateArchiveDate(data.archive_date);
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus, errorThrown);
  });
}

GraphDataFetcher.prototype.getDataForEdit = function(floorNumber) {
  var graphDataObj = this;

  // ajax call to get graph data
  $.ajax({
    url: BASEURL + '/nodes/' + floorNumber.toString(),
    type: 'GET',
    dataType: 'json',
    success: function(graph) {
      var links = graphDataObj.modifyLinks(graph.nodes, graph.links);
      var nodes = graphDataObj.modifyNodesForEdit(graph.nodes);

      var floor_for_edit = new Floor(floorNumber, nodes, links);

      graphDataObj.graphDrawer = new SingleGraphDrawer(floor_for_edit);
      graphDataObj.graphDrawer.drawGraphForEdit();
    },
    error: function(req, status, err) {
      console.log(status, err);
    }
  });
}


/**
 * This method sorts the graph data per floor from the given data
 * received from the getDataForDisplay()'s ajax call.
 *
 * @param {object} graphData: unsorted graph dataset
 * @return array of graph dataset where each graph dataset element
 *    corresponds to one floor.
 */
GraphDataFetcher.prototype.getGraphPerFloor = function(graphData) {

  if (this.initialDataFetch) {
    // set the initialDataFetch attribute to false so that this will not be
    // executed for the next graph update
    this.initialDataFetch = false;

    for (var i = 0; i < this.floorCount; i++) {
      // get the nodes for the current floor
      var nodes = graphData.nodes.filter(function(node) {
        return node.floor_number === (i + 1);
      });

      // get the links for the current floor
      var links = graphData.links.filter(function(link) {
        return link.floor_number === (i + 1);
      });

      // modify links and nodes
      this.modifyNodesForDisplay(nodes);
      links = this.modifyLinks(nodes, links);

      // create a new "Floor" object containing the nodes and links
      // for the graph on that floor.
      this.floors.push(new Floor(i + 1, nodes, links));
    }
  }

  else {
    // This code block updates the nodes and links of each Floor object
    // This code block is called for every update on the graph display

    for (var i = 0; i < this.floors.length; i++) {
      var floor = this.floors[i];

      var nodes = graphData.nodes.filter(function(node) {
        return node.floor_number === floor.floorNumber;
      });

      var links = graphData.links.filter(function(link) {
        return link.floor_number === floor.floorNumber;
      });

      this.modifyNodesForDisplay(nodes);
      this.floors[i].nodes = nodes;
      this.floors[i].links = this.modifyLinks(nodes, links);
    }
  }
}

/**
  * This function adds "scaledX" and "scaledY" attributes to each node object.
  * These new attributes will be used in determining the node's visual position
  * given a certain browser width and height. Using these attributes, we can
  * also have a graph visualization that can respond to resizing of the browser
  * window by calculating the new node position for each browser resize.
  *
  * @param {array} nodes - array of node objects on a given floor
  * @return {array} nodes - array of modified node objects
  */
GraphDataFetcher.prototype.modifyNodesForDisplay = function(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].scaledX = (ui.svgWidth * nodes[i].x_coordinate) / ui.baseSVGWidth;
    nodes[i].scaledY = (ui.svgHeight * nodes[i].y_coordinate) / ui.baseSVGHeight;
  }
}

/**
  * The link objects' source and target attributes are currently set to the
  * "node_id" of the source and target nodes. Using these node_ids, the source
  * and target attributes of each link object will be change to point to the
  * corresponding node objects from the @param {array} nodes.
  *
  * @param {array} nodes - array of node objects on a given floor
  * @param {array} links - array of link objects on a given floor.
  * @return {array} modifiedLinks
  */
GraphDataFetcher.prototype.modifyLinks = function(nodes, links) {
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

GraphDataFetcher.prototype.modifyNodesForEdit = function(nodes) {
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

/**
 * This method gets and updates the graph data for a specific floor and time.
 *
 * @param {Number} floorNumber: the floor to be updated with the archive graph data.
 * @param {Number} dateArchiveID: the ID of the archive date in the database.
 */
GraphDataFetcher.prototype.getArchiveDataForDisplay = function(floorNumber, dateArchiveID) {
  var request = $.ajax({
    url: BASEURL + "/archive/floor/" + floorNumber + "/date/" + dateArchiveID,
    type: "GET",
    dataType: "json",
    context: this
  });

  request.done(function(data, statusText, jqXHR) {
    // console.log(data);

    // find the Floor object which should be updated with the archive graph data
    for (var i = 0; i < this.floors.length; i++) {
      if (this.floors[i].floorNumber === floorNumber) {
        this.modifyNodesForDisplay(data.nodes);
        this.floors[i].nodes = data.nodes;
        this.floors[i].links = this.modifyLinks(data.nodes, data.links);

        // update the graph display
        var singleGraphDrawer = new SingleGraphDrawer(this.floors[i]);
        singleGraphDrawer.updateArchiveGraphDisplay();
      }
    }
  });
}

/****************  END GraphDataFetcher Class  **************/


/***************  MultiGraphDrawer Class  ************/

function MultiGraphDrawer() {
  this.graphsDisplayed = false;
}

/**
  * @param floors = array of Floor objects each containing node and link data
  */
MultiGraphDrawer.prototype.drawGraphsForDisplay = function(floors) {
  for (var i = 0; i < floors.length; i++) {
    // check if it's the first time the graph is being displayed or not
    if (this.graphsDisplayed) {
      // check if the graph on a specific floor is to be updated or not
      if (!floors[i].updateDisabled) {  // if floor can be updated
        var singleGraphDrawer = new SingleGraphDrawer(floors[i]);
        singleGraphDrawer.updateGraphDisplay();
      }
    }
    else {
      var singleGraphDrawer = new SingleGraphDrawer(floors[i]);
      singleGraphDrawer.drawGraphDisplay();
    }
  }

  if (this.graphsDisplayed === false) this.graphsDisplayed = true;
}

/*************  END MultiGraphDrawer Class  **********/


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
