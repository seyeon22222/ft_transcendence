export function renderRooms(rooms) {
    document.title = 'Chatting Room | Ft_Transcendence';
    return `
      ${rooms.length > 0 ? `
        <h1 class="text-3xl lg:text-6xl text-white">Room List</h1>
        <div class="w-full flex flex-wrap items-center">
          ${rooms.map(room => `
            <div class="w-full lg:w-1/4 px-3 py-3">
              <div class="p-4 bg-white shadow rounded-xl text-center">
                <h2 class="mb-5 text-2xl font-semibold">${room.name}</h2>
                <a href="{% url 'chatting:room' room.slug %}" class="px-5 py-3 block rounded-xl text-white bg-teal-600 hover:bg-teal-700">Join</a>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      <div id="createRoomSection">
        <br>
        <h2 class="text-3xl lg:text-6xl text-white">Create a new room</h2>
        <form method="POST" action="{% url 'chatting:room_make' %}">
          {% csrf_token %}
          <input type="text" name="room_name" placeholder="Room Name" required>
          <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-400 hover:bg-teal-700">Create</button>
        </form>
      </div>
    `;
  }