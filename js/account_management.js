"use-strict"
import { load_view } from './page_loader.js'
//import { load_view } from './js/page_loader.js'
import { init as init_camera_controls } from './camera_control.js'

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('manage-account-view');
const back_btn = base.querySelector('.back-btn');
const logout_btn = base.querySelector('.logout-btn');
const new_passkey_btn = base.querySelector('.new-passkey-btn');
const save_image_btn = base.querySelector('.save-image-btn');
// ---------------------------------
// init
// ---------------------------------
init_camera_controls();

// ---------------------------------
// Events
// ---------------------------------
back_btn.addEventListener('click', () => load_view('welcome'));
logout_btn.addEventListener('click', handle_logout_btn_click);
new_passkey_btn.addEventListener('click', handle_new_passkey_btn_click);
save_image_btn.addEventListener('click', handle_save_image_btn_click);

// ---------------------------------
// Functions
// ---------------------------------
async  function handle_logout_btn_click(event) {
	console.log('TODO: Implement logout logic', event);
}

async  function handle_new_passkey_btn_click(event) {
	console.log('TODO: Implement new passkey logic', event);
}

async  function handle_save_image_btn_click(event) {
	console.log('TODO: Implement Image saving logic', event);
}