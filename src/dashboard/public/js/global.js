function loadPage() {
  myVar = setTimeout(showPage, 1400);
}

function showPage() {
  $("#loader").remove();
  $("#container").css("display", "flex");
}

$(document).ready(function () {
  splitTextIntoSpans(".bubble-text");

  $(document).scroll(function () {
    if ($(this).scrollTop() > 0) {
      $("#navbar").addClass("isScrolled");
    } else {
      $("#navbar").removeClass("isScrolled");
    }
  });
});

function splitTextIntoSpans(target) {
  $(target).each(function () {
    $(this).addClass("split-text");
    let text = $(this).text();
    let splitText = text
      .split(" ")
      .map(function (word) {
        let char = word
          .split("")
          .map(function (char) {
            return `<span class="split-char">${char}</span>`;
          })
          .join("");
        return `<div class="split-word">${char}&nbsp</div>`;
      })
      .join("");

    $(this).html(splitText);
  });
}
