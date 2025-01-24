from dependancies import *

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("analysis.log"),
        logging.StreamHandler()
    ]
)

def upload_image_local():
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
        logging.info(f"Detected Debugging Interfaces: {debugging_interfaces}")

        segmented_image, cleaned_image, overlay = ml_analysis(image)
        logging.info("Machine learning-powered analysis completed.")

        plt.figure(figsize=(15, 5))

        plt.subplot(1, 3, 1)
        plt.imshow(segmented_image)
        plt.title("Segmented Image")
        plt.axis("off")

        plt.subplot(1, 3, 2)
        plt.imshow(cleaned_image, cmap="gray")
        plt.title("Cleaned Binary Image")
        plt.axis("off")

        plt.subplot(1, 3, 3)
        plt.imshow(overlay)
        plt.title("Overlay on Original Image")
        plt.axis("off")

        plt.show()

        # Microcontroller Identification
        microcontroller = identify_microcontroller(components)
        logging.info(f"Identified Microcontroller:\n{microcontroller}")

        # Hardware Security Assessment
        security_analysis = hardware_security_assessment(components)
        logging.info(f"Hardware Security Assessment:\n{security_analysis}")

        # Save Report
        report = generate_report(image, components, microcontroller, security_analysis)
        logging.info(report)

    except Exception as e:
        logging.error(f"Error generating report: {e}")

if __name__ == "__main__":
    main()