import router from "./router.js"

// window.addEventListener('load', async () => {
//     try {
//       router();
//     } catch (error) {
//       console.error('Error fetching base template:', error);
//     }
// });
window.addEventListener('load', router);
  
window.addEventListener('hashchange', router);