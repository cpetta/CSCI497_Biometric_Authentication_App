import cv2 as cv;
import dlib;

crop_pad = 20;
detector = dlib.get_frontal_face_detector();

img = cv.imread('test_images/test2.jpg', cv.IMREAD_COLOR);

img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY);
img_gray = cv.equalizeHist(img_gray);
faces = detector(img_gray);

## -----------------------------
## Original Images
## -----------------------------
for face in faces:
	x = face.left();
	y = face.top();
	x2 = face.right();
	y2 = face.bottom();
	cv.rectangle(img, (x, y), (x2,y2), (0, 255, 0), 2);
	cv.imshow('Face Detection', img);
cv.waitKey(0);

## -----------------------------
## Cropped faces
## -----------------------------
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
	cv.imshow('Face Detection', img_face_cropped);
cv.waitKey(0);