export function login_view() {
    return `
    <div class="button-container">
        <button id="userProfileBtn">user_profile</button>
        <br>
        <button id="joinChatButton">Join Chatting Room</button>
    </div>

    <div id="onlineUserLabel">Currently Logged In Users</div>
    <div id="userListContainer">
        <ul id="userList">
            <!-- 사용자 목록은 여기에 표시됩니다. -->
        </ul>
    </div>

    <div id="pongGame">
        <div id="gameTitle">PONG GAME</div>
        <div id="gameOptions">
            <button id="withComputerBtn">with_computer</button>
            <button id="withUsersBtn">with_users</button>
        </div>
    </div>

    
    <div id="liveChatLabel" class="ml-3">1:1 Live_Chat</div>
    <div id="chatContainer">
        <!-- Chat contents here -->
    </div>

    <div id="logout">
        <button id="logout_button" class="px-5 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700">Log Out</a>
    </div>

    <script>
        // 컴퓨터와 핑퐁 게임하는 화면으로 넘어가는 이벤트
        document.addEventListener("DOMContentLoaded", function() {
        var withComputerBtn = document.getElementById("withComputerBtn");
        withComputerBtn.addEventListener("click", function() {
            window.location.href = "{% url 'ft_user:pong_with_computer' %}"; // 이동할 페이지의 경로를 넣어주세요.
        });
    });

        // 주기적으로 서버에 사용자 목록 요청을 보내고 화면을 업데이트하는 함수
        function updateUserList() {
            $.ajax({
                url: '/current_users_api/',
                success: function(response) {
                    // 서버로부터 받은 사용자 목록을 화면에 업데이트
                    var userList = response.current_users;
                    var userListHTML = '';
                    for (var i = 0; i < userList.length; i++) {
                        var userId = 'user_' + i;
                    // 클릭 가능한 사용자 목록 생성
                    userListHTML += '<li id="' + userId + '" onclick="handleUserClick(\'' + userList[i] + '\')">' + userList[i] + '</li>'
                    }
                    $('#userList').html(userListHTML);
                }
            });
        }

        // 페이지 로드 후 초기 사용자 목록 업데이트
        $(document).ready(function() {
            updateUserList();
            // 1초마다 사용자 목록 업데이트
            setInterval(updateUserList, 10000);
        });


        // 사용자를 클릭했을 때 실행되는 함수


        function handleUserClick(username) {
            $.ajax({
            url: '/get_current_user_data/',  // JSON 데이터를 제공하는 서버의 URL
            method: 'GET',
            success: function(response) {
                // 서버로부터 받은 JSON 데이터를 이용하여 팝업 창에 표시할 내용 구성
                var currentUsername = response.username;
                
                // 현재 사용자 이름을 사용하여 필요한 작업을 수행
                var r = [username, currentUsername].sort();
                var sortedRoomname = r[0] + '_' + r[1]; 
                alert("click!")
                $.ajax({
                    url: "{% url 'chatting:room_make_or_get' %}",
                    type: 'POST',
                    headers: {
                        'X-CSRFToken': '{{ csrf_token }}'
                    },
                    data: {
                        room_name: sortedRoomname
                        // 다른 필요한 데이터도 함께 전달할 수 있습니다.
                    },
                    success: function(response) {
                        if (response.room_created) {
                            // 새로운 룸이 생성된 경우 채팅방 URL로 리디렉션
                            alert('success')
                            window.location.href = response.chat_room_url;
                        } else {
                            // 기존에 있는 룸이 반환된 경우 해당 URL로 리디렉션
                            alert('fail')
                            window.location.href = response.chat_room_url;
                        }
                    },
                    error: function(xhr, status, error) {
                        alert('error_fail')
                        // 채팅방 생성에 실패한 경우 처리
                        console.error('Failed to create chat room:', error);
                    }
                });
            },
            error: function(xhr, status, error) {
                // 에러 처리
                console.error(error);
            }
        });
        }

        function showProfile() {
            // 팝업 창 크기 설정
            var width = 400;
            var height = 300;
            
            // 화면 중앙 위치 계산
            var left = (window.innerWidth - width) / 2;
            var top = (window.innerHeight - height) / 2;
            
            // 사용자 프로필 팝업 생성
            var userProfilePopup = window.open('', 'UserProfile', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
            
            // AJAX 요청을 이용하여 현재 로그인한 사용자의 정보를 서버에서 가져옴
            $.ajax({
                url: '/get_current_user_data/',  // JSON 데이터를 제공하는 서버의 URL
                method: 'GET',
                success: function(response) {
                    // 서버로부터 받은 JSON 데이터를 이용하여 팝업 창에 표시할 내용 구성
                    var profileContent = '<h2>User Profile  and Game status </h2>';
                    profileContent += '<p>Username: ' + response.username + '</p>';
                    profileContent += '<p>Email: ' + response.email + '</p>';
                    // 기타 필요한 사용자 정보를 추가할 수 있음
                    
                    // 팝업 창에 내용 추가
                    userProfilePopup.document.body.innerHTML = profileContent;
                },
                error: function(xhr, status, error) {
                    // 에러 처리
                    console.error(error);
                }
            });
    

        }

        var userData = JSON.parse('{{ users_json|escapejs }}');  // JSON 데이터를 JavaScript 변수에 할당
        function showUsersStatus() {
        // 팝업 창 크기 설정
        var width = 400;
        var height = 800;
        
        // 화면 중앙 위치 계산
        var left = (window.innerWidth - width) / 2;
        var top = (window.innerHeight - height) / 2;
        
        // 사용자 상태 팝업 생성 및 화면 중앙에 위치 설정
        var userStatusPopup = window.open('', 'UserStatus', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
        
            // 팝업 창에 표시할 내용 구성 (검색 기능과 사용자 목록)
            var statusContent = '<h2>User Status</h2>';
                statusContent += '<input type="text" id="searchInput" oninput="filterUsers()" placeholder="Search for users...">';
                statusContent += '<div id="userListContainer">'; // 스크롤이 적용될 컨테이너
                statusContent += '<ul id="userList">';
                // 사용자 목록을 불러와서 팝업에 추가
                userData.forEach(function(user) {
                    statusContent += '<li>' + user.username + '</li>';
                });
                
                statusContent += '</ul>';
                statusContent += '</div>'; // 컨테이너 종료
                
                // 팝업 창에 내용 추가
                userStatusPopup.document.body.innerHTML = statusContent;
        }

        // 사용자 목록 필터링 함수
        function filterUsers() {
            var input, filter, ul, li, i, txtValue;
            input = document.getElementById('searchInput');
            filter = input.value.toUpperCase();
            ul = document.getElementById('userList');
            li = ul.getElementsByTagName('li');
            for (i = 0; i < li.length; i++) {
                txtValue = li[i].textContent || li[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = '';
                } else {
                    li[i].style.display = 'none';
                }
            }
        }
    </script>


    </body>

    `;
}