export async function renderprofileView() {
    let data;
    try {
        const csrftoken = Cookies.get('csrftoken');
        const response = await fetch('user/info', {
            method: 'GET',
            headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken' : csrftoken,
            },
        });
        console.log(response);
        if (response.ok) {
            data = await response.json();
        } else {
            const error = await response.json();
            location.hash = '/';
        }
        } catch (error) {
        console.error('API 요청 실패', error);
        return;
    }

    console.log(data);
    const content = document.getElementById('content');
    content.innerHTML = '';

    const userListContainer = document.createElement('div');

    // header
    const header = document.createElement('header');
    const userProfileBtn = document.createElement('h1');
    userProfileBtn.id = 'username';
    userProfileBtn.textContent = data.username;
    const userStatusBtn = document.createElement('button');
    userStatusBtn.id = 'userStatusBtn';
    userStatusBtn.textContent = 'user_status';
    
    const editForm = document.createElement('form');
    const editName = document.createElement('input');
    editName.type = 'text';
    editName.name = 'username';
    editName.placeholder = data.username;
    editName.classList.add('w-full', 'mt-2', 'px-4', 'py-2', 'rounded-xl');
    editForm.appendChild(editName);
    
    const editEmail = document.createElement('input');
    editEmail.type = 'text';
    editEmail.name = 'email';
    editEmail.placeholder = data.email;
    editEmail.classList.add('w-full', 'mt-2', 'px-4', 'py-2', 'rounded-xl');
    editForm.appendChild(editEmail);

    const editImage = document.createElement('imageURL');
    editImage.type = 'image';
    editImage.name = 'image';
    editImage.placeholder = data.image;
    editImage.classList.add('w-full', 'mt-2', 'px-4', 'py-2', 'rounded-xl');
    editForm.appendChild(editImage);
    
    
    // 정보 변경 저장 로직
    const editLabel = document.createElement('button');
    editLabel.id = '저장';
    editLabel.textContent = '저장';
    header.appendChild(userProfileBtn);
    header.appendChild(document.createElement('br'));
    header.appendChild(userStatusBtn);
    header.appendChild(document.createElement('br'));
    header.appendChild(document.createElement('br'));
    header.appendChild(document.createElement('br'));
    header.appendChild(document.createElement('br'));
    header.appendChild(editLabel);
    userListContainer.appendChild(header);

    // #1 정보 저장 로직 구현해야함
    editLabel.addEventListener('click', async (event) => {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const csrftoken = Cookies.get('csrftoken');
        console.log("In editLabel");
        try {
          const response = await fetch(`user/info`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ username, password }),
          });
    
          if (response.ok) {
            const data = await response.json();
            alert(data.message);
            location.hash = 'user/info';
          } else {
            const error = await response.json();
            alert(error.message);
          }
        } catch (error) {
          console.error('정보 수정 중 오류 발생:', error);
        }
      });

    return editForm;
}