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

	if(result?.error) {
		display_message(result.error);
		return;
	} else {
		const username = result?.user_name || 'unknown';
		const message = 'Detected user name: ' + username + '\n user_id: ' + result?.user_id + '\n Confidence: ' + result?.confidence;
		display_message(message);
	}
}

async function check_uf2(event) {
	event.preventDefault();
	//try {
		const abortController = new AbortController();
		console.log(event);
		
		if (!(window.PublicKeyCredential && PublicKeyCredential.isConditionalMediationAvailable)) {
			throw new Error('Your browser does not support public key credentials, consider upgrading to the newest version and try again');
		}

		const isCMA = await PublicKeyCredential.isConditionalMediationAvailable();
		if (!isCMA) {  
			throw new Error('Your browser does not support passkey discovory, consider upgrading to the newest version and try again');
		}
		console.log('abortController', abortController);
		const options_request = '{"authenticatorAttachment":"cross-platform","clientExtensionResults":{},"id":"laM60PQxc41tsnWvMcIOnlfs4rk2eCM78NhRRDywFxQ2hCGj1fY0cJY5H6dLPpE4KHqPF5-KPi40RPE-w7QoiA","rawId":"laM60PQxc41tsnWvMcIOnlfs4rk2eCM78NhRRDywFxQ2hCGj1fY0cJY5H6dLPpE4KHqPF5-KPi40RPE-w7QoiA","response":{"attestationObject":"o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVjESZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NBAAAAAAAAAAAAAAAAAAAAAAAAAAAAQJWjOtD0MXONbbJ1rzHCDp5X7OK5NngjO_DYUUQ8sBcUNoQho9X2NHCWOR-nSz6ROCh6jxefij4uNETxPsO0KIilAQIDJiABIVggKYlrBHCbaeOeqoNld5sScNNGDPUv814OMMoJSAOszpgiWCBp2RfUovcTgTG-geQFk0gGIL1WosipJBxe7ZEvPLG5HQ","authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NBAAAAAAAAAAAAAAAAAAAAAAAAAAAAQJWjOtD0MXONbbJ1rzHCDp5X7OK5NngjO_DYUUQ8sBcUNoQho9X2NHCWOR-nSz6ROCh6jxefij4uNETxPsO0KIilAQIDJiABIVggKYlrBHCbaeOeqoNld5sScNNGDPUv814OMMoJSAOszpgiWCBp2RfUovcTgTG-geQFk0gGIL1WosipJBxe7ZEvPLG5HQ","clientDataJSON":"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiZFQzODU3X3hBeUZObTFVOVBRIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdCIsImNyb3NzT3JpZ2luIjpmYWxzZX0","publicKey":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEKYlrBHCbaeOeqoNld5sScNNGDPUv814OMMoJSAOszphp2RfUovcTgTG-geQFk0gGIL1WosipJBxe7ZEvPLG5HQ","publicKeyAlgorithm":-7,"transports":["usb"]},"type":"public-key"}';
		//const options_request = await fetch('http://localhost:8080/api/passkey_signin_request');
		const options_json = JSON.parse(options_request);
		//options_json.challenge = encodeURIComponent((new Uint8Array([117, 61, 252, 231, 191, 241, 3, 33, 333, 923, 85, 61, 61])).toBase64());
		options_json.challenge = encodeURIComponent((new Uint8Array([117, 61, 252, 231, 191, 241, 3, 33, 333, 923, 85, 61, 61])).toBase64());
		const temp = decodeURIComponent((new Uint8Array([117, 61, 252, 231, 191, 241, 3, 33, 333, 923, 85, 61, 61])).toBase64());

		console.log('temp', temp);
		console.log('options_json.challenge', options_json.challenge);

		const options = PublicKeyCredential.parseRequestOptionsFromJSON(options_json);

		//console.log('options', options);
		const credential = await navigator.credentials.get({
			publicKey: options,
			signal: abortController.signal,
			// Specify 'conditional' to activate conditional UI
			mediation: 'conditional'
		});

		//console.log('credential', credential);
		//console.log('abortController', abortController);

		

		//const test = await uf2.get({publicKey: publicKey});
	//}
	//catch(error) {
	//	display_form_validity_message(error.message)
	//}
}

async function display_message(msg = '') {
	if(!msg) {
		return;
	}

	message_container.innerText = msg;
	message_container.classList.add('-show');
	message_container.classList.remove('-hidden');
}