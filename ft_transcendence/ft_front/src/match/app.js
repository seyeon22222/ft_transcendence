export async function match_view(hash) {
    const tournament_name = hash.slice(1);
    const arr = tournament_name.split(`%20`);
    let cnt = 0;
    arr.forEach(element => {
        cnt++;
        if (cnt == arr.length)
            document.getElementById("tournament_name").innerHTML += element;    
        else
            document.getElementById("tournament_name").innerHTML += element + " "; 
    });
    
    // 토너먼트에 대한 정보 출력
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch('match/matchview', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        const player1_name = data[0].player1_username;
        const player2_name = data[0].player2_username;
        const player1 = document.getElementById('semi_final1');
        player1.innerHTML = '';
        player1.innerHTML += player1_name;
        const player2 = document.getElementById('semi_final2');
        player2.innerHTML = '';
        player2.innerHTML += player2_name;
        if (data[0].match_result !== "") {
            const winner = document.getElementById('final');
            winner.innerHTML = '';
            winner.innerHTML += data[0].match_result;
        }
    } else {
        const error = await response.json();
        alert(error);
    }
}

/*

1. 토너먼트 모델에 토너먼트 방을 만든 사람에게 권한을 부여 -> order 부분 추가
2. 방장 권한이 있으면 토너먼트 시작버튼으로 토너먼트를 시작할 수 있도록 추가하기
3. 1:1 매칭의 경우, 이름을 생성하는 것이 아닌, 고유한 id를 통해서 해당 매치에 접근을 할 수 있도록 하기

*/