"use-strict"
import { sleep } from './sleep.js'
// ---------------------------------
// Config
// ---------------------------------
const animation_duration = 600;


// ---------------------------------
// Selectors
// ---------------------------------
const app = document.getElementById('app');
const loading_spinner = document.getElementById('view-loading-spinner');


export async function load_view(view_name) {
	try {
		await start_loading();
		const request = await fetch(`/views/${view_name}.html`);
		const request_js = await fetch(`/js/${view_name}.js`);
		
		if (!request.ok || !request_js.ok) {
			throw new Error(`Response status: ${request.status}`);
		}

		const response = await request.text();
		const response_js = await request_js.text();
		
		if(response) {
			app.innerHTML = response;
		}

		if(response_js) {
			const js_elm = document.createElement('script');
			js_elm.type = 'module';
			js_elm.innerHTML = response_js;
			app.append(js_elm);
		}
	}
	catch (error) {
		console.error(error.message);
	}
	finally {
		end_loading();
	}
}

async function end_loading() {
	loading_spinner.classList.remove('-show');
	loading_spinner.classList.add('-hidden');
	await sleep(animation_duration);
	app.classList.remove('-hidden');
	app.classList.add('-show');
}

async function start_loading() {
	app.classList.remove('-show');
	app.classList.add('-hidden');
	await sleep(animation_duration);
	loading_spinner.classList.remove('-hidden');
	loading_spinner.classList.add('-show');
}