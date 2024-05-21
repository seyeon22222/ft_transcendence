import { formatDateTime } from "../info/info_func.js";

export async function tournament_view(hash) {
    const tournament_name = hash.slice(1);
    const arr = tournament_name.split(`%20`);
    let cnt = 0;
    let tournament_id;
    arr.forEach(element => {
        cnt++;
        if (cnt == arr.length)
            document.getElementById("tournament_name").innerHTML += element;    
        else
            document.getElementById("tournament_name").innerHTML += element + " "; 
    });
    
    // 토너먼트에 대한 정보 출력
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch('match/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
    });

    const player = [];

    if (response.ok) {
        const data = await response.json();
        for (let i = 0; i < data.length; ++i) {
            if (equal_arr(arr, data[i].name.split(" "))) {
                tournament_id = data[i].id;
                for (let j = 0; j < data[i].participant.length; ++j) {
                    player.push(data[i].participant[j]);
                }
                break;
            }
        }
        console.log(player);
    } else {
        const error = await response.json();
        alert(error);
    }

    let t_data;
    try {
        const csrftoken = Cookies.get('csrftoken');
        const response_t = await fetch('user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });
        if (response_t.ok) {
            t_data = await response_t.json();
        } else {
            const error = await response_t.json();
            console.error('API 요청 실패', error);
        }
    } catch(error) {
        alert(error)
    }

    const apply_button = document.getElementById('tournament_button');
    apply_button.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const formData = {
                username: t_data[0].username,
                tournament_name: tournament_name,
            };

            const response = await fetch(`match/matchapply/${tournament_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                const error = await response.json();
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    })
}



function equal_arr(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

/*

1. 토너먼트 모델에 토너먼트 방을 만든 사람에게 권한을 부여 -> order 부분 추가
2. 방장 권한이 있으면 토너먼트 시작버튼으로 토너먼트를 시작할 수 있도록 추가하기
3. 1:1 매칭의 경우, 이름을 생성하는 것이 아닌, 고유한 id를 통해서 해당 매치에 접근을 할 수 있도록 하기

*/