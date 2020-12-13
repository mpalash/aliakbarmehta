function fixVids() {
  /*
   * Grab all iframes on the page or return
   */
  var iframes = $( 'iframe:not(#netlify-identity-widget)' );

  /*
   * Loop through the iframes array
   */
  for ( var i = 0; i < iframes.length; i++ ) {

    var iframe = iframes[i];

    /*
     * Calculate the video ratio based on the iframe's w/h dimensions
     */
    var videoRatio        = ( iframe.height / iframe.width ) * 100;

    /*
     * Replace the iframe's dimensions and position
     * the iframe absolute, this is the trick to emulate
     * the video ratio
     */
    iframe.style.position = 'absolute';
    iframe.style.top      = '0';
    iframe.style.left     = '0';
    iframe.width          = '100%';
    iframe.height         = '100%';

    /*
     * Wrap the iframe in a new <div> which uses a
     * dynamically fetched padding-top property based
     * on the video's w/h dimensions
     */
    var wrap              = document.createElement( 'div' );
    wrap.className        = 'fluid-vids';
    if ( $(window).width() > 900 ) {
      wrap.style.width      = '720px';
      wrap.style.height     = (720 * videoRatio / 100) + 'px';
      wrap.style.position   = 'relative';
    } else {
      wrap.style.width      = '100%';
      wrap.style.position   = 'relative';
      wrap.style.paddingTop = videoRatio + '%';
    }

    /*
     * Add the iframe inside our newly created <div>
     */
    var iframeParent      = iframe.parentNode;
    iframeParent.insertBefore( wrap, iframe );
    wrap.appendChild( iframe );
  }
}
