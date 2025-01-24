from dependancies import *

def annotate_image(image, components):
    draw = ImageDraw.Draw(image)
    for component in components.split('\n'):
        if component.strip():
            bbox = (50, 50, 150, 150)  
            draw.rectangle(bbox, outline="red")
            draw.text((bbox[0], bbox[1] - 10), component.strip(), fill="red")
    return image

def display_image(image):
    plt.imshow(image)
    plt.axis("off")  
    plt.show()

def save_annotated_image(image, output_path="annotated_image.jpg"):
    image.save(output_path)
    logging.info(f"Annotated image saved to {output_path}")

def generate_report(image, components, microcontroller, security_analysis):
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
    return report