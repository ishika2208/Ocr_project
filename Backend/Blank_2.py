# Usage: python Blank.py <input_image_path> <source_language> <output_image_path>
import sys
import os
from PIL import Image
import numpy as np
import cv2
import math
import pytesseract

def midpoint(x1, y1, x2, y2):
    x_mid = int((x1 + x2) / 2)
    y_mid = int((y1 + y2) / 2)
    return x_mid, y_mid

def inpaint_text(filepath):
    img = cv2.imread(filepath)
    mask = np.zeros(img.shape[:2], dtype="uint8")

    # Perform OCR using Tesseract OCR
    custom_config = r'--oem 3 --psm 6'  # Use page segmentation mode 6 (Assume a single uniform block of text)
    text = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT, config=custom_config)

    for i in range(len(text['text'])):
        if text['conf'][i] > 0:  # Only consider confident detections
            x, y, w, h = text['left'][i], text['top'][i], text['width'][i], text['height'][i]
            x_mid0, y_mid0 = midpoint(x, y, x+w, y)
            x_mid1, y_mid1 = midpoint(x, y+h, x+w, y+h)
            thickness = int(math.sqrt(w ** 2 + h ** 2))
            cv2.line(mask, (x_mid0, y_mid0), (x_mid1, y_mid1), 255, thickness)

    # Inpaint the text regions in the image
    inpainted_img = cv2.inpaint(img, mask, 7, cv2.INPAINT_NS)

    # Save the inpainted image
    inpaint_image_path = "inpaint_image.jpg"
    cv2.imwrite(inpaint_image_path, inpainted_img)

    return inpaint_image_path

def main():
    if len(sys.argv) != 4:
        print("Usage: python Blank.py <input_image_path> <source_language> <output_image_path>")
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
