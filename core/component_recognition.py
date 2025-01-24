import cv2
import google.generativeai as genai

def detect_components(image):
    edges = cv2.Canny(image, 100, 200)
    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content(["Identify and list all hardware components on this PCB.", edges])
    return response.text