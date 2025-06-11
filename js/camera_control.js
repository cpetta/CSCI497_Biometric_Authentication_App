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


	// ---------------------------------
	// Init
	// ---------------------------------
	let width = 940;
	let height = 0;
	let streaming = false;
	const context = canvas?.getContext("2d");

	// ---------------------------------
	// Events
	// ---------------------------------
	video?.addEventListener("canplay", handle_video_canplay, false);
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
		} else {
			clear_picture();
		}
	}

	function clear_picture() {
		if(context) {
			context.fillStyle = "#AAA";
			context.fillRect(0, 0, canvas?.width, canvas?.height);
		}

		const data = canvas?.toDataURL("image/png");
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
			canvas?.setAttribute("width", width);
			canvas?.setAttribute("height", height);
			streaming = true;
		}
	}

	function show_controls() {
		controls_container.classList.remove('-hidden');
	}
}
