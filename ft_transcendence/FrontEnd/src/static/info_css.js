export function info_style(style) {
	style.innerHTML = `
		body {
		  background-color: #333; /* Dark gray background */
		  color: white;
		  font-family: 'Noto Sans KR', sans-serif;
	  }
	  h1 {
		  font-size: 3rem; /* Larger font size for the title */
		  font-weight: 700; /* Thicker font weight for the title */
		  text-align: center;
		  padding: 40px 0; /* Add padding above and below the title */
	  }
		.button-container {
		  display: flex; /* Use flexbox for centering */
		  align-items: center; /* Center vertically */
		  justify-content: center; /* Center horizontally */
		  gap: 10px; /* Space between buttons */
		}
	  .custom-yellow-btn {
		  background-color: #ffc107;
		  color: black;
		  padding: 10px 20px;
		  border-radius: 5px;
		  width: 300px; /* Fixed width for buttons */
		  height: 50px; /* Fixed height for buttons */
		  text-align: center;
	  }
	  .userinfo-container {
		  display: flex;
		  align-items: flex-start;
	  }
	  #profile-image {
		  display: flex; /* Use flexbox for centering */
		  align-items: center; /* Center vertically */
		  justify-content: center; /* Center horizontally */
		  width: 100%;
		  max-width: 530px; /* Fixed width */
		  height: 300px; /* Fixed height */
		  overflow: hidden; /* Hide any overflow */
		  margin-right: 10px;
	  }
	  #profile-image img {
		  width: 100%; /* Scale the image to fit the container */
		  max-height: 100%; /* Scale the image to fit the container */
		  object-fit: cover; /* Ensure image fits within the specified size */
	  }
	  .input-container {
		  margin-left: 10px;
		  flex-grow: 1;
		  height: 300px;
	  }
	  .stat-container {
		  display: flex;
		  align-items: flex-start;
		  justify-content: center;
	  }
	  .stat-container .col {
		  flex: 1; /* Ensure columns take up equal width */
		  margin-right: 20px; /* Add margin between columns */
	  }
	  .stat-container .col:last-child {
		  margin-right: 0; /* Remove margin for the last column */
	  }
	  .gamestat-container,
	  .match-container {
		  display: inline-block;
		  vertical-align: top;
		  width: 100%;
		  height: 270px;
		  padding-top: 3px;
		  padding-left: 20px;
		  padding-right: 20px;
		  padding-bottom: 20px;
		  border: 1px solid #ddd; /* Border color */
		  border-radius: 5px; /* Rounded corners */
		  box-shadow: 0 2px 4px rgba(79, 60, 60, 0.1); /* Shadow for a card effect */
		  background-color: #fff; /* White background for card effect */
		  color: #000; /* Set text color to black */
		  margin-bottom: 20px; /* Space between cards */
	  }
	  .modal {
		  color: #000;
		  display: none;
	  }
	`;
}
