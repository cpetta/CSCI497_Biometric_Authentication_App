import json;

import functions as fn;
from flask import Flask, request, jsonify;
from flask_cors import CORS, cross_origin

path = 'api';
app = Flask(__name__);
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/setup', methods=['GET'])
def setup():
	return jsonify({
		'result': fn.create_db()
	});

@app.route('/api/user', methods=['GET'])
def get_user():
	user_name = request.args.get('user');
	
	if(user_name is None):
		return jsonify({'error':'No username provided'});

	result = fn.get_user(user_name);

	return jsonify({
		'username': user_name,
		'result': result,
	});

@app.route('/api/user', methods=['POST'])
@cross_origin()
def add_user():
	user_name = request.form.get('username');
	
	if(user_name is None):
		return jsonify({
			'error':'No username provided',
		});

	result = fn.add_user(user_name);

	return jsonify({
		'function': 'add_user',
		'username': user_name,
		'result': result,
	});


#app.run(debug=True)
app.run(port=8080, debug=True)