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
  if($('.page-content').hasClass('home')){
    makeTimeline();
  }
  fixVids();
  makeGallery();

  $('a.toggle-section').on('click',function(e){
    e.preventDefault();
    var title = $(this).data('title');
    $('.section-content[data-title=' + title + '] .full-content, .toggle-section[data-title=' + title + '] .more, .toggle-section[data-title=' + title + '] .less').toggle();
  });
  $('.gallery-btn.right').on('click',function(e){
    e.preventDefault();
    var gallery = $(this).parent().find('p.img');
    var activeLength = gallery.find('div.active').length;
    if(activeLength > 0){
      var active = gallery.find('div.active');
      active.removeClass('active');
      if(active.next().length > 0) {
        active.next().addClass('active');
      } else {
        gallery.find('div:first').addClass('active');
      }
    } else {
      gallery.find('div:first').next().addClass('active');
    }
    gallery.scrollLeft(gallery.find('div.active').position().left);
  });
});

function makeTimeline(){
  $(".all-projects .project-year-genre").each(function() {
    years.push($(this).data("year"));
    genres.push($(this).data("genre"));
  });
  uniqueYears = years
    .unique()
    .sort()
    .reverse();
  uniqueGenres = genres.unique().sort();
  console.log(uniqueYears, uniqueGenres);

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
    $(this)
      .clone()
      .appendTo("ul[data-genre=" + g + "]");

    // if ( $(".by-genre ul[data-genre='" + g + "'] .project-year-genre[data-project='" + p + "']" ).length == 0 ) {
    //   $(this)
    //     .clone()
    //     .appendTo("ul[data-genre=" + g + "]");
    // }
  });

  $(".switcher-year").on("click", function(e) {
    e.preventDefault();
    $(".by-year").addClass("active");
    $(".by-genre").removeClass("active");
  });
  $(".switcher-genre").on("click", function(e) {
    e.preventDefault();
    $(".by-genre").addClass("active");
    $(".by-year").removeClass("active");
  });

  sizeTimeline();
}
function sizeTimeline(){
  $(".by-year div, .by-genre div").each(function(){
    var w = $(this).find('ul')[0].scrollWidth;
    $(this).width(w);
  })
  $(".by-year").addClass('active');
}
function offsetContent(){
  var titleHeight = $('h1.project-title').outerHeight(true);
  $('section.intro').css('margin-top', titleHeight);
}
function makeGallery(){
  var pimg = $('p:has(img)');
  pimg.each(function(){
    var p = $(this);
    var i = p.find('img');
    var len = i.length;
    if (len > 1) {
      p.addClass('img');
    }
    i.each(function(){
      var alt = $(this).attr('alt');
      $(this).wrap('<div></div>');
      if( alt != '' && alt != null && alt != 'null') {
        $(this).parent().append('<span class="img-caption">' + alt + '</span>');
      } else {
        $(this).parent().append('<span class="img-caption"></span>');
      }
    });
    // $('<span class="gallery-btn left" /><span class="gallery-btn right" />').insertAfter(p);
  });
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
