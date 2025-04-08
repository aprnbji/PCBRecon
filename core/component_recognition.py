import cv2
import google.generativeai as genai
from PIL import Image
import numpy as np

def preprocess_image(image):
    """Convert PIL Image to CV2 format and preprocess for component detection"""
    if isinstance(image, Image.Image):
        image_np = np.array(image)
        image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    else:
        image_cv = image
    
    gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 100, 200)
    
    return edges

def detect_components(image):
    """Detect components in a PCB image using Gemini Vision API"""
    if not isinstance(image, Image.Image):
        if len(image.shape) == 2: 
            pil_image = Image.fromarray(image)
        else:
            pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    else:
        pil_image = image
    
    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content(["Identify and list all hardware components on this PCB.", pil_image])
    return response.text

def load_image(image_path):
    """Load an image from a file path"""
    image = Image.open(image_path)
    return image
