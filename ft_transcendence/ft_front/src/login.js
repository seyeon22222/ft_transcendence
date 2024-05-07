export function renderLogin() {
    return `
      <br>
      <form action="{% url 'ft_user:login' %}" method="POST">
        {% csrf_token %}
        <div class="mb-5">
          <label class="text-white">아이디</label>
          <input type="text" name="username" value="{{user.username}}" class="w-full mt-2 px-4 py-2 rounded-xl">
        </div>
        <div class="mb-5">
          <label class="text-white">비밀번호</label>
          <input type="text" name="password" class="w-full mt-2 px-4 py-2 rounded-xl">
        </div>
        <button class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700">로그인</button>
      </form>
      <br>
    `;
  }