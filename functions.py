import os;
import cv2 as cv;
import numpy as np
import dlib;
import sqlite3 as sql;
import time;

#Config Settings
crop_pad = 20;
db_name = 'csci497_biometric_auth_app.db'


@staticmethod
def detect_faces(img):
	detector = dlib.get_frontal_face_detector();
	return detector(img);

@staticmethod
def crop_face(img, face, pad):
	x = face.left();
	y = face.top();
	x2 = face.right();
	y2 = face.bottom();

	crop_left = x - pad;
	crop_top = y - pad;
	crop_right = x2 + pad;
	crop_bottom = y2 + pad;

	img_face_cropped = img[crop_top:crop_bottom, crop_left:crop_right];
	return img_face_cropped;

@staticmethod
def convert_video_to_images(user_id):
	path = f'user_{user_id}';
	video_path = os.path.join(path, 'video');
	image_path = os.path.join(path, 'images');

	filename = os.path.join(video_path, f'{user_id}_video.webm');
	video = cv.VideoCapture(filename);

	if not os.path.exists(image_path):
		os.makedirs(image_path);
	
	i = 0;
	while True:
		ret, frame = video.read();
		gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY);
		gray = cv.equalizeHist(gray);
		faces = detect_faces(gray);

		if len(faces) <= 0 or len(faces) > 1:
			continue;

		img_gray = crop_face(gray, faces[0], 0);
		image_file = os.path.join(image_path, f'{i}.jpg');
		cv.imwrite(image_file, img_gray);
		i += 1

		if i > 100:
			break

@staticmethod
def train_recognizer(user_id):
	path = os.path.join(f'user_{user_id}', 'images');
	faces = [];
	labels = [];

	files = os.listdir(path); 
	
	for file in files:
		img_path = os.path.join(path, file);
		img = cv.imread(img_path, cv.IMREAD_UNCHANGED);
		faces.append(img);
		labels.append(int(user_id));
	
	recognizer = cv.face.LBPHFaceRecognizer_create();
	recognizer.train(faces, np.array(labels));
	recognizer_xml_path = os.path.join(f'user_{user_id}', f'{user_id}_face_recognition_model.xml');
	recognizer.save(recognizer_xml_path);
	return recognizer_xml_path;

@staticmethod
def run_recognizer(recognizer_file, video):
	cap = cv.VideoCapture(video);

	recognizer = cv.face.LBPHFaceRecognizer_create();
	recognizer.read(recognizer_file);
	overall_confidence = 0;
	
	for i in range(20):
		ret, frame = cap.read();
		img = cv.cvtColor(frame, cv.COLOR_BGR2GRAY);
		img = cv.equalizeHist(img);
		faces = detect_faces(img);
		
		if len(faces) <= 0 or len(faces) > 1:
			continue;

		face = faces[0];
		img = crop_face(img, face, 0);

		label, confidence = recognizer.predict(img);
		overall_confidence += confidence;
		
	overall_confidence = round(overall_confidence / i);
	return overall_confidence

@staticmethod
def create_db():
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	delete_db();
	db_list = get_db_list();

	if(not 'users' in db_list):
		db_cursor.execute('''
			CREATE TABLE users
			(user_id INTEGER PRIMARY KEY,
			name,
			user_name,
			create_date DEFALT CURRENT_TIMESTAMP NOT NULL)''');

	if(not 'recognizers' in db_list):
		db_cursor.execute('''
			CREATE TABLE recognizers
			(face_data_id INTEGER PRIMARY KEY,
			user_id integer,
			face_recognizor_xml,
			create_date DEFALT CURRENT_TIMESTAMP)''');

	if(not 'user_passkeys' in db_list):
		db_cursor.execute('''
		CREATE TABLE user_passkeys
		(credential_id INTEGER PRIMARY KEY,
		user_id integer,
		raw_create_output varchar(500),
		public_key varchar(200),
		counter integer,
		friendly_name varchar(200),
		create_date DEFALT CURRENT_TIMESTAMP)''');

	db_cursor.close();
	db_connection.close();
	return 1;

