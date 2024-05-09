import router from "./router.js"

// window.addEventListener("load", router);
window.addEventListener('load', async () => {
    try {
      const response = await fetch('/');
      const html = await response.text();
      document.documentElement.innerHTML = html;
      router();
      // console.log(html);
      // console.log(response);
    } catch (error) {
      console.error('Error fetching base template:', error);
    }
});
  
window.addEventListener('hashchange', router);