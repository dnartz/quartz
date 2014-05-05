var height = $(window).height();
var width = $(window).width();
function resize() {
  height = $(window).height();
  width = $(window).width();
  $(".site-head .title").css("margin-top", height / 2 - 253);
  $(".site-head").css("height", height);
}
resize();
window.onresize = function () {
  resize()
};
$(".down").click(function () {
  $(document.body).animate({'scrollTop': height}, 1000);
})
$("#top-bg").css("opacity", 0);
window.onscroll = function () {
  blur = $("body").scrollTop() / height;
  $("#top-bg").css("opacity", blur);
}