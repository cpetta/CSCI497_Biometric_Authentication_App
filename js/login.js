"use-strict"
import { load_view } from './js/page_loader.js'
import { CameraControl } from './js/camera_control.js'

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('login-view');
const back_btn = base.querySelector('.back-btn');
const message_container = base.querySelector('.message-container');

// ---------------------------------
// init
// ---------------------------------
const camera = new CameraControl({
	showRecording: false,
});
camera.onRecordingFinishedCB = recognize_face,
// ---------------------------------
// Events
// ---------------------------------
back_btn.addEventListener('click', () => load_view('welcome'));

// ---------------------------------
// Functions
// ---------------------------------
async function recognize_face() {
	const form_data = new FormData;
	form_data.append('video', camera.blob, 'user_video.webm');
	
	display_message('Facial Recognition is running');
	const response = await fetch("http://localhost:8080/api/run_facial_recognizer", {
		method: "POST",
		body: form_data,
	});

	const result = await response.json();

	display_message(result);
}


async function display_message(msg = '') {
	if(!msg) {
		return;
	}

	message_container.innerText = msg;
	message_container.classList.add('-show');
	message_container.classList.remove('-hidden');
}