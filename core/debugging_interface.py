import cv2

def detect_debugging_interfaces(image):
    """Detect potential debugging interfaces on a PCB image"""
    if len(image.shape) > 2: 
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    
    edges = cv2.Canny(gray, 100, 200)
    contours, hierarchy = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    debugging_interfaces = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = float(w) / h
        if 0.8 < aspect_ratio < 1.2 and w > 20 and h > 20:  
            debugging_interfaces.append((x, y, w, h))
    
    return debugging_interfaces
