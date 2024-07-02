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

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

export async function check_language() {
	if (await check_login() === true) {
		let data;
		const csrftoken = Cookies.get('csrftoken');
		const lang_res = await fetch(`user/language`, {
			method : 'GET',
			headers : {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
			credentials: 'include',
		});

		if (lang_res.ok) {
			data = await lang_res.json();
			return data[0].language;
		}
	}
	return document.getElementById('languageSelector').value;
}

export function delete_back_show() {
	const modalBack = document.querySelector('.modal-backdrop');
	if (modalBack) {
		modalBack.classList.remove('modal-backdrop');
	}
	const bodyElement = document.querySelector('body');
	bodyElement.classList.remove('modal-open');
	bodyElement.style.overflow = '';
	bodyElement.style.paddingRight = '';
}

export function showModal(category, body) {
	const langNow = document.getElementById("languageSelector").value;
	const modal = new bootstrap.Modal(document.querySelector('.modal'));
	const modalBody = document.querySelector('.modal .modal-body p');
	modalBody.innerText = window.lang[langNow][category][body];
	modalBody.setAttribute('data-translate', body);
	// console.log(window.lang[langNow][category][body]);
	modal.show();
}
