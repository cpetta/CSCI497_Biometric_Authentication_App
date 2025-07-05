import json;

import functions as fn;
from flask import Flask, request, jsonify;

path = 'api';
app = Flask(__name__);

@app.route('/api/setup', methods=['GET'])
def setup():
	return jsonify({
		'result': fn.create_db()
	});

@app.route('/api/user', methods=['GET'])
def get_users():
	user_name = request.args.get('user');
	
	if(user_name is None):
		return jsonify({'error':'No username provided'});

	result = fn.get_user(user_name);
	
	return jsonify({
		'username': user_name,
		'result': result,
	});

app.run(debug=True)