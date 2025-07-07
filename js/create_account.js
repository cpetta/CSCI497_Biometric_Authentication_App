"use-strict"
import { load_view } from './js/page_loader.js'
import { CameraControl } from './js/camera_control.js'

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('create-account-view');
const back_btn = base.querySelector('.back-btn');
const name_input =  base.querySelector('#name');
const username_input =  base.querySelector('#username');
const username_submit = base.querySelector('.username-submit');

// ---------------------------------
// init
// ---------------------------------
const camera = new CameraControl();

// ---------------------------------
// Events
// ---------------------------------
back_btn.addEventListener('click', () => load_view('welcome'));
username_submit.addEventListener('click', check_username);


// ---------------------------------
// Functions
// ---------------------------------
async function check_username(event) {
	event.preventDefault();

	const username = username_input.value;

	await fetch("http://127.0.0.1:8080/api/user-exists", {
		method: "POST",
		body: new URLSearchParams({'username': username}),
	});
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