export async function init() {
	"use-strict"
	// ---------------------------------
	// Selectors
	// ---------------------------------
	const base = document.querySelector('.camera-controls-container');
	const video = base.querySelector('.video-stream');
	const canvas = base.querySelector('.video-canvas');
	const image = base.querySelector('.video-image');

	const controls_container = base.querySelector('.camera-controls-buttons-container');
	const start_btn = document.querySelector('.video-start-btn');
	const picture_btn = base.querySelector('.take-picture-btn');
	const save_btn = base.querySelector('.save-image-btn');
	const clear_btn = base.querySelector('.end-video-btn');


	// ---------------------------------
	// Init
	// ---------------------------------
	let width = 775;
	let height = 0;
	let streaming = false;
	let saved_image = false;
	const context = canvas?.getContext("2d");

	// ---------------------------------
	// Events
	// ---------------------------------
	video?.addEventListener("canplay", handle_video_canplay, false);
	start_btn.addEventListener('click', start_camera, false);
	picture_btn.addEventListener('click', take_picture, false);
	clear_btn.addEventListener('click', handle_clear_btn_click, false);

	// ---------------------------------
	// Functions
	// ---------------------------------
	async function start_camera() {
		image.classList.remove('-placeholder-image')
		image.src = '';
		try {
			if (!streaming) {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
				video.srcObject = stream;
				video.play();
			}
			show_controls();
		}
		catch(error) {
			console.error(`An error occurred: ${error}`);
		}
	}

	async function take_picture(event) {
		event.preventDefault();
		
		if (canvas && width && height) {
			canvas.width = width;
			canvas.height = height;
			context?.drawImage(video, 0, 0, width, height);

			const data = canvas.toDataURL("image/png");
			image.setAttribute("src", data);
			saved_image = true;
		} else {
			clear_picture();
		}
	}

	function clear_picture() {
		if(context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}

		const data = canvas?.toDataURL("image/png");
		image.setAttribute("src", data);
	}

	function handle_video_canplay(ev) {
		if (!streaming) {
			height = (video.videoHeight / video.videoWidth) * width;

			if (isNaN(height)) {
				height = width / (4 / 3);
			}

			video.setAttribute("width", width);
			video.setAttribute("height", height);
			canvas?.setAttribute("width", width);
			canvas?.setAttribute("height", height);
			streaming = true;
		}
	}

	function show_controls() {
		controls_container.classList.remove('-hidden');
	}

	function handle_clear_btn_click() {
		if(saved_image) {
			clear_picture();
			saved_image = false;
		}
		else {
			video.pause();
			video.srcObject = null;
			streaming = false;
		}
	}
}
