function makeIframesResponsive(containerClass, aspectRatio = 16 / 9) {
  const containers = document.querySelectorAll(`.${containerClass}`);

  if (containers.length === 0) {
    console.error('No containers found with class:', containerClass);
    return;
  }

  const instances = [];

  containers.forEach(container => {
    const iframe = container.querySelector('iframe');

    if (!iframe) {
      console.warn('No iframe found in container', container);
      return;
    }

    // Set initial styles
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.overflow = 'hidden';

    iframe.style.position = 'absolute';
    iframe.style.border = 'none';

    instances.push({ container, iframe });
  });

  function resizeAllIframes() {
    instances.forEach(({ container, iframe }) => {
      const containerWidth = container.offsetWidth;

      // Set container height based on width and aspect ratio
      const calculatedHeight = containerWidth / aspectRatio;
      container.style.height = `${calculatedHeight}px`;

      const containerHeight = container.offsetHeight;
      const containerAspectRatio = containerWidth / containerHeight;

      let width, height, top, left;

      if (containerAspectRatio > aspectRatio) {
        height = containerHeight;
        width = height * aspectRatio;
        top = 0;
        left = (containerWidth - width) / 2;
      } else {
        width = containerWidth;
        height = width / aspectRatio;
        left = 0;
        top = (containerHeight - height) / 2;
      }

      iframe.style.width = `${width}px`;
      iframe.style.height = `${height}px`;
      iframe.style.top = `${top}px`;
      iframe.style.left = `${left}px`;
    });
  }

  // Initial resize
  resizeAllIframes();

  // Resize on window resize with debouncing
  let timeout;
  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(resizeAllIframes, 100);
  });

  return resizeAllIframes; // Return function for manual triggering if needed
}
