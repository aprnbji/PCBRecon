# PCBRecon

## Overview
PCBRecon is a hardware analysis tool for embedded security auditing that utilizes machine learning and image recognition to identify PCB components and potential debugging interfaces.

## Key Features
- Component recognition
- Debugging interface detection
- Machine learning-powered analysis
- Hardware security assessment

## Purpose
Enhance embedded device security audits by providing comprehensive hardware-level insights through automated PCB component identification and interface mapping.

## Setup 

### Clone repository

```bash
git clone https://github.com/aprnbji/PCBRecon.git

cd PCBRecon
```

### Configure Environment Variables

```bash
# Create an environment file
nano .env

# Add API key to this file
GEMINI_API_KEY="your api key"

# Add Database URL to this file
DATABASE_URL = sqlite:///./pcbrecon.db # what i have used
```

### Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/conf.d/pcbrecon.conf
```

pcbrecon.conf
```bash
upstream backend {
    server 127.0.0.1:8000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name localhost;  
    
    client_max_body_size 10M;

    access_log /var/log/nginx/pcbrecon_access.log;
    error_log /var/log/nginx/pcbrecon_error.log;

    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /metrics {
        proxy_pass http://backend/metrics;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        proxy_pass http://backend/health;
        proxy_set_header Host $host;
        access_log off;
    }

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_buffering off;
    }

    location /_next/ {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Test nginx configuratiopn and reload the service

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Set up Ansible

### Create Ansible Directory Structure

```bash
mkdir -p ansible/{group_vars,roles,playbooks,inventory}
cd ansible
```


### Create a Vault Secrets File

```bash
ansible-vault create secrets.yml
```

You’ll be prompted to set a vault password. Inside the file, add your secrets:

```yaml
vault_gemini_api_key: "your-gemini-api-key"
```

* To **edit later**:

  ```bash
  ansible-vault edit secrets.yml
  ```
* To **view (read-only)**:

  ```bash
  ansible-vault view secrets.yml
  ```

### Define Inventory

Create `inventory/hosts.yml` and configure your server:

```yaml
all:
  hosts:
    pcbrecon-server:
      ansible_host: <your_server_ip>
      ansible_user: <remote_username>
```

* `ansible_host`: Public/Private IP of your server
* `ansible_user`: The remote SSH user 

If using SSH keys, make sure the public key is installed on the server.

### Run the Application

```bash
cd ansible
ansible-playbook playbooks/deploy.yml --ask-vault-pass
```

* `--ask-vault-pass`: Prompts for the vault password to decrypt secrets.
* If using **vault password file**:

  ```bash
  ansible-playbook playbooks/deploy.yml --vault-password-file ~/.vault_pass.txt
  ```


  This project is work in progress. The remaining components will be added soon.




