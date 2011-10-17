function moveScroller() {
  var a = function() {
    var b = $(window).scrollTop();
    var d = $("#scroller-anchor").offset().top;
    var c=$("#scroller");
    if (b>d) {
      c.css({position:"fixed",top:"60px"})
    } else {
      if (b<=d) {
        c.css({position:"relative",top:""})
      }
    }
  };
  $(window).scroll(a);a()
}