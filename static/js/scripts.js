var errors = ['600:Aadhar not recognized', '601:Is your passport valid', '602:Class distinction detected', '603:Please check priviledge status', '604:Gender not supported', '605:Political failure', '606:Capital dependency', '607:Language not supported', '608:Government Shutdown'];

$(function() {
  toggleContent(); // Read more
  fixVids();       // Responsive video
  makeGallery();   // Galleries

  $('.home-list h2').on('click',function(e){
    e.preventDefault();
    if($(this).parent().hasClass('collapsed')) {
      $('.home-list > div').addClass('collapsed');
      $(this).parent().removeClass('collapsed')
    } else {
      $(this).parent().addClass('collapsed')
    }
  })

  if($('.container').hasClass('error')){
    var rnd = Math.floor(Math.random() * Math.floor(errors.length));
    var errorString = errors[rnd];
    $('.error-title').text(errorString.split(':')[0]);
    $('.error-status').text(errorString.split(':')[1]);
  }

  $('.page-content section img').attr('loading','lazy');

  scrollSpy('#project-toc', {
    sectionSelector: 'section',
    targetSelector: '.toc-link',
    offset: 200
  });

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
    $('*[data-title=' + title + '] .full-content').toggle();
  });
}
function makeGallery(){
  var pimg = $('p:has(img)');
  pimg.find('br').remove();
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
        var caption = alt; // alt.split(',').join('<br/>');
        $(this).parent().append('<span class="img-caption">' + caption + '</span>');
      } else {
        if( addCaption ) {
          $(this).parent().append('<span class="img-caption"></span>');
        }
      }
    });
  });
  $('p.img').slick({
    dots: true,
    infinite: false,
    speed: 300,
    fade: true,
    autoplay: true,
    autoplaySpeed: 2400,
    useCSS: false,
    arrows: false
  });

  document.addEventListener('click', function (event) {
    if (event.target.matches('#btn-search-submit')) {
      event.preventDefault();
      var query = document.querySelector('#search-field').value;
      window.location.href = '/search/?q=' + query;
    }
  });
  document.querySelector('#search-field').addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 13) {
      event.preventDefault();
      var query = document.querySelector('#search-field').value;
      window.location.href = '/search/?q=' + query;
    }
  });
}
