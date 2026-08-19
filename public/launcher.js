(function() {
  if (window.StudentKiBotInitialized) return;
  window.StudentKiBotInitialized = true;


  const widgetIframe = document.createElement('iframe');
  widgetIframe.src = '/chat.html';
  widgetIframe.style.position = 'fixed';
  widgetIframe.style.zIndex = '999999';
  widgetIframe.setAttribute('allowtransparency', 'true');
  widgetIframe.style.border = 'none';


  let currentPosition = 'right';
  let currentBottom = '0px';

  widgetIframe.style.bottom = currentBottom;
  widgetIframe.style.right = '0px';
  widgetIframe.style.width = '100px';
  widgetIframe.style.height = '100px';

  document.body.appendChild(widgetIframe);

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || !data.action) return;

    const isMobile = window.innerWidth <= 600;


    if (data.action === 'initLayout') {
      currentPosition = data.position === 'left' ? 'left' : 'right';
      currentBottom = (data.bottomOffset || 0) + 'px';
      
      widgetIframe.style.bottom = currentBottom;
      if (currentPosition === 'left') {
        widgetIframe.style.left = '0px';
        widgetIframe.style.right = 'auto';
      } else {
        widgetIframe.style.right = '0px';
        widgetIframe.style.left = 'auto';
      }
    } 
    

    else if (data.action === 'open' || data.action === 'resize') {
      if (isMobile) {
        widgetIframe.style.width = '100vw';
        widgetIframe.style.height = '100vh';
        widgetIframe.style.bottom = '0px';
        widgetIframe.style.left = '0px';
        widgetIframe.style.right = '0px';
        widgetIframe.style.borderRadius = '0';
      } else {
        widgetIframe.style.width = data.width + 40 + 'px';
        widgetIframe.style.height = data.height + 40 + 'px';
      }
    } 
    

    else if (data.action === 'close') {
      widgetIframe.style.width = '100px';
      widgetIframe.style.height = '100px';
      

      widgetIframe.style.bottom = currentBottom;
      if (currentPosition === 'left') {
        widgetIframe.style.left = '0px';
        widgetIframe.style.right = 'auto';
      } else {
        widgetIframe.style.right = '0px';
        widgetIframe.style.left = 'auto';
      }
    }
  });
})();