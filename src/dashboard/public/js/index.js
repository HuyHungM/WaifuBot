$(document).ready(function () {
  $("#introduce")
    .children()
    .each(function (index) {
      $(this)
        .css("--delay", `${index * 100}ms`)
        .addClass("appear");
    });
});
