import os;
import cv2 as cv;
import dlib;

crop_pad = 20;

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
def crop_faces(img, faces):
	for face in faces:
		x = face.left();
		y = face.top();
		x2 = face.right();
		y2 = face.bottom();

		crop_left = x - crop_pad;
		crop_top = y - crop_pad;
		crop_right = x2 + crop_pad;
		crop_bottom = y2 + crop_pad;

		img_face_cropped = img[crop_top:crop_bottom, crop_left:crop_right];
	return img_face_cropped;

@staticmethod
def convert_images_to_grayscale(in_dir, out_dir):
	files = os.listdir(in_dir);

	for file in files:
		img = cv.imread(in_dir +'/'+ file, cv.IMREAD_COLOR);
		img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY);
		img_gray = cv.equalizeHist(img_gray);
		faces = detect_faces(img_gray);

		img_gray = crop_faces(img_gray, faces);
		cv.imwrite(out_dir + '/cropped_'+ file, img_gray);

#@staticmethod
#def create_local_binary_pattern(img):