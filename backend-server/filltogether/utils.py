import tempfile
import cv2


def load_img(f):
    path = tempfile.NamedTemporaryFile(suffix='.png').name
    with open(path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

    return cv2.imread(path)
