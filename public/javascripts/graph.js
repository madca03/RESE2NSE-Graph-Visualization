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
var graphDataFetcher = new GraphDataFetcher(floorCount, floors);

$(function() {
  ui.init();
  var eventHandler = new EventHandler();
  ui.setTimeSlider();

  graphDataFetcher.getDataForDisplay();
  var display_timer = setInterval(function() {
    graphDataFetcher.getDataForDisplay();
  }, UPDATERATE);

  // for (var i = 1; i <= 120; i++) {
  //     setTimeout(function() {
  //       graphData.getDataForDisplay();
  //     }, 1000 * i);
  // }

  // setTimeout(function() {
  //   graphData.getDataForDisplay();
  // }, 1000);

  // function is called when the browser is resized
  window.onresize = function() {
    ui.updateUIOnBrowserResize();
    graphDataFetcher.getDataForDisplay();

    clearInterval(display_timer);

    display_timer = setInterval(function() {
      graphDataFetcher.getDataForDisplay();
    }, UPDATERATE);
  }
  //
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
