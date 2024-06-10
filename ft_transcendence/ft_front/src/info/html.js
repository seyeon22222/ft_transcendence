// export function info_html() {
//   return `
//     <div>
//         <a h1 href='/#' class="text-white">Home</a>
//     </div>
    
//     <form class="mb-5" id="profile_form">
//         <h1> 유저 정보 </h1>
//         <div id="profile-image">프로필 사진</div>
//         <br>
//         <div id="online_status"> 
//             <span id="online_status_value"></span>
//         </div>
//         <br>
//         <h1>ID</h1>
//         <br>
//         <h2 name="username" class="w-full mt-2 px-4 py-2" id="username"><h1>
//         <br>
//         <h1>EMAIL</h1>
//         <br>
//         <h2 name="email" class="w-full mt-2 px-4 py-2" id="email"><h1>
//         <br>
//         <h1>게임 스탯</h1>
//         <br>
//         <h2 class="w-full mt-2 px-4 py-2" id="game_status"></h1>
//         <br>
//         <h1>최근 매치 정보</h1>
//         <br>
//         <h2 class="w-full mt-2 px-4 py-2" id="match_info"></h1>
        
//         <div>
//             <button type="submit" class="px-5 py-3 rounded-xl text-black bg-teal-800 hover:bg-teal-700" id="match_button">매치 신청</button>
//         </div>
//         <div>
//             <button class="px-5 py-3 rounded-xl bg-teal-800 hover:bg-teal-700" id="chat_button">1:1 채팅</button>
//         </div>
//         <div>
//         <button class="px-5 py-3 rounded-xl bg-teal-800 hover:bg-teal-700" id="block_button">1:1 채팅 차단</button>
//     </div>
//     <div>
//     <button class="px-5 py-3 rounded-xl bg-teal-800 hover:bg-teal-700" id="block_release_button">1:1 채팅 차단 해제</button>
// </div>
//     </form>
//     `;
// }

export function info_html() {
    return `
    <h1 class"my-4 text-center">USER INFORMATION</h1>
	<br>
    <div class="userinfo-container">
		<div class="col">
			<div id="profile-image">
			</div>
		</div>
		<div class="col">
			<div class="text_info">
				<h2 style="color: #ffc107;"> ID </h2>
				<h3 name="username" class="w-full mt-2 py-2" id="username"><h3>
				<h2 style="color: #ffc107;"> Email </h2>
				<h3 name="email" class="w-full mt-2 py-2" id="email"><h3>
			</div>
		</div>
    </div>
    <br>
    <br>
    <div class="stat-container">
		<div class="col">
			<div class="gamestat-container">
				<h2 class="my-4">GAME STAT</h2>
				<div id="game_status">
				</div>
			</div>
		</div>
		<div class="col">
			<div class="match-container">
				<h2 class="my-4">MATCH HISTORY</h2>
				<div id="match_info">
				</div>
			</div>
		</div>
	</div>
    <div class="button-container">
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="match_button" data-translate="match_request">매치 신청</button>
        </div>
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="chat_button" data-translate="chat">1:1 채팅</button>
        </div>
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="block_button" data-translate="chat_block">1:1 채팅 차단</button>
        </div>
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="block_release_button" data-translate="chat_unblock">1:1 채팅 차단 해제</button>
        </div>
    </div>
    `
}
