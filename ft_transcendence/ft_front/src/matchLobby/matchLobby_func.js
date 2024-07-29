import router from "../../base/router.js"
import { formatDateTime } from "../info/info_func.js";
import { showModal } from "../utilities.js";
import { dictionary } from "../language/dictionary.js"

export async function tournament_list_view(container) {
    let data;
    const csrftoken = Cookies.get('csrftoken');
        const response = await fetch('match/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });

        if (response.ok) {
            data = await response.json();
            container.innerHTML = '';
            data.forEach(tournament => {
                const tournamentLink = document.createElement('a');
                tournamentLink.href = `/#tournament/${tournament.name}`;
                tournamentLink.textContent = tournament.name;
                tournamentLink.classList.add('tournament-link', 'block', 'p-2', 'bg-gray-700', 'text-white', 'rounded', 'mb-2', 'hover:bg-gray-600');
                tournamentLink.style.marginLeft = '10px';
                tournamentLink.style.marginRight = '10px';
                container.appendChild(tournamentLink);
            });
        }   
}

export async function make_tournament() {
    const createForm = document.getElementById("tournament_form");
    createForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        let data;
        const csrftoken = Cookies.get('csrftoken');
        const response_t = await fetch('user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });
        if (response_t.ok) {
            data = await response_t.json();
        } else {
            const error = await response_t.json();
            console.error('API 요청 실패', error);
        }
        
        const tournament_name = document.getElementById("tournament_name").value;
        const name = data[0].username;
        const now = new Date();
        const startDate = formatDateTime(now);
        const endDate = formatDateTime(new Date(now.getTime() + 60 * 60 * 1000));
        

        const formData = new FormData();
        formData.append('tournament_name', tournament_name);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('is_active', true);
        formData.append('username', name);

        const res = await fetch('match/list', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
            },
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            const modal = document.querySelector('.modal');
            const newModal = new bootstrap.Modal(modal);
            const modalBody = document.querySelector('.modal .modal-body p');
            const user_lang = document.getElementById('languageSelector').value;
            modalBody.innerHTML = `<span>'${data.name}' </span><span data-translate="tournament_create">${dictionary[user_lang].matchlobby.tournament_create}</span>`;
            newModal.show();
            modal.addEventListener('hidden.bs.modal', function () {
                router();
            });
        } else {
            showModal('matchlobby', 'create_err');
        }
    })
}

export async function multimatch_list_view(container) {
    let data;
    const csrftoken = Cookies.get('csrftoken');
    const m_response = await fetch('match/multimatchList', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
    });

    if (m_response.ok) {
        data = await m_response.json();
        container.innerHTML = '';
        data.forEach(multiMatch => {
            const multiMatchLink = document.createElement('a');
            multiMatchLink.href = `/#multi/${multiMatch.name}`;
            multiMatchLink.textContent = multiMatch.name;
            multiMatchLink.classList.add('multiMatch-link', 'block', 'p-2', 'bg-gray-700', 'text-white', 'rounded', 'mb-2', 'hover:bg-gray-600');
            multiMatchLink.style.marginLeft = '10px';
            multiMatchLink.style.marginRight = '10px';
            container.appendChild(multiMatchLink);
        });
    }
}


export async function match_list_view(container) {
    const matchcsrftoken = Cookies.get('csrftoken');
    const matchresponse = await fetch('match/matchview', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': matchcsrftoken,
        },
        credentials: 'include',
    });
    if (matchresponse.ok) {
        const temp_data = await matchresponse.json();
        container.innerHTML = '';
        temp_data.forEach(match => {
            if (match.status === "accepted") {
                const matchLink = document.createElement('a');
                matchLink.href = `/#match/${match.id}`;
                matchLink.textContent = match.name;
                matchLink.classList.add('match-link', 'block', 'p-2', 'bg-gray-700', 'text-white', 'rounded', 'mb-2', 'hover:bg-gray-600');
                matchLink.style.marginLeft = '10px';
                matchLink.style.marginRight = '10px';
                container.appendChild(matchLink);
            }
        });
    }
}
