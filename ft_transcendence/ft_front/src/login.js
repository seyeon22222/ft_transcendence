export function renderLogin() {
  const content = document.getElementById('content');
  const loginForm = document.createElement('form');
  loginForm.classList.add('mb-5');

  const buttonContainer = document.createElement('div');

  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.name = 'username';
  usernameInput.placeholder = '아이디';
  usernameInput.classList.add('w-full', 'mt-2', 'px-4', 'py-2', 'rounded-xl');

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.placeholder = '비밀번호';
  passwordInput.classList.add('w-full', 'mt-2', 'px-4', 'py-2', 'rounded-xl');

  const loginButton = document.createElement('button');
  loginButton.type = 'submit';
  loginButton.textContent = '로그인';
  loginButton.classList.add('px-5', 'py-3', 'rounded-xl', 'text-white', 'bg-teal-800', 'hover:bg-teal-700');
  buttonContainer.appendChild(loginButton);

  const signupButton = document.createElement('button');
  signupButton.type = 'submit2';
  signupButton.textContent = '회원가입';
  signupButton.classList.add('px-5', 'py-3', 'rounded-xl', 'text-white', 'bg-teal-800', 'hover:bg-teal-700');
  buttonContainer.appendChild(signupButton);

  loginForm.appendChild(usernameInput);
  loginForm.appendChild(passwordInput);
  loginForm.appendChild(buttonContainer);
  

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch(`user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        location.hash = 'user/login_suc';
        // 로그인 성공 시 추가 작업 수행 (예: 홈페이지로 리디렉션 등)
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
    }
  });

  loginForm.addEventListener('submit2', async (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch(`/user/sign_up/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // 로그인 성공 시 추가 작업 수행 (예: 홈페이지로 리디렉션 등)
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
    }
  });
  
  content.appendChild(loginForm);
  return loginForm;
}
