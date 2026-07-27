import logging

import boto3

from sighting_identification.configuration import configuration

logger = logging.getLogger(__name__)

s3 = boto3.client(
    's3',
    endpoint_url=f"{configuration.S3_SCHEMA}://{configuration.S3_HOST}:{configuration.S3_PORT}",
    aws_access_key_id=configuration.S3_USER,
    aws_secret_access_key=configuration.S3_PASSWORD,
    region_name='us-east-1'
)

def get_sighting_image(image_path):
    try:
        response = s3.get_object(Bucket=configuration.S3_BUCKET, Key=image_path)

    except Exception as e:
        logger.error("Failed to retrieve the image %s with error: %s", image_path, e, exc_info=True)
        raise e

    return response["Body"].read()