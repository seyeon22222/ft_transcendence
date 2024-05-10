export function renderSignupView() {
  const content = document.getElementById('content');
  const signupForm = document.createElement('form');
  signupForm.classList.add('mb-5');

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

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = '이메일';
  emailInput.classList.add('w-full', 'mt-2', 'px-4', 'py-2', 'rounded-xl');

  const signupButton = document.createElement('button');
  signupButton.type = 'button';
  signupButton.textContent = '회원가입';
  signupButton.classList.add('px-5', 'py-3', 'rounded-xl', 'text-white', 'bg-teal-800', 'hover:bg-teal-700');

  signupForm.appendChild(usernameInput);
  signupForm.appendChild(passwordInput);
  signupForm.appendChild(emailInput);
  signupForm.appendChild(signupButton);
  
  signupButton.addEventListener('click', async function() {
    try {
      const csrftoken = Cookies.get('csrftoken');
      const username = usernameInput.value;
      const password = passwordInput.value;
      const email = emailInput.value;
      console.log("In signupButton Click");
      const response = await fetch('/user/sign_up', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({username, password, email})
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        location.hash = '/'; // 처음 페이지로 이동
      } else {
        const error = 404;
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  });



  content.appendChild(signupForm);
  return signupForm;
}