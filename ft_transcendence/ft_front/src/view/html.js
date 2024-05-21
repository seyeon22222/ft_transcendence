// export function profile_html() {
//     return `
//     <div>
//         <a h1 href='/#' class="text-white">Home</a>
//     </div>
    
//     <form class="mb-5" id="profile_form">
//         <h1> 유저 정보 </h1>
//         <div id="profile-image">프로필 사진</div>
//         <label for="new_image_input" class="form-label">프로필 사진</label>
//         <br>
//         <input type="file" accept="image/*" id="new_image_input"></input>
//         <br>
//         <label for="username_input" class="form-label">ID</label>
//         <br>
//         <input type="text" name="username" class="w-full mt-2 px-4 py-2 rounded-xl" id="username_input">
//         <br>
//         <label for="email_input" class="form-label">Email</label>
//         <br>
//         <input type="email" name="email" class="w-full mt-2 px-4 py-2 rounded-xl" id="email_input">
//         <br>
//         <label for="gamestat" class="form-label">게임 스탯</label>
//         <h1 class="w-full mt-2 px-4 py-2 rounded-xl" id="game_status"></h1>
//         <br>
//         <label for="matchresult" class="form-label">최근 매치 결과</label>
//         <h1 class="w-full mt-2 px-4 py-2 rounded-xl" id="match_info"></h1>
//         <div>
//             <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="edit_button">저장</button>
//         </div>
//     </form>
//     `;
// }

export function profile_html() {
    return `
    <h1 class="my-4 text-center">USER INFORMATION</h1>
    <div class="userinfo-container">
        <div id="profile-image">
        </div>
        <div class="input-container">
            <form id="profile_form">
                <div class="mb-3">
                    <label for="new_image_input" class="form-label">사진 변경</label>
                    <input type="file" accept="image/*" id="new_image_input" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="username_input" class="form-label">ID</label>
                    <input type="text" name="username" class="form-control" id="username_input">
                </div>
                <div class="mb-3">
                    <label for="email_input" class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" id="email_input">
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-evenly spacing">
                    <button type="submit" class="btn custom-yellow-btn flex-grow-1 me-2" id="edit_button">변경사항 저장</button>
                </div>
            </form>
        </div>
    </div>
    <br>
    <br>
    <div class="gamestat-container">
        <h2 class="my-4">GAME STATISTICS</h2>
        <div id="game_status">
        </div>
    </div>
    <div class="match-container">
        <h2 class="my-4">MATCH HISTORY</h2>
        <div id="match_info">
        </div>
    </div>
    `;
}