export function login_style(style) {
	style.innerHTML = `
	  body {
		  background-color: #333; /* Dark gray background */
		  color: white;
		  font-family: 'Noto Sans KR', sans-serif;
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