"use-strict"
//import { load_view } from './page_loader.js';
import { load_view } from './js/page_loader.js';
// ---------------------------------
// Selectors
// ---------------------------------
const app = document.getElementById('app');
// ---------------------------------
// Events
// ---------------------------------
window.addEventListener('load', init_view_welcome_screen);

// ---------------------------------
// Functions
// ---------------------------------
async function init_view_welcome_screen() {
	await load_view("welcome");
}