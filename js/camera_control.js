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
	#main_controls = this.#base.querySelector('.primary-controls-container');
	#start_recording_btn = this.#base.querySelector('.start-recording-btn');

	// ---------------------------------
	// Init
	// ---------------------------------
	#width = 775;
	#height = 0;
	#record_time = 3000;

	#recording = false;
	#streaming = false;
	#saved_image = false;
	#context = this.#canvas?.getContext("2d");
	#placeholder_image_src;

	#stream = null;
	#stream_data = [];
	#last_recording = null;

	#onSaveCB;

	get image() {
		return this.#image.src;
	}

	get has_valid_video() {
		return Boolean(this.#video.src);
	}

	// ---------------------------------
	// Events
	// ---------------------------------
	constructor(args = {}) {
		this.#onSaveCB = args?.onSaveCB ?? function() {};

		this.#video.addEventListener("canplay", this.handle_video_canplay.bind(this));
		this.#start_btn.addEventListener('click', this.start_camera.bind(this), false);
		this.#picture_btn?.addEventListener('click', this.take_picture.bind(this), false);
		this.#clear_btn.addEventListener('click', this.handle_clear_btn_click.bind(this), false);
		this.#save_btn?.addEventListener('click', this.handle_save.bind(this));
		this.#start_recording_btn?.addEventListener('click', this.start_recording.bind(this));
	}

	// ---------------------------------
	// Functions
	// ---------------------------------
	async start_camera() {
		this.#image.classList.remove('-placeholder')
		this.#placeholder_image_src = this.#image.src;
		this.#image.src = '';

		try {
			if (!this.#streaming) {
				this.#stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
				this.#video.srcObject = this.#stream;
				this.#video.play();
			}
			this.show_controls();
		}
		catch(error) {
			console.error(`An error occurred: ${error}`);
		}
	}

	async  stop_camera() {
		this.#image.classList.add('-placeholder')
		this.#image.src = this.#placeholder_image_src;

		this.#video.pause();
		this.#video.srcObject = null;
		this.#video.src = null;
		this.#streaming = false;
		this.#stream = null;
		this.#video.controls = false;
		this.#video.loop = false;
		this.#video.pause();
		this.hide_controls();
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
		this.#controls_container.classList.add('-show');

		this.#main_controls?.classList?.remove('-hidden');
		this.#main_controls?.classList.add('-show');
	}

	async hide_controls() {
		this.#controls_container.classList.remove('-show');
		this.#controls_container.classList.add('-hidden');

		this.#main_controls?.classList?.remove('-show');
		this.#main_controls?.classList.add('-hidden');
	}

	async handle_clear_btn_click() {
		if(this.#saved_image) {
			this.clear_picture();
			this.#saved_image = false;
		}
		else {
			this.stop_camera();
		}
	}

	async handle_save() {
		if(typeof this.#onSaveCB == 'function') {
			this.#onSaveCB();
		}
	}

	async start_recording() {
		try {
			this.#start_recording_btn.classList.add('-recording');
			this.#video.src = null;
			this.#video.srcObject = this.#stream;
			this.#video.play();

			this.#canvas.style.display = 'none';
			let recorder = new MediaRecorder(this.#stream);

			recorder.ondataavailable = (event) => this.#stream_data.push(event.data);
			recorder.start();

			let stopped = new Promise((resolve, reject) => {
				recorder.onstop = resolve;
				recorder.onerror = (event) => reject(event.name);
			});

			let recorded = this.sleep(this.#record_time).then(() => {
				if (recorder.state === "recording") {
					recorder.stop();
				}
			});

			await Promise.all([stopped, recorded]);

			const blob = new Blob(this.#stream_data, { type: "video/webm" });
			this.#last_recording = blob;
			this.#stream_data = [];
			this.#video.srcObject = null;
			this.#video.src = URL.createObjectURL(blob);
			this.#video.controls = true;
			this.#video.loop = true;
			this.#video.play();
			this.#start_recording_btn.classList.remove('-recording');
		}
		catch(error) {
			if (error.name === "NotFoundError") {
				console.log("Camera or microphone not found. Can't record.");
			} else {
				console.log(error);
			}
		}
	}

	async stop_recording() {
		this.#stream.getTracks().forEach(track => track.stop());
	}

	async sleep(delay) {
  		return new Promise(resolve => setTimeout(resolve, delay));
	}
}