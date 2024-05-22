export function login_js() {
  // set style
  const style = document.getElementById("style");
  style.innerHTML = `
    body {
        background-color: #333; /* Dark gray background */
        color: white;
        font-family: 'Noto Sans KR', sans-serif;
    }
    .custom-yellow-btn {
        background-color: #ffc107;
        color: white;
    }
    .narrow-card {
        max-width: 400px; /* Adjust this value to make the box narrower or wider */
    }
    .center-text { text-align: center; }
    .spacing {
        margin-top: 3rem; /* Adjust the value as needed for desired spacing */
    }
    `;
  const csrftoken = Cookies.get("csrftoken");
  try {
    fetch("user/check_login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      if (response.status === 200) {
        location.href = "/#";
      } else {
        const loginForm = document.getElementById("login_form");
        loginForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const username = document.getElementById("username_input").value;
          const password = document.getElementById("password_input").value;
          const csrftoken = Cookies.get("csrftoken");

          try {
            const response = await fetch("user/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
              },
              body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
              const data = await response.json();
              alert(data.message);
              location.href = "/#";
            } else {
              const error = await response.json();
              alert(error.message);
            }
          } catch (error) {
            console.error("로그인 요청 중 오류 발생 : ", error);
          }
        });
      }
    });
  } catch (error) {
    console.error("로그인 여부 확인 중 오류 발생 : ", error);
  }

  return null;
}
