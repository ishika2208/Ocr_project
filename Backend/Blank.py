#Usage: python Blank.py <input_image_path> <source_language> <output_image_path>
import sys
import os
from PIL import Image
import numpy as np
import cv2
import math
import pytesseract
import keras_ocr

def midpoint(x1, y1, x2, y2):
    x_mid = int((x1 + x2) / 2)
    y_mid = int((y1 + y2) / 2)
    return x_mid, y_mid

def inpaint_text(filepath):
    img = cv2.imread(filepath)
    mask = np.zeros(img.shape[:2], dtype="uint8")

    # Perform OCR using keras-ocr pipeline
    pipeline = keras_ocr.pipeline.Pipeline()
    prediction_groups = pipeline.recognize([img])
    for box in prediction_groups[0]:
        x0, y0 = box[1][0]
        x1, y1 = box[1][1]
        x2, y2 = box[1][2]
        x3, y3 = box[1][3]
        x_mid0, y_mid0 = midpoint(x1, y1, x2, y2)
        x_mid1, y_mid1 = midpoint(x0, y0, x3, y3)
        thickness = int(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2))
        cv2.line(mask, (x_mid0, y_mid0), (x_mid1, y_mid1), 255, thickness)

    # Inpaint the text regions in the image
    inpainted_img = cv2.inpaint(img, mask, 7, cv2.INPAINT_NS)

    # Save the inpainted image
    inpaint_image_path = "inpaint_image.jpg"
    cv2.imwrite(inpaint_image_path, inpainted_img)

    return inpaint_image_path

def main():
    if len(sys.argv) != 4:
        print("Usage: python inpaint_text.py <input_image_path> <source_language> <output_image_path>")
        sys.exit(1)

    input_image_path = sys.argv[1]
    source_language = sys.argv[2]
    output_image_path = sys.argv[3]

    if not os.path.isfile(input_image_path):
        print("Error: Input image not found.")
        sys.exit(1)

    inpaint_image = inpaint_text(input_image_path)
    print("Blank image after inpainting is saved at:", inpaint_image)

if __name__ == "__main__":
    main()
