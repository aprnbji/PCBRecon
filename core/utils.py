from dependancies import *

def load_image(image_path):
    return Image.open(image_path)

def preprocess_image(image):
    image = image.resize((640, 480))
    image_np = np.array(image)
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    equalized = cv2.equalizeHist(blurred)
    return equalized