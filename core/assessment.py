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