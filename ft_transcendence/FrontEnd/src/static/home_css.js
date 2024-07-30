export function home_style() {
    return `
    body {
        background-color: #333; /* Dark gray background */
        color: white;
        font-family: 'Noto Sans KR', sans-serif;
    }
    h1 {
        font-size: 3rem; /* Larger font size for the title */
        font-weight: 700; /* Thicker font weight for the title */
    }
    .image-container {
        text-align: center;
        margin: 20px 0;
    }
    .image-container img {
        max-width: 40%; /* Smaller image size */
        height: auto;
    }
    .buttons-container {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    .buttons-container a,
    .buttons-container button {
        text-decoration: none;
        color: white;
        padding: 10px 20px;
        border: 2px solid white;
        border-radius: 5px;
        width: 250px; /* Fixed width for buttons */
        text-align: center;
        background-color: transparent;
        font-size: 1rem;
    }
    .buttons-container a:hover,
    .buttons-container button:hover {
        background-color: #555; /* Slightly lighter gray on hover */
    }
	.modal {
		color: black;
		display: none;
	}
    `;
}
