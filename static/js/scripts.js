// var uniqueYears = [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2007];
// var uniqueGenres = ["artwork","group-exhibition","individual-work","ongoing-project","past-project","performance","press","publication","residency","resource","solo-exhibition","talk","text","video"];

var errors = ['600:Aadhar not recognized', '601:Is your passport valid', '602:Class distinction detected', '603:Please check priviledge status', '604:Gender not supported', '605:Political failure', '606:Capital dependency', '607:Language not supported', '608:Government Shutdown'];

$(function() {
  toggleContent();
  fixVids();
  makeGallery();

  if($('.container').hasClass('error')){
    var rnd = Math.floor(Math.random() * Math.floor(errors.length));
    var errorString = errors[rnd];
    $('.error-title').text(errorString.split(':')[0]);
    $('.error-status').text(errorString.split(':')[1]);
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

function toggleContent(){
  $('a.toggle-section').on('click',function(e){
    e.preventDefault();
    var title = $(this).data('title');

    $(this).find('span').toggle();
    $('.section-content[data-title=' + title + '] .full-content, .site-intro[data-title=' + title + '] .full-content').toggle();
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
        var caption = alt.split(',').join('<br/>');
        $(this).parent().append('<span class="img-caption">' + caption + '</span>');
      } else {
        if( addCaption ) {
          $(this).parent().append('<span class="img-caption"></span>');
        }
      }
    });
  });
}
