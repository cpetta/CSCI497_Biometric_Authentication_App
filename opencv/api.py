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

