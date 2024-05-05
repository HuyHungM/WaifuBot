$(document).ready(function () {
  $("#introduce")
    .children()
    .each(function (index) {
      $(this)
        .css("--delay", `${index * 100}ms`)
        .addClass("appear");
    });

  $(document).scroll(function () {
    if ($(this).scrollTop() > 0) {
      $("#navbar").addClass("isScrolled");
    } else {
      $("#navbar").removeClass("isScrolled");
    }

    $(".fly-in-animation").each(function () {
      let scrollTop = $(document).scrollTop() + $(window).height();
      let elementTop = $(this).offset().top + 150;
      if (scrollTop > elementTop) {
        $(this).addClass("active");
      }
    });
  });
});
