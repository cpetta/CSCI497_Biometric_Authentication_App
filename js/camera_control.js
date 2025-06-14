export class CameraControl {
	"use-strict"
	// ---------------------------------
	// Selectors
	// ---------------------------------
	#base = document.querySelector('.camera-controls-container');
	#video = this.#base.querySelector('.video-stream');
	#canvas = this.#base.querySelector('.video-canvas');
	#image = this.#base.querySelector('.video-image');
	#controls_container = this.#base.querySelector('.camera-controls-buttons-container');
	#start_btn = document.querySelector('.video-start-btn');
	#picture_btn = this.#base.querySelector('.take-picture-btn');
	#save_btn = this.#base.querySelector('.save-image-btn');
	#clear_btn = this.#base.querySelector('.end-video-btn');

	// ---------------------------------
	// Init
	// ---------------------------------
	#width = 775;
	#height = 0;
	#streaming = false;
	#saved_image = false;
	#context = this.#canvas?.getContext("2d");

	get image() {
		return this.#image.src;
	}

	// ---------------------------------
	// Events
	// ---------------------------------
	constructor() {
		this.#video.addEventListener("canplay", this.handle_video_canplay.bind(this));
		this.#start_btn.addEventListener('click', this.start_camera.bind(this), false);
		this.#picture_btn.addEventListener('click', this.take_picture.bind(this), false);
		this.#clear_btn.addEventListener('click', this.handle_clear_btn_click.bind(this), false);
	}

	// ---------------------------------
	// Functions
	// ---------------------------------
	async start_camera() {
		this.#image.classList.remove('-placeholder')
		this.#image.src = '';
		try {
			if (!this.#streaming) {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
				this.#video.srcObject = stream;
				this.#video.play();
			}
			this.show_controls();
		}
		catch(error) {
			console.error(`An error occurred: ${error}`);
		}
	}

	async take_picture(event) {
		event.preventDefault();
		
		if (this.#canvas && this.#width && this.#height) {
			this.#canvas.width = this.#width;
			this.#canvas.height = this.#height;
			this.#context?.drawImage(this.#video, 0, 0, this.#width, this.#height);

			const data = this.#canvas.toDataURL("image/png");
			this.#image.setAttribute("src", data);
			this.#saved_image = true;
		} else {
			this.clear_picture();
		}
	}

	async clear_picture() {
		this.#context?.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
		this.#image?.setAttribute("src", '');
	}

	async handle_video_canplay(ev) {
		if (!this.#streaming) {
			this.#height = (this.#video.videoHeight / this.#video.videoWidth) * this.#width;
			this.#video.setAttribute("width", this.#width);
			this.#video.setAttribute("height", this.#height);
			this.#canvas?.setAttribute("width", this.#width);
			this.#canvas?.setAttribute("height", this.#height);
			this.streaming = true;
		}
	}

	async show_controls() {
		this.#controls_container.classList.remove('-hidden');
	}

	async handle_clear_btn_click() {
		if(this.#saved_image) {
			this.clear_picture();
			this.#saved_image = false;
		}
		else {
			this.#video.pause();
			this.#video.srcObject = null;
			this.#streaming = false;
		}
	}
}