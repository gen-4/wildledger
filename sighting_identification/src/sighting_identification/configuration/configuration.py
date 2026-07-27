import os
import sys
import logging

REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
ENVIRONMENT = os.getenv('SPRING_PROFILES_ACTIVE', 'dev')

S3_USER = os.getenv('MINIO_USER')
S3_SCHEMA = os.getenv('MINIO_SCHEMA')
S3_PASSWORD = os.getenv('MINIO_PASSWORD')
S3_HOST = os.getenv('MINIO_HOST')
S3_PORT = os.getenv('MINIO_PORT')
S3_BUCKET = 'sightings'

POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'localhost')

def configure_logging():
    root = logging.getLogger()
    fmt = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    root.handlers.clear()

    if ENVIRONMENT == 'dev':
        root.setLevel(logging.DEBUG)
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(fmt)
        root.addHandler(handler)

    elif ENVIRONMENT == 'prod':
        root.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        handler.setFormatter(fmt)
        root.addHandler(handler)
        handler = logging.FileHandler("/var/log/wildledger/sighting_identification.log")
        handler.setFormatter(fmt)
        root.addHandler(handler)