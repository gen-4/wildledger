from sighting_identification.consumer.sighting_created_consumer import consume_sighting_creation
from sighting_identification.configuration.configuration import configure_logging

if __name__ == '__main__':
    configure_logging()
    consume_sighting_creation()