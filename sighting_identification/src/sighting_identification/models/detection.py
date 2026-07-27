import io
import logging

from ultralytics import YOLO
from PIL import Image

logger = logging.getLogger(__name__)

_yolo_model = None


def _get_yolo():
    global _yolo_model
    if _yolo_model is None:
        logger.info("Loading YOLO model...")
        _yolo_model = YOLO("yolov8s-worldv2.pt")
        _yolo_model.set_classes([
            "marine mammal",
            "mammal",
            "bird",
            "reptile",
            "amphibians",
            "fish",
            "insect"
        ])
        logger.info("YOLO model loaded")
    return _yolo_model


def get_cropped_image(image_bytes):
    model = _get_yolo()

    try:
        img = Image.open(io.BytesIO(image_bytes))

    except Exception as e:
        logger.error("Unable to read image with error: %s", e, exc_info=True)
        raise e

    results = model(img, device="cpu", conf=0.5)

    best_box = None
    best_conf = -1
    for box in results[0].boxes:
        conf = box.conf[0].item()
        if conf > best_conf:
            best_conf = conf
            best_box = box

    if best_box is None:
        logger.warning("No animals detected in image for sighting")
        return img, None

    best_class = results[0].names[int(best_box.cls[0].item())]
    x1, y1, x2, y2 = best_box.xyxy[0].tolist()
    logger.info("Cropped image of class %s with confidence: %s", best_class, best_conf)
    return img.crop((x1, y1, x2, y2)), best_class
