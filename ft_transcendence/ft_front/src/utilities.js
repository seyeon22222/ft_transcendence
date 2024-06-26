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
    // initializeWebsocket();
    return true;
  } catch (error) {
    console.error('로그인 여부 확인 중 오류 발생 : ', error);
  }
}

export function change_date(matchDateStr) {
  // 문자열을 Date 객체로 변환
  const matchDate = new Date(matchDateStr);

  // 연도, 월, 일, 시간, 분을 추출
  const year = matchDate.getFullYear();
  const month = String(matchDate.getMonth() + 1).padStart(2, '0');
  const day = String(matchDate.getDate()).padStart(2, '0');
  const hour = String(matchDate.getHours()).padStart(2, '0');
  const minute = String(matchDate.getMinutes()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
}