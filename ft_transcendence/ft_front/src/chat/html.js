export function chat_html() {
    return `
        <a href="/#" class="btn btn-primary">Home</a>
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl text-white" id="room_name"></h1>
        </div>

        <div class="lg:w-2/4 mx-4 lg:mx-auto p-4 bg-white rounded-xl">
            <div class="chat-messages space-y-3" id="chat-messages">
            </div>
        </div>

        <div class="lg:w-2/4 mt-6 mx-4 lg:mx-auto p-4 bg-white rounded-xl">
            <form class="flex" id="chat-form">
                <input type="text" name="content" class="flex-1 mr-3" placeholder="Your message..." id="chat-message-input">
                <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700" id="chat-message-button">Submit</button>
            </form>
        </div>
    `;
}