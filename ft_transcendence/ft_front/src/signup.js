export function renderSignup() {
    return `
      <div class="p-20 text-center">
        <h1 class="text-6xl text-white">Sign up</h1>
      </div>
      <form method="post" action="." class="lg:w-1/4 px-4 mx-auto">
        {% csrf_token %}
        <div class="mb-5">
          <label class="text-white">아이디</label>
          <input type="text" name="username" class="w-full mt-2 px-4 py-2 rounded-xl">
        </div>
        <div class="mb-5">
          <label class="text-white">비밀번호</label>
          <input type="text" name="password" class="w-full mt-2 px-4 py-2 rounded-xl">
        </div>
        <div class="mb-5">
          <label class="text-white">이메일</label>
          <input type="text" name="email" class="w-full mt-2 px-4 py-2 rounded-xl">
        </div>
        {% if form.errors %}
          {% for field in form %}
            {% for error in field.errors %}
              <div class="mb-5 p-4 rounded-xl bg-red-300 text-white">
                <p>{{ error | escape }}</p>
              </div>
            {% endfor %}
          {% endfor %}
        {% endif %}
        <button class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700">회원가입</button>
      </form>
    `;
  }