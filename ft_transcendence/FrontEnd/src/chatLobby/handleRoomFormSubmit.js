import { showModal } from "../utilities.js";
import { dictionary } from "../language/dictionary.js";
import router from "../../base/router.js";

export function handleRoomFormSubmit() {
    const roomForm = document.getElementById("room_form"); // (createForm) > (roomForm)
    roomForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const roomName = document.getElementById("room_name").value; // (room_name) > (roomName)

        const roomFormData = new FormData(); // (formData) > (roomFormData)
        roomFormData.append('room_name', roomName);

            const csrfToken = Cookies.get('csrftoken'); // (csrftoken) > (csrfToken)
            const res = await fetch('chat/rooms/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: roomFormData
            });

            if (res.ok) {
                const responseData = await res.json(); // (data) > (responseData)
                const modalElement = document.querySelector('.modal'); // (modal) > (modalElement)
                const bootstrapModal = new bootstrap.Modal(modalElement); // (newModal) > (bootstrapModal)
                const modalBodyElement = document.querySelector('.modal .modal-body p'); // (modalBody) > (modalBodyElement)
                const user_lang = document.getElementById('languageSelector').value;
                modalBodyElement.innerHTML = `<span>'${responseData.name}' </span><span data-translate="noti">${dictionary[user_lang].chatlobby.noti}</span>`;
                bootstrapModal.show();
                modalElement.addEventListener('hidden.bs.modal', function () {
                    router();
                });
            } else {
                showModal('chatlobby', 'err');
            }
    });
}
