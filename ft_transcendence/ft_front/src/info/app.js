import { matchLobby_html } from "../matchLobby/html.js";
import {
  select_image_view,
  select_game_stat_view,
  select_match_info_view,
  formatDateTime,
} from "./info_func.js";

export async function select_profile_view() {
  let apply_user;
  let accept_user;
  let user_location = location.hash.slice(1).toLocaleLowerCase().split("/");
  let user_name = user_location[1];
  let data;
  let response;
  let csrftoken;

  try {
    csrftoken = Cookies.get("csrftoken");
    response = await fetch(`info/${user_name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
    });
    if (response.ok) {
      data = await response.json();
    } else {
      const error = await response.json();
      console.error("API 요청 실패", error);
    }
  } catch (error) {
    console.error("API 요청 실패", error);
  }
  if (data) {
    let flag;
    const name = document.getElementById("username");
    const email = document.getElementById("email");
    email.textContent = "";
    data.forEach((element) => {
      if (element.username === user_name) {
        flag = true;
        name.textContent = element.username;
        accept_user = element.username;
        if (!element.email) email.textContent = null;
        else email.textContent = element.email;
        select_image_view(element);
        select_game_stat_view(element);
        select_match_info_view(element);
      }
    });
    if (!flag) {
      alert("해당 유저가 없습니다");
      location.href = "/#";
    }
  }
  let temp_data;
  const requestMatchButton = document.getElementById("match_button");
  requestMatchButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const req_csrftoken = Cookies.get("csrftoken");
      const req_response = await fetch(`user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": req_csrftoken,
        },
        credentials: "include",
      });
      if (req_response.ok) {
        temp_data = await req_response.json();
      } else {
        const error = await req_response.json();
        console.error("API 요청 실패", error);
      }
    } catch (error) {
      console.error("API 요청 실패", error);
    }
    if (temp_data[0].username === accept_user) {
      alert("자기 자신에게는 매치 신청이 불가능합니다!!");
      return;
    }
    apply_user = temp_data[0].username;
    const match_name = apply_user + " vs " + accept_user;

    const now = new Date();
    const startDate = formatDateTime(now);
    const endDate = formatDateTime(new Date(now.getTime() + 60 * 60 * 1000));

    const mat_csrftoken = Cookies.get("csrftoken");
    const formData = {
      apply_user: apply_user,
      accept_user: accept_user,
      name: match_name,
    };

    const mat_response = await fetch("/match/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": mat_csrftoken,
      },
      body: JSON.stringify(formData),
    });

    if (mat_response.ok) {
      alert("매치 신청 성공!");
      location.href = "/#";
    } else {
      const error = await mat_response.json();
      console.log(error);
    }
  });

  const applyChat = document.getElementById("chat_button");
  applyChat.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      csrftoken = Cookies.get("csrftoken");
      response = await fetch(`user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
      });
      if (response.ok) {
        temp_data = await response.json();
      } else {
        const error = await response.json();
        console.error("API 요청 실패", error);
      }
    } catch (error) {
      console.error("API 요청 실패", error);
    }

    if (temp_data[0].username === accept_user) {
      alert("자기 자신에게는 채팅 신청이 불가능합니다!!");
      return;
    }

    // get private room and check duplicate
    const sender = temp_data[0].username;
    const receiver = accept_user;
    const apply_user = temp_data[0].username;

    //seycheon_block------------------------------------
    const formData = {
      apply_user: apply_user,
      accept_user: accept_user,
    };

    const mat_csrftoken = Cookies.get("csrftoken");
    const block_response = await fetch("/user/block_check_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": mat_csrftoken,
      },
      body: JSON.stringify(formData),
    });

    if (block_response.ok) {
      //------------------------------------------
      try {
        csrftoken = Cookies.get("csrftoken");
        response = await fetch(`chat/privaterooms/${sender}/${receiver}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        });

        if (response.status === 200) {
          console.log("already private chatting exists");

          data = await response.json();

          const slug = data.slug;
          location.href = "/#chatprivate/" + slug;
        } // 404 - no private room
        else {
          console.log("creating private chatting...");

          // get slug by user with API
          response = await fetch(`chat/privaterooms/${sender}/${receiver}/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
          });

          data = await response.json();

          const slug = data.slug;
          location.href = "/#chatprivate/" + slug;
        }
      } catch (error) {
        console.error("API failed : ", error);
      }
    } else {
      alert("채팅 차단 상태입니다!");
    }
  });

  //seycheon_block
  const requestBlockButton = document.getElementById("block_button");
  requestBlockButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const req_csrftoken = Cookies.get("csrftoken");
      const req_response = await fetch(`user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": req_csrftoken,
        },
        credentials: "include",
      });
      if (req_response.ok) {
        temp_data = await req_response.json();
      } else {
        const error = await req_response.json();
        console.error("API 요청 실패", error);
      }
    } catch (error) {
      console.error("API 요청 실패", error);
    }
    if (temp_data[0].username === accept_user) {
      alert("자기 자신에게는 채팅 차단 신청이 불가능합니다!!");
      return;
    }
    apply_user = temp_data[0].username;

    const mat_csrftoken = Cookies.get("csrftoken");
    const formData = {
      apply_user: apply_user,
      accept_user: accept_user,
    };

    const block_response = await fetch("/user/block_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": mat_csrftoken,
      },
      body: JSON.stringify(formData),
    });

    if (block_response.ok) {
      alert("채팅 차단 성공!");
      location.href = "/#";
    } else {
      const error = await block_response.json();
      console.log(error);
    }
  });

  //seycheon_block
  const requestBlockReleaseButton = document.getElementById(
    "block_release_button"
  );
  requestBlockReleaseButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const req_csrftoken = Cookies.get("csrftoken");
      const req_response = await fetch(`user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": req_csrftoken,
        },
        credentials: "include",
      });
      if (req_response.ok) {
        temp_data = await req_response.json();
      } else {
        const error = await req_response.json();
        console.error("API 요청 실패", error);
      }
    } catch (error) {
      console.error("API 요청 실패", error);
    }
    if (temp_data[0].username === accept_user) {
      alert("자기 자신에게는 차단 해제가 불가능합니다!!");
      return;
    }
    apply_user = temp_data[0].username;

    const mat_csrftoken = Cookies.get("csrftoken");
    const formData = {
      apply_user: apply_user,
      accept_user: accept_user,
    };

    const block_release_response = await fetch("/user/block_release_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": mat_csrftoken,
      },
      body: JSON.stringify(formData),
    });

    if (block_release_response.ok) {
      alert("차단 해제 성공!");
    } else {
      const error = await block_release_response.json();
      console.log(error);
    }
  });
}
