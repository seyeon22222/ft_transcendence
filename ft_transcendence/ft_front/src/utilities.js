/*
    check whether current user is login or not
    if login, return true. else, return false.
*/
export async function check_login() {
  try {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch('user/check_login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    });

    if (response.status === 301) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('로그인 여부 확인 중 오류 발생 : ', error);
  }
}