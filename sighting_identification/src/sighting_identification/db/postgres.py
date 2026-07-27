import psycopg2
from sighting_identification.configuration import configuration

def _get_connection():
    return psycopg2.connect(
        dbname=configuration.POSTGRES_DB,
        user=configuration.POSTGRES_USER,
        password=configuration.POSTGRES_PASSWORD,
        host=configuration.POSTGRES_HOST
    )

def get_species_embeddings(species):
    with _get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, name, embedding
                FROM individual
                WHERE species = %s;
            """, (species,))
            return cursor.fetchall()

def _update_sighting_status(sighting_id, status):
    with _get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE sighting
                SET status = %s
                WHERE id = %s;
            """, (status, sighting_id))

def update_sighting_as_failed(sighting_id):
    _update_sighting_status(sighting_id, 'FAILED')

def update_sighting_as_processing(sighting_id):
    _update_sighting_status(sighting_id, 'PROCESSING')

def update_sighting_as_unrecognized(sighting_id):
    _update_sighting_status(sighting_id, 'UNRECOGNIZED')

def update_sighting_set_individual(sighting_id, individual_id):
    with _get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE sighting
                SET status = 'PROCESSED',
                individual_id = %s
                WHERE id = %s;
            """, (individual_id, sighting_id))