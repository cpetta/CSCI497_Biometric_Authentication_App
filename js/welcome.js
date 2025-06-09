"use-strict"
import { load_view } from './page_loader.js'
//import { load_view } from './js/page_loader.js'

console.log('welcome.js');
// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('welcome-view');
const login_btn = base.querySelector('.welcome-login-btn');
const create_account_btn = base.querySelector('.welcome-create-account-btn');

// ---------------------------------
// Events
// ---------------------------------
login_btn.addEventListener('click', handle_login_btn_click);
create_account_btn.addEventListener('click', handle_create_account_btn_click)
// ---------------------------------
// Functions
// ---------------------------------


function handle_login_btn_click() {
	load_view("login");
}

function handle_create_account_btn_click() {
	load_view("create_account");
}