//import { load_view } from './js/page_loader.js'
//import { load_view } from './page_loader.js'
// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('login-view');
const video = base.querySelector('#login-view-video-stream');
const canvas = base.querySelector('#login-view-video-canvas');
const image = document.querySelector('#login-view-video-image');
const picture_btn = document.querySelector('#login-view-picture-btn');
const start_btn = document.querySelector('#login-view-video-start-btn');

// ---------------------------------
// Init
// ---------------------------------
let width = 940;
let height = 0;
let streaming = false;
const context = canvas.getContext("2d");

// ---------------------------------
// Events
// ---------------------------------
video.addEventListener("canplay", handle_video_canplay, false);
start_btn.addEventListener('click', start_camera, false);
picture_btn.addEventListener('click', take_picture, false);

// ---------------------------------
// Functions
// ---------------------------------
async function start_camera() {
	try {
		if (!streaming) {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
			video.srcObject = stream;
			video.play();
		}
	}
	catch(error) {
		console.error(`An error occurred: ${error}`);
	}
}

async function take_picture(event) {
	event.preventDefault();
	
	if (width && height) {
		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);

		const data = canvas.toDataURL("image/png");
		image.setAttribute("src", data);
	} else {
		clearPhoto();
	}
}

function clear_picture() {
	context.fillStyle = "#AAA";
	context.fillRect(0, 0, canvas.width, canvas.height);

	const data = canvas.toDataURL("image/png");
	image.setAttribute("src", data);
}

function handle_video_canplay(ev) {
	if (!streaming) {
		console.log('handle_video_canplay');
		height = (video.videoHeight / video.videoWidth) * width;

		if (isNaN(height)) {
			height = width / (4 / 3);
		}

		video.setAttribute("width", width);
		video.setAttribute("height", height);
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		streaming = true;
	}
}



