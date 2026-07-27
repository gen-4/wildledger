import logging
import warnings

import timm
import torchvision.transforms as T
import torch
import torch.nn.functional as F
from transformers import AutoModel

logger = logging.getLogger(__name__)

miewid_species = [
    "amur tiger", "beluga", "blue whale", "bottlenose dolphin", "brydes whale", "capuchin",
    "cheetah", "chimpanzee", "commersons dolphin", "cuviers beaked whale", "dog",
    "dusky dolphin", "eurasian lynx", "fin whale", "frasiers dolphin", "giraffe", "horse", "hyena",
    "hyperoodon ampullatus", "jaguar", "japanese monkey", "killer whale", "leopard", "lion",
    "long finned pilot whale", "lynx pardinus", "macaque", "melon headed whale", "nyala",
    "pantropic spotted dolphin", "pygmy killer whale", "rhesus monkey", "rough toothed dolphin", "seal",
    "sei whale", "short fin pilot whale", "short finned pilot whale", "snow leopard", "spinner dolphin",
    "spotted dolphin", "green turtle", "hawksbill turtle", "loggerhead turtle", "grey whale",
    "humpback whale", "whales shark", "white shark", "white sided dolphin", "wild dog", "zebra",
    "dolphin", "turtle", "whale", "monkey", "lynx", "tiger", "orca", "sperm whale", "chimp", "lemur",
    "leopard shark", "mobula birostris", "fire salamander", "seadragon"
]

_miewid_model = None
_megadescriptor_model = None

_miewid_preprocess = T.Compose([
    T.Resize((440, 440)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

_megadescriptor_preprocess = T.Compose([
    T.Resize((384, 384)),
    T.ToTensor(),
    T.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])


def _get_miewid():
    global _miewid_model
    if _miewid_model is None:
        logger.info("Loading MiewID model...")
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=UserWarning, module="torch")
            _miewid_model = AutoModel.from_pretrained(
                "conservationxlabs/miewid-msv3", trust_remote_code=True
            ).eval()

        logger.info("MiewID model loaded")

    return _miewid_model


def _get_megadescriptor():
    global _megadescriptor_model
    if _megadescriptor_model is None:
        logger.info("Loading MegaDescriptor model...")
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=UserWarning, module="torch")

            _megadescriptor_model = timm.create_model(
                "hf-hub:BVRA/MegaDescriptor-L-384", num_classes=0, pretrained=True
            ).eval()

        logger.info("MegaDescriptor model loaded")

    return _megadescriptor_model


def _generate_miewid_embedding(image):
    model = _get_miewid()
    tensor = _miewid_preprocess(image).unsqueeze(0)
    with torch.no_grad():
        embedding = model(tensor)
    return embedding


def _generate_megadescriptor_embedding(image):
    model = _get_megadescriptor()
    tensor = _megadescriptor_preprocess(image).unsqueeze(0)
    with torch.no_grad():
        embedding = model(tensor)
    return embedding


def generate_embedding(species, image):
    if species in miewid_species:
        logger.info("Using miewid model: %s", species)
        return _generate_miewid_embedding(image)

    logger.info("Fallback megadescriptor model: %s", species)
    return _generate_megadescriptor_embedding(image)


def get_individual_similarity(sighting_embedding, individual_embeddings):
    similarity_results = []
    for individual in individual_embeddings:
        similarity = F.cosine_similarity(sighting_embedding, individual[2]).item()
        similarity_results.append({
            'id': individual[0],
            'name': individual[1],
            'similarity': similarity
        })

    similarity_results.sort(key=lambda x: x['similarity'], reverse=True)
    logger.info("Top ten similarities: %s", similarity_results[:10])
    return similarity_results
