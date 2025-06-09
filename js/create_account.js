"use-strict"
import { load_view } from './page_loader.js'
//import { load_view } from './js/page_loader.js'
import { init as init_camera_controls } from './camera_control.js'

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('create-account-view');
const back_btn = base.querySelector('.back-btn');

// ---------------------------------
// init
// ---------------------------------
init_camera_controls();

// ---------------------------------
// Events
// ---------------------------------
back_btn.addEventListener('click', () => load_view('welcome'));