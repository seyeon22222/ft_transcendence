export function profile_style_html() {
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
	.custom-yellow-btn {
		background-color: #ffc107;
		color: white;
	}
	.userinfo-container {
		display: flex;
		align-items: flex-start;
		justify-content: center; /* Center horizontally */
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
	#1:1_Match_List {
		display: flex;
    	flex-direction: column;
   		gap: 10px;
	}
	.match-item {
		display: flex;
		align-items: center; /* Align items vertically centered */
		padding: 5px; /* Optional: Add padding for a better look */
	}
	.match-item p {
		margin: 0; /* Remove default margin */
		flex-grow: 1; /* Allow the paragraph to take up available space */
	}
	.match-item .btn {
		margin-left: 5px;
	}
	`;
}
