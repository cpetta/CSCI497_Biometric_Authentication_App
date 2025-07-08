"use-strict"
import { load_view } from './js/page_loader.js'
import { CameraControl } from './js/camera_control.js'

// ---------------------------------
// Config
// ---------------------------------
const delay = 500;

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('create-account-view');
const back_btn = base.querySelector('.back-btn');
const name_input =  base.querySelector('#name');
const username_input =  base.querySelector('#username');
//const username_submit = base.querySelector('.username-submit');


// ---------------------------------
// init
// ---------------------------------
let delay_check;
const camera = new CameraControl();

// ---------------------------------
// Events
// ---------------------------------
back_btn.addEventListener('click', () => load_view('welcome'));
username_input.addEventListener('input', delay_check_username);
username_input.addEventListener('blur', check_username);
//username_submit.addEventListener('click', check_username);


// ---------------------------------
// Functions
// ---------------------------------
async function delay_check_username(event) {
	console.log(delay_check);
	if(delay_check) {
		clearTimeout(delay_check);
		delay_check = null;
		return;
	}

	delay_check = setTimeout(() => {
		check_username(event);
		delay_check = null;
	}, delay);
}

async function check_username(event) {
	event.preventDefault();

	const username = username_input.value;

	const request = await fetch("http://127.0.0.1:8080/api/user-exists", {
		method: "POST",
		body: new URLSearchParams({'username': username}),
	});

	const response = request.json();
	const result = response.result;
	if(result == 1) {
		console.log('Username Taken');
	} else {
		console.log('Checkmark');
	}
}

async function create_user() {
	const name = name_input.value;
	const username = username_input.value;

	await fetch("http://127.0.0.1:8080/api/user", {
		method: "POST",
		body: new URLSearchParams({
			'name': name,
			'username': username,
		}),
	});
}