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
    $(".fly-in-animation").each(function () {
      let scrollTop = $(document).scrollTop() + $(window).height();
      let elementTop = $(this).offset().top + 150;
      if (scrollTop > elementTop) {
        $(this).addClass("active");
      }

      if (scrollTop < elementTop - 150) {
        $(this).removeClass("active");
      }
    });
  });
});

function splitTextIntoSpans(target) {
  $(target).each(function () {
    $(this).addClass("split-text");
    let text = $(this).text();
    let splitText = text
      .trim()
      .split(/ +/g)
      .map(function (word, index) {
        console.log(word);
        let char = word
          .split("")
          .map(function (char) {
            return `<span class="split-char">${char}</span>`;
          })
          .join("");
        return `<div class="split-word">${char}${index < word.length - 1 ? "&nbsp" : ""}</div>`;
      })
      .join("");

    $(this).html(splitText);
  });
}
