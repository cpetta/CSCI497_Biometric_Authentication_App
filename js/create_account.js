"use-strict";
import { load_view } from './js/page_loader.js';
import { CameraControl } from './js/camera_control.js';
import { UF2 } from './js/uf2.js';

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
const directions = base.querySelector('.step-one');
const video_container = base.querySelector('.camera-controls-container');
const video_start_btn = base.querySelector('.video-start-btn');

// ---------------------------------
// init
// ---------------------------------
let delay_check;
const uf2 = new UF2();
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

	const request = await fetch("http://localhost:8080/api/user-exists", {
		method: "POST",
		body: new URLSearchParams({'username': username}),
	});

	const response = await request.json();
	const result = response.result;

	if(result == '1') {
		username_input.setCustomValidity('Username Taken');
		create_account_btn.classList.add('-invalid');
	} else {
		username_input.setCustomValidity("");
		create_account_btn.classList.remove('-invalid');
	}
}

async function create_user() {
	const name = name_input.value;
	const username = username_input.value;

	const response = await fetch("http://localhost:8080/api/user", {
		method: "POST",
		body: new URLSearchParams({
			'name': name,
			'username': username,
		}),
	});

	const result = await response.json();
	const user_id = result.result[0][0];

	return user_id;
}

async function handle_submit(event) {
	try {
		event.preventDefault();
		hide_messages();
		const form_is_valid = form.checkValidity();

		const name = name_input.value;
		const username = username_input.value;

		if(form_is_valid && camera.has_valid_video) {
			const user_id = await create_user();
			await Promise.all([
				create_face_recognizer(user_id),
				create_uf2(user_id),
			]);

			display_form_validity_message('Account Successfully created');
			directions.classList.add('-hidden');
			video_container.classList.add('-hidden');
			video_start_btn.classList.add('-hidden');
			create_account_btn.classList.add('-hidden');
		} else {
			display_form_validity_message();
		}
	}
	catch(error) {
		display_form_validity_message(error.message)
	}
}

async function display_form_validity_message(msg = '') {
	const message_list = [];

	if(msg) {
		message_list.push(msg);
	} else {
		const inputs = form.querySelectorAll('input');

		if(!camera.has_valid_video) {
			message_list.push('Please record a Facial Recognition Video');
		}

		for(const input of inputs) {
			if(!input.checkValidity()) {
				const label = input.closest('label')?.innerText;
				const message = input.validationMessage;
				message_list.push(`Invalid ${label} Entered - ${message}`);
			}
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

async function create_uf2(user_id) {
	try {
		const name = name_input.value;
		const username = username_input.value;
	
		await uf2.create({
			name: username,
			displayName: name,
		});

		const response = await fetch("http://localhost:8080/api/create_passkey", {
			method: "POST",
			body: new URLSearchParams({
				'user_id': 1,
				'raw_create_output': uf2.toJSON(),
				'public_key': uf2.public_key,
				'friendly_name': name,
			}),
		});
	}
	catch(error) {
		display_form_validity_message(error.message)
	}
}

async function create_face_recognizer(user_id) {
	const form_data = new FormData;
	form_data.append('user_id', user_id);
	form_data.append('video', camera.blob, 'user_video.webm');
	
	display_form_validity_message('Training Facial Recognition Modal, this may take up to 60 seconds');
	const response = await fetch("http://localhost:8080/api/create_facial_recognizer", {
		method: "POST",
		body: form_data,
	});

	const result = await response.json();
}