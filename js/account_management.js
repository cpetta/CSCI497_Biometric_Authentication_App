"use-strict"
import { load_view } from './js/page_loader.js'
import { CameraControl } from './js/camera_control.js';
import { UF2 } from './js/uf2.js';

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('manage-account-view');
const back_btn = base.querySelector('.back-btn');
const logout_btn = base.querySelector('.logout-btn');
const new_passkey_btn = base.querySelector('.new-passkey-btn');
const passkey_list_node = base.querySelector('.passkey-list');
// ---------------------------------
// init
// ---------------------------------
const camera = new CameraControl({
	onSaveCB: handle_save_image_btn_click,
});

get_passkey_list();
// ---------------------------------
// Events
// ---------------------------------
back_btn.addEventListener('click', () => load_view('welcome'));
logout_btn.addEventListener('click', handle_logout_btn_click);
new_passkey_btn.addEventListener('click', handle_new_passkey_btn_click);

// ---------------------------------
// Functions
// ---------------------------------
async  function handle_logout_btn_click(event) {
	console.log('TODO: Implement logout logic', event);
	load_view('welcome');
}

async  function handle_new_passkey_btn_click(event) {
	console.log('TODO: Implement new passkey form logic', event);
	const passkey_name = 'Passkey Name Placeholder';
	const username = 'janedoe';
	const display_name = 'Jane Doe';
	const uf2 = new UF2();
	
	try {
		await uf2.create({
			name: username,
			displayName: display_name,
		});
	}
	catch(error) {
		console.error(error);
	}

	// Debug
	const passkey_node = create_passkey_list_item({
		name: passkey_name,
	});
	passkey_list_node.append(passkey_node);

	//get_passkey_list();
	console.log('uf2.credential', uf2.credential);
}

async  function handle_save_image_btn_click(event) {
	console.log('TODO: Implement Image saving logic', event);
	console.log('camera image', camera.image);

}

async  function get_passkey_list() {
	console.log('TODO: get registered passkey names from database');
	
	passkey_list_node.innerHTML = '';

	const debug_passkeys = [
		{name: 'Google Pixel 6a'},
	];

	const passkey_list = debug_passkeys;

	for(const passkey of passkey_list) {
		const passkey_node = create_passkey_list_item(passkey);
		passkey_list_node.append(passkey_node);
	}
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
	remove_icon.src = './assets/xmark-solid.svg';
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