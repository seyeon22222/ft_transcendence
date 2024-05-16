export async function chat_js(hash) {
    try {
        console.log(hash); // hash is like "/asdf"
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const chatSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/chat/' + hash.slice(1) + '/');
        console.log(chatSocket);
        
        chatSocket.onopen = function(e) {
            console.log("WebSocket connection opened:", e);
        };

        chatSocket.onclose = function(e) {
            console.log("WebSocket connection closed:", e);
        };

        chatSocket.onerror = function(e) {
            console.error("WebSocket error:", e);
        };
        // const csrftoken = Cookies.get('csrftoken');
        // const response = await fetch('', {
        // });

    } catch (error) {

    }
}