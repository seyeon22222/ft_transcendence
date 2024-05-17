import { select_image_view, select_game_stat_view, select_match_info_view } from './info_func.js'

export async function select_profile_view() {
    let user_location = location.hash.slice(1).toLocaleLowerCase().split("/");
    let user_name = user_location[1];
    let data;
    try {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`info/${user_name}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
    });
    if (response.ok) {
        data = await response.json();
        console.log(data);
    } else {
        const error = await response.json();
        console.error('API 요청 실패', error);
    }
    } catch (error) {
    console.error('API 요청 실패', error);
    }
    if (data) {
        let flag;
        const name = document.getElementById("username");
        const email = document.getElementById("email");
        email.textContent = '';
        data.forEach(element => {
            if (element.username === user_name) {
                flag = true;
                name.textContent = element.username;
                if (!element.email)
                    email.textContent = null;
                else
                    email.textContent = element.email;
                select_image_view(element);
                select_game_stat_view(element);
                select_match_info_view(element);
            }
        });
        if (!flag){
            alert("해당 유저가 없습니다");
            location.href = '/#';
        }
    }
}