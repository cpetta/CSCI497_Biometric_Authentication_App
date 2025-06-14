export class UF2 {
	#challenge;
	#rp = {
		id: "https://cpetta.github.io/CSCI497_Biometric_Authentication_App",
		name: "CSCI497 - Biometric Authentication App",
	};

	#credential;

	#user_id
	#username;
	#display_name;

	get credential() {
		return this.#credential;
	}

	constructor(args = {}) {
		console.log('TODO: Get uf2 challenge from server');
		this.#challenge = new Uint8Array([117, 61, 252, 231, 191, 241, 3, 33, 333, 923, 85, 61, 61]);
	}

	async create(args = {}) {
		console.log('TODO: Update logic to calculate user id, and handle no name entered');
		const id = args?.id ?? new Uint8Array([70, 200, 80, 70, 200, 0, 80, 20]);
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
}