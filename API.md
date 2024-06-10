### API

#### GET user/info

- Request : X
- Response : MyUser list
- Detail : return currently log-in MyUser object
- Usage

```
response = await fetch(`user/info`, GET)
data = await response.json()
data[0].username, data[0].email, ...
```

#### POST user/info

Never Used

#### GET info/

- Requset : X
- Response : MyUser list
- Detail : return all MyUser Object
- Usage

```
response = await fetch(`info/`, GET)
data = await response.json()
data.forEach(user => {
    ${user.username}
    ${user.email}
})
```

#### POST user/login

- Request : [username, password]
- Response : {'message', status}
- Detail : try to login, and return 200 or 400
- Usage

```
response = await fetch(`user/login`, POST, JSON.stringify({ username, password })
data = await response.json()
alert(data.message)
```

#### POST user/sign_up_view

deleted

#### POST user/sign_up

- Request : form[username, password, email, profile_picture]
- Response : {'message', status}
- Detail : try to create new MyUser with given info, and return 200 or 400
- Usage

```
const formData = new FormData();
formData.append('username', username);
formData.append('password', password);
response = await fetch(`user/sign_up`, POST, formData)
data = await response.json()
alert(data.message)
```

#### POST user/logout

- Request : []
- Response : {'message', status}
- Detail : try to logout, and return 200 or 400
- Usage

```
response = await fetch(`user/logout`, POST, JSON.stringify({}))
data = await response.json()
alert(data.message)
```

#### GET user/check_login

- Request : X
- Response : {status}
- Detail : check user login status, and return 200 or 301
- Usage

```
response = await fetch(`user/check_login`, GET)
if (response.status = 200) ...
```

#### GET user/profile_pictures/<str:filename>

- Request : X
- Response : HttpResponse(image/jpeg)
- Detail : return image(utf-8) at given path (filename)
- Usage

```
data = await fetch(`user/info`, GET).json()
response = await fetch(data[0].profile_picture, GET)
imageBlob = await response.blob();
imageUrl = URL.createObjectRUL(imageBlob)

const img = document.createElement("img");
img.src = imageUrl;
imageContainer.appendChild(img);
```

#### POST user/change_info

- Request : form['username', 'email', 'profile_picture']
- Response : {'message', status}
- Detail : change user data, and return 200 or 400
- Usage

```
const formData = new FormData();
formData.append('username', username);
formData.append('email', email);
response = await fetch(`user/change_info`, POST, formData);
data = await response.json();
alert(data.message);
```

#### POST user/block_request

- Request : ['apply_user', 'accept_user']
- Response : {'message', status}
- Detail : create Block object by given data, and return 200 or 400
- Usage

```
const formData = {
    apply_user: apply_user,
    accept_user: accept_user,
};
response = await fetch(`/user/block_request`, POST, JSON.stringify(formData))
```

#### POST user/block_release_request

- Request : ['apply_user', 'accept_user']
- Response : {'message', status}
- Detail : delete Block object by given data, and return 200 or 400
- Usage

```
const formData = {
    apply_user: apply_user,
    accept_user: accept_user,
};
response = await fetch(`/user/block_release_request`, POST, JSON.stringify(formData))
```

#### POST user/block_check_request

- Request : ['apply_user', 'accept_user']
- Response : {'message', status}
- Detail : create Block object by given data, and return 200 or 400 or 301 (blocked to chat)
- Usage

```
const formData = {
    apply_user: apply_user,
    accept_user: accept_user,
};
response = await fetch(`/user/block_check_request`, POST, JSON.stringify(formData))
```

#### GET chat/rooms/

- Request : X
- Response : Room object list or 301
- Detail : return all Room objects, or return status 301
- Usage

#### POST chat/rooms/

- Request : ['room_name']
- Response : {Room, status} or {'error', status}
- Detail : create room by name, and return it with 201. if failed, return error with 400
- Usage

#### GET chat/rooms/<slug:slug>/

- Request : X
- Response : {'room', 'messages'}
- Detail : if given slug room exist, return Room object and Message object
- Usage

#### GET chat/privaterooms/check/

#### GET chat/privaterooms/<slug:slug>/

#### GET chat/privaterooms/<str:sender>/<str:receiver>/

#### POST chat/privaterooms/<str:sender>/<str:receiver>/