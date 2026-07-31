import logging
import warnings
import importlib
import cv2

import torch
import open_clip
from transformers import AutoModelForImageClassification
import numpy as np
from huggingface_hub import hf_hub_download

warnings.filterwarnings("ignore", message=".*copying from a non-meta parameter.*")
logger = logging.getLogger(__name__)

CETACEAN_MODEL_CATEGORIES = ['marine mammal']
BIOCLIP_MODEL_CATEGORIES = ['fish', 'mammal', 'bird', 'reptile', 'amphibians', 'insect']

mammal_species = [
    "deer", "bear", "wolf", "fox", "rabbit", "squirrel", "elk", "moose",
    "cougar", "bobcat", "lynx", "coyote", "beaver", "otter", "raccoon",
    "badger", "porcupine", "bison", "sheep", "goat", "hyena", "horse",
    "wild boar", "jaguar", "leopard", "tiger", "lion", "elephant",
    "giraffe", "zebra", "hippopotamus", "rhinoceros", "ape", "monkey",
    "gorilla", "chimpanzee", "orangutan", "wild dog", "snow leopard", "rhesus monkey",
    "nyala", "macaque", "lynx pardinus", "japanese monkey", "eurasian lynx", "dog",
    "cheetah", "capuchin", "amur tiger", "chimp", "lemur"
]
bird_species = [
    "eagle", "hawk", "falcon", "owl", "heron", "crane", "pelican",
    "seagull", "penguin", "flamingo", "hummingbird", "vulture",
    "stork", "kingfisher", "albatross", "toucan", "duck", "goose",
    "swan", "crow", "raven", "woodpecker"
]
reptile_species = [
    "snake", "lizard", "turtle", "tortoise", "crocodile", "alligator",
    "frog", "toad", "salamander", "iguana", "chameleon", "gecko", "loggerhead turtle", "hawksbill turtle",
    "green turtle", "fire salamander"
]
fish_species = [
    "shark", "ray", "sea turtle", "octopus", "squid", "crab", "lobster", "leopard shark"
    "seahorse", "swordfish", "barracuda", "white shark", "whale shark", "mobula birostris"
]
insect_species = ["butterfly", "dragonfly", "bee", "beetle", "grasshopper"]
fish_labels = [f"a {fish}" for fish in fish_species] + [f"the fin of a {fish}" for fish in fish_species] + [f"the fluke of a {fish}" for fish in fish_species]
mammal_labels = [f"the fur of a {animal}" for animal in mammal_species] + [f"the head of a {animal}" for animal in mammal_species] + \
    [f"the claw of a {animal}" for animal in mammal_species] + [f"a {animal}" for animal in mammal_species]
bird_labels = [f"a {bird}" for bird in bird_species] + [f"the beak a {bird}" for bird in bird_species] + [f"the wing a {bird}" for bird in bird_species]
reptile_labels = [f"a {reptile}" for reptile in reptile_species] + [f"the tail of a {reptile}" for reptile in reptile_species]
insect_labels = [f"a {insect}" for insect in insect_species] + [f"the leg of a {insect}" for insect in insect_species] + [f"the wing of a {insect}" for insect in insect_species]

_bioclip_model = None
_bioclip_preprocess = None
_bioclip_tokenizer = None
_category_text_features = {}

_cetacean_model = None


def _get_bioclip():
    global _bioclip_model, _bioclip_preprocess, _bioclip_tokenizer
    if _bioclip_model is None:
        logger.info("Loading BioCLIP model...")
        _bioclip_model, _, _bioclip_preprocess = open_clip.create_model_and_transforms('hf-hub:imageomics/bioclip-2')
        _bioclip_model.eval()
        _bioclip_tokenizer = open_clip.get_tokenizer('hf-hub:imageomics/bioclip-2')

        all_categories = {
            "fish": fish_labels,
            "mammal": mammal_labels, "bird": bird_labels,
            "reptile": reptile_labels, "amphibians": reptile_labels,
            "insect": insect_labels,
        }
        with torch.no_grad():
            for cat, cat_labels in all_categories.items():
                tokens = _bioclip_tokenizer([f"a photo of {label}" for label in cat_labels])
                text_features = _bioclip_model.encode_text(tokens)
                text_features /= text_features.norm(dim=-1, keepdim=True)
                _category_text_features[cat] = text_features
        logger.info("BioCLIP model loaded with %d categories", len(_category_text_features))
    return _bioclip_model, _bioclip_preprocess

def _get_cetacean():
    global _cetacean_model
    if not _cetacean_model:
        logger.info("Loading cetacean classifier...")
        wrapper = AutoModelForImageClassification.from_pretrained(
            "Saving-Willy/cetacean-classifier", trust_remote_code=True
        ).eval()
        ckpt_path = hf_hub_download("Saving-Willy/cetacean-classifier", "last.ckpt")
        checkpoint = torch.load(ckpt_path, map_location="cpu")
        sd = checkpoint["state_dict"]
        corrected_sd = {f"model.{k}": v for k, v in sd.items()}
        wrapper.load_state_dict(corrected_sd, strict=False)
        wrapper.eval()

        _cetacean_model = wrapper
        logger.info("Cetacean classifier loaded successfully")

    return _cetacean_model

def _use_cetacean(image, _):
    model = _get_cetacean()
    mod = importlib.import_module(type(model).__module__)
    whale_classes = mod.WHALE_CLASSES
    bgr = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    tensor = model.preprocess_image(bgr)
    tensor_flip = torch.flip(tensor, [3])
    with torch.no_grad():
        _, logits = model.model(tensor)
        _, logits_flip = model.model(tensor_flip)
    logits = (logits + logits_flip) / 2
    probs = torch.softmax(logits, dim=-1)
    top_idx = probs.argmax().item()
    confidence = probs[0][top_idx].item()
    label = whale_classes[top_idx]
    return label, confidence

def _use_bioclip(image, category):
    model, preprocess = _get_bioclip()
    if category not in _category_text_features:
        logger.warning("Unknown category '%s', cannot identify species", category)
        return None, 0.0

    text_features = _category_text_features[category]

    image = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        image_features = model.encode_image(image)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)

    label = torch.argmax(text_probs)
    confidence = text_probs[0][label].item()

    if category == "fish":
        species = fish_species[label // 3]
    elif category == "mammal":
        species = mammal_species[label // 4]
    elif category == "bird":
        species = bird_species[label // 3]
    elif category in ["reptile", "amphibians"]:
        species = reptile_species[label // 2]
    elif category == "insect":
        species = insect_species[label // 3]

    return species, confidence

def get_species(image, category):
    if category is None:
        logger.warning("No detection category, cannot identify species")
        return None, 0.0

    if category in CETACEAN_MODEL_CATEGORIES:
        species, confidence = _use_cetacean(image, category)

    elif category in BIOCLIP_MODEL_CATEGORIES:
        species, confidence = _use_bioclip(image, category)

    else:
        logger.warning("No valid detection category, cannot identify species: %s", category)
        return None, 0.0

    logger.info("Species found: %s with confidence %s", species, confidence)
    return species, confidence
