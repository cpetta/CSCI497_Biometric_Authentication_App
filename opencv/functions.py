import os;
import cv2 as cv;
import numpy as np
import dlib;
import sqlite3 as sql;
import time    

#Config Settings
crop_pad = 20;
db_name = 'csci497_biometric_auth_app.db'


@staticmethod
def detect_faces(img):
	detector = dlib.get_frontal_face_detector();
	return detector(img);

@staticmethod
def mark_faces(img, faces):
	for face in faces:
		x = face.left();
		y = face.top();
		x2 = face.right();
		y2 = face.bottom();
		cv.rectangle(img, (x, y), (x2,y2), (0, 255, 0), 2);
	return img;

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
def convert_images_to_grayscale(in_dir, out_dir):
	files = os.listdir(in_dir);

	if not os.path.exists(out_dir):
		os.makedirs(out_dir);

	for file in files:
		img = cv.imread(in_dir +'/'+ file, cv.IMREAD_COLOR);
		img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY);
		img_gray = cv.equalizeHist(img_gray);
		faces = detect_faces(img_gray);

		if len(faces) <= 0 or len(faces) > 1:
			continue;
		
		img_gray = crop_face(img_gray, faces[0], 0);
		cv.imwrite(out_dir + '/cropped_'+ file, img_gray);

@staticmethod
def get_users():
	return {
		'user1': 0,
		'user2': 1,
		'user3': 2,
	}

@staticmethod
def get_user_id(username):
	users = get_users();
	return users[username];

@staticmethod
def capture_images(user):
	i = 0;
	path = user + '_capture';
	camera = cv.VideoCapture(0);

	if not os.path.exists(path):
		os.makedirs(path);

	while True:
		ret, frame = camera.read()
		gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY);
		gray = cv.equalizeHist(gray);
		faces = detect_faces(gray);

		if len(faces) <= 0 or len(faces) > 1:
			continue;

		face = faces[0];
		x = face.left();
		y = face.top();
		x2 = face.right();
		y2 = face.bottom();

		cv.imwrite(f'{path}/{i}.jpg', frame);

		i += 1

		cv.rectangle(frame, (x, y), (x2,y2), (0, 255, 0), 2);
		cv.putText(frame, f'progress: %{i}', (x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2);
		cv.imshow('Capture Faces', frame);

		if i >= 100 or cv.waitKey(1) & 0xFF == ord('q'):
			break
		
	camera.release()
	cv.destroyAllWindows()

@staticmethod
def train_recognizer(user_id, face_dir):
	faces = [];
	labels = [];

	files = os.listdir(face_dir);
	
	for file in files:
		img_path = os.path.join(face_dir, file);
		img = cv.imread(img_path, cv.IMREAD_UNCHANGED);
		faces.append(img);
		labels.append(user_id);

	recognizer = cv.face.LBPHFaceRecognizer_create();
	recognizer.train(faces, np.array(labels));
	recognizer.save(f'{user_id}_face_recognition_model.xml');
	return recognizer;

@staticmethod
def run_recognizer(recognizer):
	cap = cv.VideoCapture(0);

	label_name = {value: key for key, value in get_users().items()};
	while True:
		ret, frame = cap.read();
		img = cv.cvtColor(frame, cv.COLOR_BGR2GRAY);
		img = cv.equalizeHist(img);
		faces = detect_faces(img);
		
		if len(faces) <= 0 or len(faces) > 1:
			continue;

		face = faces[0];
		
		x = face.left();
		y = face.top();
		x2 = face.right();
		y2 = face.bottom();
		img = crop_face(img, face, 0);

		label, confidence = recognizer.predict(img);
		p = round(confidence);

		cv.rectangle(frame, (x, y), (x2,y2), (0, 255, 0), 2);

		detected_person = f'unknown - {p}';
		if p > 50:
			detected_person = f'{label_name[label]} - {p}';
		
		cv.putText(frame, detected_person, (x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2);
		cv.imshow('Recognize Faces', frame);

		if cv.waitKey(1) & 0xFF == ord('q'):
			break
	cap.release()
	cv.destroyAllWindows()

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
			user_name,
			create_date DEFALT CURRENT_TIMESTAMP NOT NULL)''');

	if(not 'recognizors' in db_list):
		db_cursor.execute('''
			CREATE TABLE recognizors
			(face_data_id integer auto_increment primary key,
			user_id integer,
			face_recognizor_xml,
			create_date DEFALT CURRENT_TIMESTAMP)''');

	if(not 'user_passkeys' in db_list):
		db_cursor.execute('''
		CREATE TABLE user_passkeys
		(credential_id integer auto_increment primary key,
		user_id integer,
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
def add_user(username):
	if(username is None):
		raise ValueError('The get_user function expects a username argument')
	
	db_connection = sql.connect(db_name);
	db_cursor = db_connection.cursor();
	now = time.strftime('%Y-%m-%d %H:%M:%S');

	query = db_cursor.execute('INSERT INTO users (user_name, create_date) VALUES(?, ?)', (username, now));
	db_connection.commit();

	result = get_user(username);
	
	db_cursor.close();
	db_connection.close();

	return result;