export async function tournament_view(hash) {
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
    const response = await fetch('match/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
    });

    let player1;
    let player2;

    if (response.ok) {
        const data = await response.json();
        data.forEach(element => {
            const element_arr = element.name.split(" ");
            if (equal_arr(arr, element_arr))
                element.name;
        });
    } else {
        const error = await response.json();
        alert(error);
    }
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