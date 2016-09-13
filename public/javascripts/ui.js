/*********************  UI Class  ********************/

function UI() {
  this.svgWidth = null;
  this.svgHeight = null;
  this.baseSVGWidth = 866;
  this.baseSVGHeight = 396;
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
 * This function sets the dimensions of the floor image to match
 * the width and height dimensions of its parent element, .graph-container
 */
UI.prototype.setFloorImageDimensions = function() {
  /* SVG stage and floorplan image properties */
  var graph_container = $(".graph-container");
  var floor_img = $(".floor-img");
  var img_border = parseFloat($(floor_img).css('border-top-width'));
  var container_width = parseFloat($(graph_container).css('width'));

  /* don't use the height of the div.graph-container, use the height of the
  image instead */
  var img_height = parseFloat($(floor_img).css('height'));

  this.svgWidth = container_width - img_border;
  this.svgHeight = img_height - img_border;

  $(floor_img).css("width", this.svgWidth.toString() + 'px');
  $(graph_container).css('height', img_height);
}

/**
  * This function adds a scroll effect when a link on the side navbar is
  * clicked to go to a certain floor graph.
  */
UI.prototype.setScrollToLink = function() {
  $('.floor-link').on('click', function() {
    var link = '#floor' + this.dataset.floorNumber.toString();
    var top_offset = $('.main-nav').outerHeight(); // offset covered by navbar

    /* $(jquery-obj).offset() -> returns the current coordinates of an element
      relative to the document

      Since the navbar is fixed on top of the browser while scrolling, we need
      to subtract the height of the navbar to the offset.top coordinate of the
      floor to be viewed. This makes the offset.top coordinate now relative
      to the bottom part of the navbar and not the top part of the browser
      window.
    */

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

/*******************  END UI Class  ******************/
