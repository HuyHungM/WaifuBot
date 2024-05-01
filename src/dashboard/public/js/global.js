function loadPage() {
  myVar = setTimeout(showPage, 1400);
}

function showPage() {
  $("#loader").remove();
  $("#container").css("display", "flex");
}
