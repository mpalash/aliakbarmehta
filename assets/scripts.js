Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};



var years = [];
var genres = [];
var uniqueYears = [];
var uniqueGenres = [];

// $(function() {
//   $(".all-projects .project-year-genre").each(function() {
//     years.push($(this).data("year"));
//     genres.push($(this).data("genre"));
//   });
//   uniqueYears = years
//     .unique()
//     .sort()
//     .reverse();
//   uniqueGenres = genres.unique().sort();
//
//   $.each(uniqueYears, function(i, v) {
//     $(".by-year").append(
//       "<div><span>" + v + "</span><ul data-year=" + v + "></ul></div>"
//     );
//   });
//   $.each(uniqueGenres, function(i, v) {
//     $(".by-genre").append(
//       "<div><span>" + v + "</span><ul data-genre=" + v + "></ul></div>"
//     );
//   });
//
//   $(".all-projects .project-year-genre").each(function() {
//     var y = $(this).data("year");
//     var g = $(this).data("genre");
//     var p = $(this).data("project");
//     $(this)
//       .clone()
//       .appendTo("ul[data-year=" + y + "]");
//     if (
//       $(
//         ".by-genre ul[data-genre='" +
//           g +
//           "'] .project-year-genre[data-project='" +
//           p +
//           "']"
//       ).length == 0
//     ) {
//       $(this)
//         .clone()
//         .appendTo("ul[data-genre=" + g + "]");
//     }
//   });
//
//   $(".switcher-year").on("click", function(e) {
//     e.preventDefault();
//     $(".by-genre").addClass("hide");
//     $(".by-year").removeClass("hide");
//   });
//   $(".switcher-genre").on("click", function(e) {
//     e.preventDefault();
//     $(".by-year").addClass("hide");
//     $(".by-genre").removeClass("hide");
//   });
// });

$(function() {
  // if($('h1.project-title').length){
  //   offsetContent();
  // }
  // $(window).on('resize', function(){
  //   offsetContent();
  // });

  $('p:has(img)').addClass('img');
  $('a.toggle-section').on('click',function(e){
    e.preventDefault();
    var title = $(this).data('title');
    $('.section-content[data-title=' + title + '] .full-content, .toggle-section[data-title=' + title + '] .more, .toggle-section[data-title=' + title + '] .less').toggle();
  });
});

function offsetContent(){
  var titleHeight = $('h1.project-title').outerHeight(true);
  $('section.intro').css('margin-top', titleHeight);
}

// document.addEventListener("DOMContentLoaded", function() {
//   var lazyloadImages = document.querySelectorAll("p img");
//   var lazyloadThrottleTimeout;
//
//   function lazyload () {
//     if(lazyloadThrottleTimeout) {
//       clearTimeout(lazyloadThrottleTimeout);
//     }
//
//     lazyloadThrottleTimeout = setTimeout(function() {
//         var scrollTop = window.pageYOffset;
//         lazyloadImages.forEach(function(img) {
//             if(img.offsetTop < (window.innerHeight + scrollTop)) {
//               img.src = img.dataset.src;
//               img.classList.remove('lazy');
//             }
//         });
//         if(lazyloadImages.length == 0) {
//           document.removeEventListener("scroll", lazyload);
//           window.removeEventListener("resize", lazyload);
//           window.removeEventListener("orientationChange", lazyload);
//         }
//     }, 20);
//   }
//
//   document.addEventListener("scroll", lazyload);
//   window.addEventListener("resize", lazyload);
//   window.addEventListener("orientationChange", lazyload);
// });
