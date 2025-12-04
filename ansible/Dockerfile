FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    openssh-client \
    git \
    rsync \
    sshpass \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    ansible==9.0.1 \
    docker \
    docker-compose

WORKDIR /ansible

COPY . .

ENTRYPOINT ["ansible-playbook"]
CMD ["--version"]