@staticmethod
def delete_db():
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();

	db_list = get_db_list();

	
	if('users' in db_list):
		db_cursor.execute("DROP TABLE users");
	
	if('recognizors' in db_list):
		db_cursor.execute("DROP TABLE recognizors");

	if('user_passkeys' in db_list):
		db_cursor.execute("DROP TABLE user_passkeys");

	#for db in db_list:
	#	print(db);
	#	db_cursor.execute("DROP TABLE " + db);
	
	db_cursor.close();
	db_connection.close();

@staticmethod
def get_db_list():
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	
	db_list = [];
	
	result = db_cursor.execute("SELECT name FROM sqlite_master");
	
	for db in result.fetchall():
		db_list.append(db[0]);
	
	db_cursor.close();
	db_connection.close();

	return db_list;

@staticmethod
def get_user(username):
	if(username is None):
		raise ValueError('The get_user function expects a username argument')
	
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	args = [(username)];
	query = db_cursor.execute('SELECT * FROM users where user_name=?', (args));
	result = query.fetchall();
	
	db_cursor.close();
	db_connection.close();

	return result;

@staticmethod
def get_username(user_id):
	if(user_id is None):
		raise ValueError('The get_username function expects a user_id argument')
	
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	args = [(user_id)];
	query = db_cursor.execute('SELECT user_name FROM users where user_id=?', (args));
	result = query.fetchall();
	
	db_cursor.close();
	db_connection.close();

	return result[0][0];

@staticmethod
def get_passkeys(user_id):
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	
	args = [(user_id)];
	query = db_cursor.execute('SELECT * FROM user_passkeys where user_id=?', (args));
	result = query.fetchall();
	
	db_cursor.close();
	db_connection.close();

	return result;

@staticmethod
def get_facial_recognizers():
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	query = db_cursor.execute('SELECT * FROM recognizers');
	result = query.fetchall();
	
	db_cursor.close();
	db_connection.close();

	return result;

@staticmethod
def check_user_exists(username):
	if(username is None):
		raise ValueError('The get_user function expects a username argument')
	
	username = username.lower();

	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	query = db_cursor.execute('SELECT * FROM users where user_name=?', ([username]));
	result = query.fetchall();
	
	db_cursor.close();
	db_connection.close();

	return len(result);

@staticmethod
def add_user(name, username):
	if(username is None):
		raise ValueError('The get_user function expects a username argument')
	
	name = name.lower();
	username = username.lower();

	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	now = time.strftime('%Y-%m-%d %H:%M:%S');

	query = db_cursor.execute('''
						   INSERT INTO users
						   (name, user_name, create_date)
						   VALUES(?, ?, ?)''', (name, username, now));
	db_connection.commit();

	result = get_user(username);
	
	db_cursor.close();
	db_connection.close();

	return result;

@staticmethod
def add_passkey(user_id, raw_create_output, public_key, friendly_name):
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	now = time.strftime('%Y-%m-%d %H:%M:%S');

	query = db_cursor.execute('''
						   INSERT INTO user_passkeys
						   (user_id, raw_create_output, public_key, counter, friendly_name, create_date)
						   VALUES(?,?,?,?,?,?)''', (user_id, raw_create_output, public_key, 0, friendly_name, now));
	db_connection.commit();

	result = get_user(user_id);
	
	db_cursor.close();
	db_connection.close();

	return result;

@staticmethod
def save_user_video(user_id, video):
	path = f'user_{user_id}/video';

	if not os.path.exists(path):
		os.makedirs(path);

	filename = os.path.join(path, f'{user_id}_video.webm');
	video.save(filename);

	return filename;

@staticmethod
def add_facial_recognizer(user_id, recognizer):
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	now = time.strftime('%Y-%m-%d %H:%M:%S');

	query = db_cursor.execute('''
						   INSERT INTO recognizers
						   (user_id, face_recognizor_xml, create_date)
						   VALUES(?,?, ?)''', (user_id, recognizer, now));
	db_connection.commit();

	db_cursor.close();
	db_connection.close();

	return 1;
