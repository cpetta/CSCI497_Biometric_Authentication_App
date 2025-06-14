"use-strict"
import { load_view } from './page_loader.js'
//import { load_view } from './js/page_loader.js'
import { CameraControl } from './camera_control.js'

// ---------------------------------
// Selectors
// ---------------------------------
const base = document.getElementById('login-view');
const back_btn = base.querySelector('.back-btn');

// ---------------------------------
// init
// ---------------------------------
const camera = new CameraControl();

// ---------------------------------
// Events
// ---------------------------------
back_btn.addEventListener('click', () => load_view('welcome'));