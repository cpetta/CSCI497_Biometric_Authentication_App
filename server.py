import os;
import functions as fn;
import threading;
import webbrowser;

from flask import Flask, request, jsonify;
from flask_cors import CORS, cross_origin;
from http.server import SimpleHTTPRequestHandler, HTTPServer as BaseHTTPServer;

path = 'api';
app = Flask(__name__);
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type';

fn.create_db();

# Referenced https://stackoverflow.com/questions/73089846/python-3-simple-http-server-with-get-functional
def run_base_web_server():
	class HTTPHandler(SimpleHTTPRequestHandler):
		def translate_path(self, path):
			path = SimpleHTTPRequestHandler.translate_path(self, path)
			relpath = os.path.relpath(path, os.getcwd())
			fullpath = os.path.join(self.server.base_path, relpath)
			return fullpath


	class HTTPServer(BaseHTTPServer):
		def __init__(self, base_path, server_address, RequestHandlerClass=HTTPHandler):
			self.base_path = base_path
			BaseHTTPServer.__init__(self, server_address, RequestHandlerClass)

	httpd = HTTPServer(os.path.dirname(__file__), ("localhost", 80))
	print('Base web server started at localhost port 80')
	httpd.serve_forever();

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

	return jsonify({'result': result});

@app.route('/api/user-exists', methods=['POST'])
def get_user_exists():
	user_name = request.form.get('username');
	
	if(user_name is None):
		return jsonify({'error':'No username provided'});

	result = fn.check_user_exists(user_name);

	return jsonify({'result': result});

@app.route('/api/passkey_signin_request', methods=['POST'])
@cross_origin()
def get_passkey():
	user_id = request.form.get('user_id');
	
	if(user_id is None or user_id == ''):
		return jsonify({'error':'No user_id provided'});

	result = fn.get_passkeys(user_id);

	return jsonify({'result': result});

@app.route('/api/user', methods=['POST'])
@cross_origin()
def add_user():
	name = request.form.get('name');
	user_name = request.form.get('username');
	
	if(user_name is None or user_name == ''):
		return jsonify({'error':'No username provided'});

	if(name is None or name == ''):
		return jsonify({'error':'No name provided'});

	result = fn.add_user(name, user_name);

	return jsonify({'result': result});

@app.route('/api/create_passkey', methods=['POST'])
@cross_origin()
def create_passkey():
	user_id = request.form.get('user_id');
	raw_create_output = request.form.get('raw_create_output');
	public_key = request.form.get('public_key');
	friendly_name = request.form.get('friendly_name');
	
	if(user_id is None or user_id == ''):
		return jsonify({'error':'No user_id provided'});

	if(raw_create_output is None or raw_create_output == ''):
		return jsonify({'error':'No credential json (raw_create_output) provided'});

	if(public_key is None or public_key == ''):
		return jsonify({'error':'No user_id provided'});

	if(friendly_name is None or friendly_name == ''):
		return jsonify({'error':'No friendly_name provided'});

	result = fn.add_passkey(user_id, raw_create_output, public_key, friendly_name);

	return jsonify({'result': result});

@app.route('/api/create_facial_recognizer', methods=['POST'])
@cross_origin()
def create_facial_recognizer():
	user_id = request.form.get('user_id');
	video = request.files.get('video');

	if(user_id is None or user_id == ''):
		return jsonify({'error':'No user_id provided'});

	if(video is None or video == ''):
		return jsonify({'error':'No video provided'});

	fn.save_user_video(user_id, video);
	fn.convert_video_to_images(user_id);
	recognizer = fn.train_recognizer(user_id);

	if(recognizer == False):
		return jsonify({'error': 'Not enough facial data to create recognizer, please record a new video and try again.'});

	result = fn.add_facial_recognizer(user_id, recognizer);

	return jsonify({'result': 1});

@app.route('/api/run_facial_recognizer', methods=['POST'])
@cross_origin()
def run_facial_recognizer():
	video = request.files.get('video');

	if(video is None or video == ''):
		return jsonify({'error':'No video provided'});

	video_file = fn.save_user_video(0, video);
	recognizers = fn.get_facial_recognizers();
	
	current_confidence = 0;
	current_user_id = 0;

	for recognizer in recognizers:
		user_id = recognizer[1];
		recognizer_xml = recognizer[2];

		if not os.path.exists(recognizer_xml):
			continue;

		confidence = fn.run_recognizer(recognizer_xml, video_file);

		print(current_confidence);
		print(confidence);
		if(current_confidence < confidence):
			current_confidence = confidence;
			current_user_id = user_id;
	

	user_name = fn.get_username(user_id);

	return jsonify({
		'user_id': current_user_id,
		'user_name': user_name,
		'confidence': current_confidence
	});

def run_api():
	try:
		app.run(port=8080, debug=False);
	except:
		print('Run API experienced an error');

thread1 = threading.Thread(target=run_base_web_server);
# thread2 = threading.Thread(target=run_api);

thread1.start();
# thread2.start();
webbrowser.open('http://localhost', new=2);
app.run(port=8080, debug=True);