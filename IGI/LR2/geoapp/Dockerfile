FROM python:3.11

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/smartiqaorg/geometric_lib

COPY script.py .

CMD ["python", "script.py"]