import google.generativeai as genai

def hardware_security_assessment(components):
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"""
    Perform a detailed hardware security assessment for the following components:
    {components}
    Include analysis of:
    - Exposed debugging interfaces
    - Insecure communication protocols
    - Potential attack vectors
    - Recommendations for securing the hardware
    """
    response = model.generate_content(prompt)
    return response.text

def identify_microcontroller(components):
    """Identify the microcontroller from detected components"""
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"""
    From the following list of PCB components, identify the microcontroller(s) or processors.
    For each microcontroller, provide:
    - Name and model
    - Common security vulnerabilities
    - Standard security features
    
    Components:
    {components}
    """
    response = model.generate_content(prompt)
    return response.text
