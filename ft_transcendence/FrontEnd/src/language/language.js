import { check_login } from "../utilities.js";
import { dictionary } from "./dictionary.js"

export async function setTextsbyLang(pageName) {
	let langNow = 'ko';
	if (await check_login() === true) {
		const csrftoken = Cookies.get('csrftoken');
		const response = await fetch('user/info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
		});
		
		if (response.ok) {
			const data = await response.json();
			langNow = data[0].language;
			document.getElementById("languageSelector").value = langNow;
		}
	}
	else
		langNow = document.getElementById("languageSelector").value;
	translateTexts(langNow, pageName);
}

function translateTexts(langNow, pageName) {
	document.querySelectorAll('[data-translate]').forEach(element => {
		const key = element.getAttribute('data-translate');
		element.innerText = dictionary[langNow][pageName][key];
    });

	document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
		const key = element.getAttribute('data-translate-placeholder');
		element.setAttribute('placeholder', dictionary[langNow][pageName][key]);
    });
}

function languageHandler() {
	const language = document.getElementById("languageSelector");
	language.addEventListener("change", async (event) => {
		event.preventDefault();
	
		if (await check_login() === true) {
			let data;
			const csrftoken = Cookies.get('csrftoken');
			const response = await fetch(`user/language`, {
				method : 'GET',
				headers : {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrftoken,
				},
				credentials: 'include',
			});
	
			if (response.ok) {
				data = await response.json();
			}
		
			await fetch('user/language', {
				method: 'POST',
				headers: {
					'Content-Type' : 'application/json',
					'X-CSRFToken' : csrftoken,
				},
				body: JSON.stringify({user_id : data[0].user_id, language: document.getElementById('languageSelector').value})
			});
		}
		const user_location = location.hash.slice(1).toLocaleLowerCase().split("/");
		let pageName = user_location[0];
		if (pageName.length === 0)
			pageName = "home";
		setTextsbyLang(pageName);
	});
}

languageHandler();
