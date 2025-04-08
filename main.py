import sys
import logging
import google.generativeai as genai
import matplotlib.pyplot as plt
from tkinter import Tk, filedialog
import numpy as np

from component_recognition import load_image, preprocess_image, detect_components
from debugging_interface import detect_debugging_interfaces
from ml_analysis import ml_analysis
from report import generate_report
from hardware_security_assessment import hardware_security_assessment, identify_microcontroller

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("analysis.log"),
        logging.StreamHandler()
    ]
)

def upload_image_local():
    """Open a file dialog to select an image"""
    root = Tk()
    root.withdraw() 
    image_path = filedialog.askopenfilename(
        title="Select an image",
        filetypes=[("Image files", "*.jpg *.jpeg *.png")]
    )
    return image_path

def main():
    try:
        GEMINI_API_KEY = "api_key"  # Replace with your API key
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        logging.error(f"Error configuring Gemini API: {e}")
        return

    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        logging.info(f"Using image from command-line argument: {image_path}")
    else:
        logging.info("Please select an image of the microcontroller:")
        image_path = upload_image_local()
        if not image_path:
            logging.error("No image selected. Exiting.")
            return

    try:
        image = load_image(image_path)
        processed_image = preprocess_image(image)
        
        components = detect_components(processed_image)
        logging.info(f"Detected Components:\n{components}")
        
        debugging_interfaces = detect_debugging_interfaces(processed_image)
        logging.info(f"Detected Debugging Interfaces: {len(debugging_interfaces)}")
        
        segmented_image, cleaned_image, overlay = ml_analysis(np.array(image))
        logging.info("Machine learning-powered analysis completed.")
        
        plt.figure(figsize=(15, 5))
        plt.subplot(1, 3, 1)
        plt.imshow(cv2.cvtColor(segmented_image, cv2.COLOR_BGR2RGB))
        plt.title("Segmented Image")
        plt.axis("off")
        
        plt.subplot(1, 3, 2)
        plt.imshow(cleaned_image, cmap="gray")
        plt.title("Cleaned Binary Image")
        plt.axis("off")
        
        plt.subplot(1, 3, 3)
        plt.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
        plt.title("Overlay on Original Image")
        plt.axis("off")
        plt.show()
        
        microcontroller = identify_microcontroller(components)
        logging.info(f"Identified Microcontroller:\n{microcontroller}")
        
        security_analysis = hardware_security_assessment(components)
        logging.info(f"Hardware Security Assessment:\n{security_analysis}")
        
        report = generate_report(image, components, microcontroller, security_analysis)
        logging.info("Report generated successfully")
        
    except Exception as e:
        logging.error(f"Error generating report: {e}")
        import traceback
        logging.error(traceback.format_exc())

if __name__ == "__main__":
    main()
