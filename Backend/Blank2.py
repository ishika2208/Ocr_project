import matplotlib.pyplot as plt
from PIL import Image
import keras_ocr
import cv2
import math
import numpy as np

def midpoint(x1, y1, x2, y2):
    x_mid = int((x1 + x2)/2)
    y_mid = int((y1 + y2)/2)
    return (x_mid, y_mid)


def inpaint_text(img_path, pipeline):
    # read image
    img = keras_ocr.tools.read(img_path)
    # generate (word, box) tuples 
    prediction_groups = pipeline.recognize([img])
    mask = np.zeros(img.shape[:2], dtype="uint8")
    for box in prediction_groups[0]:
        x0, y0 = box[1][0]
        x1, y1 = box[1][1] 
        x2, y2 = box[1][2]
        x3, y3 = box[1][3] 
        
        x_mid0, y_mid0 = midpoint(x1, y1, x2, y2)
        x_mid1, y_mi1 = midpoint(x0, y0, x3, y3)
        
        thickness = int(math.sqrt( (x2 - x1)**2 + (y2 - y1)**2 ))
        
        cv2.line(mask, (x_mid0, y_mid0), (x_mid1, y_mi1), 255,    
        thickness)
        img = cv2.inpaint(img, mask, 7, cv2.INPAINT_NS)
                 
    return(img)

pipeline = keras_ocr.pipeline.Pipeline()

image_path = "C:/Users/gparu/OneDrive/Desktop/testttt.jpg"
output_image = inpaint_text(image_path, pipeline)
        
orignal_image = cv2.imread(image_path)
cv2.imshow('Original image',orignal_image)

img_rgb = cv2.cvtColor(output_image, cv2.COLOR_BGR2RGB)
cv2.imshow('text_free_image', img_rgb)

#cv2.imshow('Output Image', output_image)

cv2.waitKey(0)
cv2.destroyAllWindows()
                 