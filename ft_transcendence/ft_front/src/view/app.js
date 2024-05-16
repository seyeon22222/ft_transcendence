import { image_view, game_stat_view, match_info_view, dataChange } from './view_func.js';

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

    name.placeholder = data[0].username;
    email.placeholder = data[0].email;
    image_view(data);
    game_stat_view(data);
    match_info_view(data);
    // renderFriendList(data);
  }

  const changeData = document.getElementById("edit_button");
  dataChange(changeData);
}