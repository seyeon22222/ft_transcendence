export function set_style() {
    return `
    body {
        background-color: #333; /* Dark gray background */
        color: white;
        font-family: 'Noto Sans KR', sans-serif;
    }
    h1 {
        font-size: 3rem; /* Larger font size for the title */
        font-weight: 700; /* Thicker font weight for the title */
        text-align: center; /* Center the title */
        padding: 20px; /* Add padding around the title */
    }
    .image-container {
        text-align: center;
        margin: 20px 0;
    }
    .image-container img {
        max-width: 40%; /* Smaller image size */
        height: auto;
    }

    #room_list, #user_list {
        flex: 1;
        padding: 10px;
    }

    .list_div {
        border: 2px solid white; /* adding outline to divs */
        padding: 10px; /* optional, for spacing */
        margin: 50px; /* optional, for spacing */
        min-width: 200px; /* optional, to ensure a minimum width */
        border-radius: 30px;
    }
    
    #room_form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    
    input[type="text"] {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
    }

    .room-link {
        background-color: teal;
        color: white;
    }
    
    button {
        padding: 10px;
        border-radius: 5px;
        background-color: #ffc107;
        color: white;
        border: none;
        cursor: pointer;
    }
    `;
}
