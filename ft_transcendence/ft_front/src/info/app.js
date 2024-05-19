import { select_image_view, select_game_stat_view, select_match_info_view } from './info_func.js'

export async function select_profile_view() {
    let apply_user;
    let accept_user;
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
                accept_user = element.username;
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

    const applyMatch = document.getElementById("match_button");
    
    let temp_data;
    applyMatch.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            const csrftoken = Cookies.get('csrftoken');
            const response = await fetch(`user/info`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                },
                credentials: 'include',
            });
            if (response.ok) {
                temp_data = await response.json();
            } else {
                const error = await response.json();
                console.error('API 요청 실패', error);
            }
        } catch (error) {
            console.error('API 요청 실패', error);
        }
        if (temp_data[0].username === accept_user) {
            alert("자기 자신에게는 매치 신청이 불가능합니다!!");
            return;
        }
        apply_user = temp_data[0].username;
        const match_name = apply_user + ' vs ' + accept_user;

        const now = new Date();
        const startDate = formatDateTime(now);
        const endDate = formatDateTime(new Date(now.getTime() + 60 * 60 * 1000));

        try {
            const formData = {
                apply_user: apply_user,
                accept_user: accept_user,
                start_date: startDate,
                end_date: endDate,
                is_active: true
            };

            const csrftoken = Cookies.get('csrftoken');
            const response = await fetch(`match/list`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                },
                body : JSON.stringify(formData),
            });
            if (response.ok) {
                const match_data = await response.json();
                alert("매치 생성 성공!");
                location.href = "/#";
            } else {
                const error = await response.json();
                console.error('API 요청 실패', error);
            }
        } catch (error) {
            alert(error);
        }
    });
}

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
