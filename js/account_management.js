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
const passkey_list = base.querySelector('.passkey-list');
// ---------------------------------
// init
// ---------------------------------
init_camera_controls();
get_passkey_list();
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
	get_passkey_list();
}

async  function handle_save_image_btn_click(event) {
	console.log('TODO: Implement Image saving logic', event);
}

async  function get_passkey_list() {
	const debug_1 = create_passkey_list_item({name: 'Google Pixel 6a'}); // Debug
	const debug_2 = create_passkey_list_item({name: 'Mini Yubikey'}); // Debug

	passkey_list.append(debug_1, debug_2);

}

function create_passkey_list_item(data) {
	const name = data.name;
	
	const name_node = document.createElement('span');
	name_node.classList.add('passkey-list-item-name');
	name_node.innerText = name;

	//const edit_icon = document.createElement('img');
	//edit_icon.classList.add('passkey-list-icon');
	//edit_icon.classList.add('-edit');
	//edit_icon.src = './assets/pencil-solid.svg';
	//edit_icon.alt = 'edit';
	//edit_icon.height = 25;
	//edit_icon.width = 25;

	const remove_icon = document.createElement('img');
	remove_icon.classList.add('passkey-list-icon');
	remove_icon.classList.add('-delete');
	remove_icon.src = './assets/x-mark.svg';
	remove_icon.alt = 'X';
	remove_icon.height = 25;
	remove_icon.width = 25;

	const li = document.createElement('li');
	li.classList.add('passkey-list-item');
	li.append(name_node);
	//li.append(edit_icon);
	li.append(remove_icon);

	remove_icon.addEventListener('click', () => remove_passkey(li));

	return li;
}

function remove_passkey(node) {
	console.log('TODO: remove passkey from database');
	node.remove();
}