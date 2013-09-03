function moveScroller() {
  var c = $("#scroller");
  var uh = $(c).height();
  var a = function() {
    var b = $(window).scrollTop();
    var d = $("#scroller-anchor").offset().top;
    var e = $(".footer").offset().top;
    if (b>d && ((b+$(window).height()))<e) {
      c.css({position:"fixed",top:"60px"})
    } else {
      if (b<=d) {
        c.css({position:"relative",top:""});
      } else {
        // wrapper height must be calculated here because of disqus
        var wh = $('.wrapper').height();
        var calc = (-1*Math.abs(wh-b-d-uh-60));
        c.css({position:"fixed",top:calc+"px"});
      }
    }
  };
  $(window).scroll(a);a()
}

$(function() { moveScroller(); });
