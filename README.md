# PCBRecon

## Overview
PCBRecon is a hardware analysis tool for embedded security auditing, utilizing machine learning and image recognition to identify PCB components and potential debugging interfaces.

## Key Features
- Component recognition
- Debugging interface detection
- Machine learning-powered analysis
- Hardware security assessment

## Purpose
Enhance embedded device security audits by providing comprehensive hardware-level insights through automated PCB component identification and interface mapping.

## Setup 

### Clone repository

```
git clone https://github.com/aprnbji/PCBRecon.git

cd PCBRecon
```

### Set Up the Python Environment 

```
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt
```

### Configure Environment Variables

```
# Create an environment file
nano .env

# Add API key to this file
GEMINI_API_KEY="your api key"
```

### Configure Nginx Reverse Proxy

```
sudo nano /etc/nginx/conf.d/pcbrecon.conf
```

pcbrecon.conf
```
server {
    listen 80;
    server_name localhost;

    root /path/to/your/project;

    location /static {
        try_files $uri $uri/ =404;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Test nginx configuratiopn and reload the service

```
sudo nginx -t
sudo systemctl reload nginx
```

### Run the application

```
python3 main.py
```

Open your web browser and navigate to:

`http://localhost`

