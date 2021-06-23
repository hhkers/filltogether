import boto3
import cv2
import os
import tempfile
import string
import random

from django.conf import settings

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

def random_string(N):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))


def upload_to_s3(im, fname=None):
    if fname == None:
        fname = f'{random_string(10)}.png'

    suffix = os.path.splitext(fname)[-1]
    path = tempfile.NamedTemporaryFile(suffix=suffix).name 
    cv2.imwrite(path, im)

    s3_client.upload_file(
        path, 
        settings.AWS_STORAGE_BUCKET_NAME,
        fname,
        ExtraArgs={
            "ContentType": f'image/{suffix[1:]}'
        }
    )
    url = f'https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{fname}'
    return url, fname

def download_from_s3(fname):
    suffix = os.path.splitext(fname)[-1]
    path = tempfile.NamedTemporaryFile(suffix=suffix).name
    s3_client.download_file(settings.AWS_STORAGE_BUCKET_NAME, fname, path)
    #im = cv2.imread(path)
    return path
