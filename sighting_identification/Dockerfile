FROM pytorch/pytorch:2.13.0-cuda12.6-cudnn9-runtime

RUN apt update && apt install -y libpq-dev libgl1 libglib2.0-0
RUN mkdir -p /var/log/wildledger
WORKDIR /app

COPY pyproject.toml /app/
COPY main.py /app/
COPY src /app/

RUN pip install .

CMD ["python", "main.py"]