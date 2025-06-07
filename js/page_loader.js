"use-strict"
// ---------------------------------
// Selectors
// ---------------------------------
const app = document.getElementById('app');
const loading_spinner = document.getElementById('view-loading-spinner');


export async function load_view(view_name) {
	try {
		start_loading();
		const request = await fetch(`/views/${view_name}.html`);
		
		if (!request.ok) {
			throw new Error(`Response status: ${request.status}`);
		}

		const response = await request.text();
		
		if(response) {
			app.innerHTML = response;
		}
		else {
			console.log('response', response);
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
	loading_spinner.classList.add('-hidden');
}

async function start_loading() {
	loading_spinner.classList.remove('-hidden');
}