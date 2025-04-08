import logging
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import cv2

def annotate_image(image, components):
    """Annotate the image with detected components"""
    if isinstance(image, np.ndarray):
        image_pil = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    else:
        image_pil = image.copy()
    
    draw = ImageDraw.Draw(image_pil)
    try:
        font = ImageFont.truetype("arial.ttf", 12)
    except IOError:
        font = ImageFont.load_default()
    
    y_pos = 20
    for component in components.split('\n'):
        if component.strip():
           draw.text((10, y_pos), component.strip(), fill="red", font=font)
            y_pos += 15
    
    return image_pil

def display_image(image):
    """Display an image using matplotlib"""
    plt.figure(figsize=(10, 8))
    plt.imshow(image)
    plt.axis("off")
    plt.show()

def save_annotated_image(image, output_path="annotated_image.jpg"):
    """Save the annotated image to file"""
    image.save(output_path)
    logging.info(f"Annotated image saved to {output_path}")

def generate_report(image, components, microcontroller, security_analysis):
    """Generate a comprehensive report with annotated images and analysis"""
    annotated_image = annotate_image(image, components)
    display_image(annotated_image)
    save_annotated_image(annotated_image)
    
    report = f"""
    PCB Analysis Report:
    --------------------
    1. Detected Components:
    {components}
    
    2. Identified Microcontroller:
    {microcontroller}
    
    3. Security Analysis:
    {security_analysis}
    """
    
    # Save report to file
    with open("pcb_security_report.txt", "w") as f:
        f.write(report)
    
    return report
