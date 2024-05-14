export async function profile_view() {
  const profile_view = document.getElementById("profile_form");
  let data;
  try {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch('user/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
    });
    if (response.ok) {
      data = await response.json();
    } else {
      const error = await response.json();
      console.error('API 요청 실패', error);
    }
  } catch (error) {
    console.error('API 요청 실패', error);
  }
  if (data) {
    const name = document.getElementById("username_input");
    const email = document.getElementById("email_input");
    const image = document.getElementById("image");

    name.placeholder = data[0].username;
    email.placeholder = data[0].email;
    image_view(data);
    game_stat_view(data);
    match_info_view(data);
  }

  const changeData = document.getElementById("edit_button");
  changeData.addEventListener("click", async function() {
    try{
      const csrftoken = Cookies.get('csrftoken');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      const response = fetch('user/change_info', {
        method: 'POST',
        headers: {
          'X-CSRFToken' : csrftoken,
        },
        body: formData
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        location.href = '/';
      }
    } catch(error) {
      console.log("error:", error);
    }
    try {
      const csrftoken = Cookies.get('csrftoken');
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch('profile/upload/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrftoken,
        },
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.filename) {
          const imageContainer = document.getElementById("profile-image");
          const img = document.createElement("img");
          img.src = `/profile_pictures/${data.filename}`;
          img.alt = "프로필 이미지";
          imageContainer.innerHTML = "";
          imageContainer.appendChild(img);
        } else {
          console.error('이미지 업로드 실패:', data.error);
        }
      } else {
        const error = await response.json();
        console.error('이미지 업로드 실패:', error);
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
    }
  });

}

async function image_view(data) {
  const imageContainer = document.getElementById("profile-image");
  imageContainer.innerHTML = "";
  console.log(data[0]['profile_picture']);
  if (data[0]['profile_picture']) {
    
    const img = document.createElement("img");
    try {
      const csrftoken = Cookies.get('csrftoken');
      const response = await fetch(data[0]['profile_picture'], {
        method: 'GET',
        headers: {
          'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const image_base64 = await response.text();
        img.src = `data:image/jpeg;base64,${image_base64}`;
      } else {
        const error = await response.json();
        console.error('API 요청 실패', error);
      }
    } catch (error) {
      console.error('API 요청 실패', error);
    }
    img.alt = "프로필 이미지";
    imageContainer.appendChild(img);
  }
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  imageContainer.appendChild(fileInput);
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = async function() {
    try {
      const csrftoken = Cookies.get('csrftoken');
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch('profile/upload/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrftoken,
        },
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.filename) {
          const imageContainer = document.getElementById("profile-image");
          const img = document.createElement("img");
          img.src = `/profile_pictures/${data.filename}`;
          img.alt = "프로필 이미지";
          imageContainer.innerHTML = "";
          imageContainer.appendChild(img);
        } else {
          console.error('이미지 업로드 실패:', data.error);
        }
      } else {
        const error = await response.json();
        console.error('이미지 업로드 실패:', error);
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
    }
  };
  reader.readAsDataURL(file);
}


function game_stat_view(data) {
    const gamestatus = document.getElementById("game_status");
    const winCount = document.createElement("h1");
    const defeatCount = document.createElement("h1");
    const winRate = document.createElement("h1");
    const reflectRate = document.createElement("h1");
    if (!data.game_stat) {       
        winCount.textContent = "승리 횟수: 0";
        defeatCount.textContent = "패배 횟수: 0";
        winRate.textContent = "승률: 0%";
        reflectRate.textContent = "반사율: 0%";
    } else {
        winCount.textContent = data.game_stat.win_count;
        defeatCount.textContent = data.game_stat.defeat_count;
        winRate.textContent = data.game_stat.win_rate;
        reflectRate.textContent = data.game_stat.reflect_rate;
    }

    gamestatus.appendChild(winCount);
    gamestatus.appendChild(defeatCount);
    gamestatus.appendChild(winRate);
    gamestatus.appendChild(reflectRate);
}

function match_info_view(data) {
  const match_info = document.getElementById("match_info");
  const match_date = document.createElement("h1");
  const match_result = document.createElement("h1");
    if (!data.match_info) {
      match_date.textContent = "최근 매치: 없음";
      match_result.textContent = "최근 매치 결과: 없음";
    } else {
      match_date.textContent = "최근 매치:" + data.match_info.match_date[0];
      match_result.textContent = "최근 매치 결과:" + data.match_info.match_result[0];
    }
  match_info.appendChild(match_date);
  match_info.appendChild(match_result);
}