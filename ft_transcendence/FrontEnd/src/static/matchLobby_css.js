export function matchLobby_style() {
	return `
    body {
        background-color: #333; /* Dark gray background */
        color: white;
        font-family: 'Noto Sans KR', sans-serif;
    }
	h1 {
		font-weight: 700;
		text-align: center;
		padding: 40px 0;
	}
	h2 {
		font-weight: 550;
	}
    .custom-yellow-btn {
        background-color: #ffc107;
        color: white;
    }
    .narrow-card {
        max-width: 400px; /* Adjust this value to make the box narrower or wider */
    }
    .center-text { text-align: center; }
    .spacing {
        margin-top: 3rem; /* Adjust the value as needed for desired spacing */
    }
	.modal {
		color: #000;
		display: none;
	}
    `;
}
