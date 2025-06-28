import os;
import cv2 as cv;
import dlib;
import functions as fn;

user = 'user1';
user_id = fn.get_user_id(user);

fn.capture_images(user);
fn.convert_images_to_grayscale(f'{user}_capture', f'{user}_training');
recognizer = fn.train_recognizer(user_id, f'{user}_training');
fn.run_recognizer(recognizer);