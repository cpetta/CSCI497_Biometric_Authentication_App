export class UF2 {
	#id = new Uint8Array([70, 200, 80, 70, 200, 0, 80, 20]);
	#challenge;
	#rp = {
		id: window.location.host,
		name: "CSCI497 - Biometric Authentication App",
	};

	#credential;

	#user_id
	#username;
	#display_name;

	get credential() {
		return this.#credential;
	}

	get public_key() {
		return this.#credential.toJSON().response.publicKey;
	}

	constructor(args = {}) {
		console.log('TODO: Get uf2 challenge from server');
		this.#challenge = new Uint8Array([117, 61, 252, 231, 191, 241, 3, 33, 333, 923, 85, 61, 61]);
	}

	async create(args = {}) {
		console.log('TODO: Update logic to calculate user id, and handle no name entered');
		const id = this.#id;
		const name = args?.name;
		const display_name = args?.displayName;

		this.#credential = await navigator.credentials.create({
			publicKey: {
			challenge: this.#challenge,
			rp: this.#rp,
			user: {
				id: id,
				name: name,
				displayName: display_name,
			},
			pubKeyCredParams: [{ type: "public-key", alg: -7 }],
			},
		});
	}

	async get(args = {}) {
		const options = args.options;
		const controler = args.controler;
		//this.#credential = await navigator.credentials.get({ public_key });
		const credential = await navigator.credentials.get({
			publicKey: options,
			signal: controler.signal,
			mediation: 'conditional',
		});
	}

	toJSON() {
		return JSON.stringify(this.#credential);
	}
}