Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};

var years = [];
var genres = [];
var uniqueYears = [];
var uniqueGenres = [];

$(function() {
  $(".all-projects .project-year-genre").each(function() {
    years.push($(this).data("year"));
    genres.push($(this).data("genre"));
  });
  uniqueYears = years
    .unique()
    .sort()
    .reverse();
  uniqueGenres = genres.unique().sort();

  $.each(uniqueYears, function(i, v) {
    $(".by-year").append(
      "<div><span>" + v + "</span><ul data-year=" + v + "></ul></div>"
    );
  });
  $.each(uniqueGenres, function(i, v) {
    $(".by-genre").append(
      "<div><span>" + v + "</span><ul data-genre=" + v + "></ul></div>"
    );
  });

  $(".all-projects .project-year-genre").each(function() {
    var y = $(this).data("year");
    var g = $(this).data("genre");
    var p = $(this).data("project");
    $(this)
      .clone()
      .appendTo("ul[data-year=" + y + "]");
    if (
      $(
        ".by-genre ul[data-genre='" +
          g +
          "'] .project-year-genre[data-project='" +
          p +
          "']"
      ).length == 0
    ) {
      $(this)
        .clone()
        .appendTo("ul[data-genre=" + g + "]");
    }
  });

  $(".switcher-year").on("click", function(e) {
    e.preventDefault();
    $(".by-genre").addClass("hide");
    $(".by-year").removeClass("hide");
  });
  $(".switcher-genre").on("click", function(e) {
    e.preventDefault();
    $(".by-year").addClass("hide");
    $(".by-genre").removeClass("hide");
  });
});
