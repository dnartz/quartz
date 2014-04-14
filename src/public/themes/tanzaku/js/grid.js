(function ($) {
  $(function () {

    $('#header').css("visibility", "hidden");
    var setGrid = function () {
      return $("#grid-wrapper").vgrid({
        easeing: "easeOutQuint",
        time: 800,
        delay: 60,
        selRefGrid: "#grid-wrapper div.x1",
        selFitWidth: ["#container", "#footer"],
        gridDefWidth: 290 + 15 + 15 + 5,
        forceAnim: true
      });
    };

    $.fn.setgid = setGrid;
    setTimeout(setGrid, 300);
    setTimeout(function () {
      $('#header').hide().css("visibility", "visible").fadeIn(500);
    }, 500);

    $(window).load(function (e) {
      setTimeout(function () {
        // prevent flicker in grid area - see also style.css
        $("#grid-wrapper").css("paddingTop", "0px");
      }, 1000);
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space