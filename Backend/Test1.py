import sys
import os
import numpy as np
import cv2
import math
import pytesseract
from PIL import Image

def midpoint(x1, y1, x2, y2):
    x_mid = int((x1 + x2) / 2)
    y_mid = int((y1 + y2) / 2)
    return x_mid, y_mid

def inpaint_text(filepath):
    img = cv2.imread(filepath)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Perform OCR using Tesseract
    custom_config = r'--oem 3 --psm 6'  # Tesseract configuration for page segmentation mode
    result = pytesseract.image_to_data(gray, output_type=pytesseract.Output.DICT, config=custom_config)

    mask = np.zeros(gray.shape, dtype="uint8")
    for i in range(len(result["text"])):
        x, y, w, h = result["left"][i], result["top"][i], result["width"][i], result["height"][i]
        x_mid0, y_mid0 = midpoint(x, y, x + w, y)
        x_mid1, y_mid1 = midpoint(x, y, x, y + h)
        thickness = int(math.sqrt(w**2 + h**2))
        cv2.line(mask, (x_mid0, y_mid0), (x_mid1, y_mid1), 255, thickness)

    # Inpaint the text regions in the image
    inpainted_img = cv2.inpaint(img, mask, 7, cv2.INPAINT_NS)
    image_pil = Image.fromarray(cv2.cvtColor(inpainted_img, cv2.COLOR_BGR2RGB))

    return image_pil, filepath

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

    inpaint_image, output_filepath = inpaint_text(input_image_path)
    inpaint_image.save(output_filepath)

    print("Blank image after inpainting is saved at:", output_filepath)

if __name__ == "__main__":
    main()
