export async function dataChange(changeData) {
    changeData.addEventListener("click", async function (event) {
      event.preventDefault();
      try {
        const csrftoken = Cookies.get('csrftoken');
        const formData = new FormData();
        formData.append('username', document.getElementById("username_input").value);
        formData.append('email', document.getElementById("email_input").value);
        if (document.getElementById("new_image_input").files[0]) {
          formData.append('profile_picture', document.getElementById("new_image_input").files[0]);
        } else {
          formData.append('profile_picture', document.getElementById("profile-image").value || '');
        }
  
        const response = await fetch('user/change_info', {
          method: 'POST',
          headers: {
            'X-CSRFToken': csrftoken,
          },
          body: formData
        });
  
        if (response.ok) {
          const data = await response.json();
          alert(data.message);
          location.href = '/#';
        }
        else {
            const error = await response.json();
            alert(error.message);
        }
      } catch (error) {
        console.log("error:", error);
      }
    });
  }
  
export async function image_view(data) {
  const imageContainer = document.getElementById("profile-image");
  imageContainer.innerHTML = "";

  if (data[0].profile_picture) {
      const img = document.createElement("img");
      const csrftoken = Cookies.get('csrftoken');
      const response = await fetch(data[0].profile_picture, {
      method: 'GET',
      headers: {
          'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
      });
      if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      img.src = imageUrl;
      img.alt = '프로필 이미지';
      
      imageContainer.appendChild(img);
      const profileImageDiv = document.getElementById("profile-image");
      profileImageDiv.innerHTML = '';
      profileImageDiv.appendChild(img);
      }

  }
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.id = "new_image_input";
  imageContainer.appendChild(fileInput);
}

export function game_stat_view(data) {
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

export function match_info_view(data) {
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