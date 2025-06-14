"use-strict"
import { load_view } from './js/page_loader.js'

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('welcome-view');
const login_btn = base.querySelector('.welcome-login-btn');
const create_account_btn = base.querySelector('.welcome-create-account-btn');

// Temp
base.querySelector('.welcome-manage-account-btn').addEventListener('click', () => load_view("account_management"));

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