"use-strict";
import { load_view } from './js/page_loader.js';
import { CameraControl } from './js/camera_control.js';

// ---------------------------------
// Config
// ---------------------------------
const delay = 500;

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('create-account-view');
const message_container = base.querySelector('.message-container');
const form = base.querySelector('.user-form');
const back_btn = base.querySelector('.back-btn');
const name_input =  base.querySelector('#name');
const username_input =  base.querySelector('#username');
const create_account_btn =  base.querySelector('#create-account-btn');
//const username_submit = base.querySelector('.username-submit');


// ---------------------------------
// init
// ---------------------------------
let delay_check;
const camera = new CameraControl();

// ---------------------------------
// Events
// ---------------------------------
base.addEventListener('click', handle_page_click);
form.addEventListener('input', hide_messages);
back_btn.addEventListener('click', () => load_view('welcome'));
username_input.addEventListener('input', delay_check_username);
username_input.addEventListener('blur', check_username);
create_account_btn.addEventListener('click', handle_submit);

name_input.addEventListener('input', e => e.target.classList.remove('-init'), {once: true,});
username_input.addEventListener('input', e => e.target.classList.remove('-init'), {once: true,});
//username_submit.addEventListener('click', check_username);


// ---------------------------------
// Functions
// ---------------------------------
async function handle_page_click(event) {
	if(event.target.closest('#create-account-btn') != create_account_btn) {
		hide_messages();
	}
}

async function delay_check_username(event) {
	if(delay_check) {
		clearTimeout(delay_check);
		delay_check = null;
	}

	delay_check = setTimeout(() => {
		check_username(event);
		delay_check = null;
	}, delay);
}

async function check_username(event) {
	event.preventDefault();
	username_input.setCustomValidity("");

	if(!username_input.checkValidity()) {
		return;
	}

	const username = username_input.value;

	const request = await fetch("http://127.0.0.1:8080/api/user-exists", {
		method: "POST",
		body: new URLSearchParams({'username': username}),
	});

	const response = await request.json();
	const result = response.result;

	if(result == '1') {
		username_input.setCustomValidity('Username Taken');
	} else {
		username_input.setCustomValidity("");
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

async function handle_submit(event) {
	event.preventDefault();
	hide_messages();
	const form_is_valid = form.checkValidity();

	if(form_is_valid && video_is_valid) {
		create_user();
	} else {
		display_form_validity_message();
	}
}

async function display_form_validity_message() {
	const inputs = form.querySelectorAll('input');
	
	const message_list = [];

	if(!camera.has_valid_video) {
		message_list.push('Invalid Facial Recognition - Video Must be Recorded');
	}

	for(const input of inputs) {
		if(!input.checkValidity()) {
			const label = input.closest('label')?.innerText;
			const message = input.validationMessage;
			message_list.push(`Invalid ${label} Entered - ${message}`);
		}
	}

	message_container.innerText = message_list.join('\n');
	message_container.classList.add('-show');
	message_container.classList.remove('-hidden');
}

function hide_messages() {
	message_container.classList.add('-hidden');
	message_container.classList.remove('-show');
}