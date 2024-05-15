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
            body: JSON.stringify({ user_id }),
        });
        if (response.ok) {
            data = await response.json();
        } else {
            const error = await response.json();
        }
        } catch (error) {
        console.error('API 요청 실패', error);
    }

    console.log(data);
    const content = document.getElementById('content');
    content.innerHTML = '';

    const userListContainer = document.createElement('div');

    // header
    const header = document.createElement('header');
    const userProfileBtn = document.createElement('button');
    userProfileBtn.id = 'userProfileBtn';
    userProfileBtn.textContent = 'user_profile';
    const userStatusBtn = document.createElement('button');
    userStatusBtn.id = 'userStatusBtn';
    userStatusBtn.textContent = 'user_status';
    const logoutLabel = document.createElement('button');
    logoutLabel.id = 'logout';
    logoutLabel.textContent = 'logout';
    header.appendChild(userProfileBtn);
    header.appendChild(document.createElement('br'));
    header.appendChild(userStatusBtn);
    header.appendChild(document.createElement('br'));
    header.appendChild(document.createElement('br'));
    header.appendChild(document.createElement('br'));
    header.appendChild(document.createElement('br'));
    header.appendChild(logoutLabel);
    userListContainer.appendChild(header);



    return userListContainer;
}