import redis
import logging

from redis.maint_notifications import MaintNotificationsConfig

from sighting_identification.configuration import configuration
from sighting_identification.pipelines.pipeline import start

r = redis.Redis(
    host=configuration.REDIS_HOST, 
    port=configuration.REDIS_PORT, 
    password=configuration.REDIS_PASSWORD,
    decode_responses=True,
    maint_notifications_config=MaintNotificationsConfig(enabled=False),
    protocol=2,
    socket_timeout=10
)

logger = logging.getLogger(__name__)

def consume_sighting_creation():
    logger.info("Starting consumer")
    while True:
        messages = r.xreadgroup(
            groupname="sighting-group",
            consumername="sighting-consumer-1",
            streams={"sighting:creation": ">"},
            count=1,
            block=5000
        )
        for _, entries in messages:
            for msg_id, data in entries:
                try:
                    sighting_id = data['id']
                    logger.info("Consumer sighting-consumer-1 received message %s with message: %s", sighting_id, data)
                    start(sighting_id, data['image_path'])
                    r.xack("sighting:creation", "sighting-group", msg_id)
                
                except Exception as e:
                    logger.error("Consumer sighting-consumer-1 failed with error: %s", e, exc_info=True)
