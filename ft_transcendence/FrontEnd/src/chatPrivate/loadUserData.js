import { showModal } from "../utilities.js";

export async function loadUserData(roomSlug, csrfToken) {
  let userData;
  const userResponse = await fetch(`chat/privaterooms/getusers/${roomSlug}`, { // (response) > (userResponse)
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    credentials: "include",
  });

  if (userResponse.ok) {
    userData = await userResponse.json(); // (data) > (userData)
  } else {
    console.error("ERROR : cannot get user info from slug");
  }

  return userData;
}

export async function checkBlockStatus(userData, csrfToken) {
  const firstUser = userData.user1; // (user1) > (firstUser)
  const secondUser = userData.user2; // (user2) > (secondUser)

  const userFormData = { // (formData) > (userFormData)
    apply_user: firstUser, // (user1) > (firstUser)
    accept_user: secondUser, // (user2) > (secondUser)
  };

  const blockResponse = await fetch(`/user/block_check_request`, { // (block_response) > (blockResponse)
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // (csrftoken) > (csrfToken)
    },
    body: JSON.stringify(userFormData), // (formData) > (userFormData)
  });

  if (blockResponse.status !== 200) {
    const modalElement = document.querySelector(".modal"); // (modal) > (modalElement)
    showModal("chatprivate", "isblock_err");
    modalElement.addEventListener("hidden.bs.modal", function () {
      location.href = `/#`;
    });
    return false;
  }
  return true;
}
