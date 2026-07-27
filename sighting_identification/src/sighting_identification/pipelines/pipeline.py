import logging

from sighting_identification.models.detection import get_cropped_image
from sighting_identification.models.identification import get_species
from sighting_identification.models.reidentification import generate_embedding, get_individual_similarity
from sighting_identification.db.s3 import get_sighting_image
from sighting_identification.db.postgres import get_species_embeddings, update_sighting_as_unrecognized, \
    update_sighting_as_failed, update_sighting_as_processing, update_sighting_set_individual

logger = logging.getLogger(__name__)

def start(sighting_id, image_path):
    try:
        update_sighting_as_processing(sighting_id)
        image = get_sighting_image(image_path)
        logger.info("Image found for sighting %s with path %s", sighting_id, image_path)
        cropped_image, category = get_cropped_image(image)
        species, confidence = get_species(cropped_image, category) # TODO: Set a treshold
        return
        species_embeddings = get_species_embeddings(species)
        embedding = generate_embedding(species, cropped_image)
        individual_similarities = get_individual_similarity(embedding, species_embeddings)
        if individual_similarities: # TODO: Set a treshold
            update_sighting_set_individual(sighting_id, individual_similarities[0]['id'])

        else:
            update_sighting_as_unrecognized(sighting_id)

    except Exception as e:
        update_sighting_as_failed(sighting_id)
        raise e