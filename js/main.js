"use-strict"
console.log('loaded js')
// ---------------------------------
// Selectors
// ---------------------------------

// ---------------------------------
// Events
// ---------------------------------
window.addEventListener('load', init_view_welcome_screen);


// ---------------------------------
// Functions
// ---------------------------------
async function init_view_welcome_screen() {
	load_view("welcome");
}

async function load_view(view_name) {
	try {
		const response = await fetch(`${view_name}.html`);
		
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.text();
		console.log(json);
	}
	catch (error) {
		console.error(error.message);
	}
}