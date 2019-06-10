var uniqueYears = [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2007, 2004];
var uniqueGenres = ["artwork","group-exhibition","individual-work","ongoing-project","past-project","performance","press","publication","residency","resource","solo-exhibition","talk","text","video"];

$(function() {
  if($('.page-content').hasClass('home')){
    makeTimeline();
  } else {
    toggleContent();
    fixVids();
    makeGallery();
  }

  // Lightbox
  var screenWidth = $(document).width();
  if(screenWidth < 800) {
    var myLB = new jBox('Image', {
      adjustDistance: 40,
      blockScroll: true,
      reposition: false,
      overlay: true,
      closeOnEsc: true,
      closeOnClick: 'overlay',
      closeButton: 'overlay',
      src: 'src',
      imageLabel: 'alt',
      imageSize: '100% auto',
      imageCounter: false
    });
  } else {
    var myLB = new jBox('Image', {
      adjustDistance: 80,
      blockScroll: true,
      reposition: false,
      overlay: true,
      closeOnEsc: true,
      closeOnClick: 'overlay',
      closeButton: 'overlay',
      src: 'src',
      imageLabel: 'alt',
      imageSize: 'auto 90%',
      imageCounter: false
    });
  }
});

function makeTimeline(){
  $.each(uniqueYears, function(i, v) {
    $(".by-year").append(
      "<div><span class='timeline-meta'>" + v + "</span><ul data-year=" + v + "></ul></div>"
    );
  });

  $(".all-projects .project-year-genre").each(function() {
    var y = $(this).data("year");
    var g = $(this).data("genre");
    var p = $(this).data("project");
    $(this)
      .clone()
      .appendTo("ul[data-year=" + y + "]");
    $(".by-year").addClass('active');
  });

  $(".site-genres .tag").each(function(){
    var offsetYears = $(".by-year").height();
    var coord = $($(this).attr('href').toString()).offset().top - 260 - offsetYears;
    $(this).attr('data-coord', coord, offsetYears);
  });
  $(".site-dates .tag").on("click", function(e) {
    e.preventDefault();
    $(".timeline.vertical").scrollTop(0);

    $(".by-year").addClass("active");
    $(".by-genre").removeClass("active");
  });
  $(".site-genres .tag").on("click", function(e) {
    e.preventDefault();
    var coord = $(this).data('coord');
    $(".timeline.vertical").scrollTop(coord);
    console.log(coord, $(".timeline.vertical").scrollTop());

    $(".by-genre").addClass("active");
    $(".by-year").removeClass("active");
  });
}

function sizeTimeline(){
  if($(".timeline").hasClass("horizontal")){
    $(".by-year div, .by-genre div").each(function(){
      var w = $(this).find('ul')[0].scrollWidth;
      $(this).width(w);
    })
  }
}
function toggleContent(){
  $('a.toggle-section').on('click',function(e){
    e.preventDefault();
    var title = $(this).data('title');
    $('.section-content[data-title=' + title + '] .full-content, .toggle-section[data-title=' + title + '] .more, .toggle-section[data-title=' + title + '] .less').toggle();
  });
}
function makeGallery(){
  var pimg = $('p:has(img)');
  pimg.each(function(j, obj){
    var p = $(this);
    var i = p.find('img');
    var len = i.length;
    if (len > 1) {
      p.addClass('img');
    }
    i.each(function(){
      var addCaption = $(this).parent().hasClass('img');
      var alt = $(this).attr('alt');
      $(this).attr('data-jbox-image','gal_' + j);
      $(this).wrap('<div></div>');
      if( alt != '' && alt != null && alt != 'null' ) {
          $(this).parent().append('<span class="img-caption">' + alt + '</span>');
      } else {
        if( addCaption ) {
          $(this).parent().append('<span class="img-caption"></span>');
        }
      }
    });
  });
}
