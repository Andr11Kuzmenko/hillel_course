"""
This module provides functionality for interacting with a Cassandra database.
"""

import json
import uuid
from datetime import datetime, timedelta
from uuid import uuid4

from cassandra.cluster import Cluster, Session  # type: ignore


def create_keyspace(session_: Session) -> None:
    """
    Creates a keyspace in Cassandra if it does not already exist.
    :param session_: A Cassandra 'Session' object used to execute the CQL query.
    """
    session_.execute(
        """
            CREATE KEYSPACE IF NOT EXISTS hw_cassandra 
            WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };
        """
    )


def create_table(session_: Session) -> None:
    """
    Creates a table in Cassandra if it does not already exist.
    :param session_: A Cassandra 'Session' object used to execute the CQL query.
    """
    session_.execute(
        """
            CREATE TABLE IF NOT EXISTS logs(
                event_id UUID PRIMARY KEY,
                user_id UUID,
                event_type TEXT,
                timestamp TIMESTAMP,
                metadata TEXT
            );
        """
    )


def add_log(session_: Session, user_id_: uuid, event_type: str, metadata: dict) -> None:  # type: ignore
    """
    Inserts a new log entry into the 'logs' table in Cassandra.
    :param session_: A Cassandra 'Session' object used to execute the CQL query.
    :param user_id_: The unique identifier of the user associated with the event.
    :param event_type: The type of the event.
    :param metadata: Additional data related to the event.
    """
    session_.execute(
        """
            INSERT INTO logs(event_id, user_id, event_type, timestamp, metadata)
            VALUES (%(event_id)s, %(user_id)s, %(event_type)s, %(timestamp)s, %(metadata)s)
        """,
        {
            "event_id": uuid4(),
            "user_id": user_id_,
            "event_type": event_type,
            "timestamp": datetime.now(),
            "metadata": json.dumps(metadata),
        },
    )


def get_logs_by_type(session_: Session, log_type: str) -> list:
    """
    Retrieves log entries from the 'logs' table in Cassandra based on the
    event type and timestamp.
    :param session_: A Cassandra 'Session' object used to execute the CQL query.
    :param log_type: The type of the event.
    :return: A list of log entries that match the specified 'log_type'
                and are more recent than 1 day ago.
    """
    return session_.execute(
        """
            SELECT *
            FROM logs
            WHERE event_type = %(log_type)s
            AND timestamp > %(timestamp)s
            ALLOW FILTERING
        """,
        {"log_type": log_type, "timestamp": datetime.now() - timedelta(days=1)},
    ).current_rows


def delete_old_logs(session_: Session) -> None:
    """
    Deletes log entries from the 'logs' table in Cassandra that are older than 7 days.
    :param session_: A Cassandra 'Session' object used to execute the CQL query.
    """
    all_logs_to_remove = session_.execute(
        """
            SELECT event_id
            FROM logs
            WHERE timestamp < %(timestamp)s
            ALLOW FILTERING
        """,
        {"timestamp": datetime.now() - timedelta(days=7)},
    ).current_rows
    log_ids = [val[0] for val in all_logs_to_remove]
    if log_ids:
        for log_id in log_ids:
            session_.execute(
                """
                    DELETE FROM logs 
                    WHERE event_id = %(log_id)s 
                """,
                {
                    "log_id": log_id,
                },
            )


def update_log_metadata(session_: Session, log_id: uuid, metadata: dict) -> None:  # type: ignore
    """
    Updates the metadata of an existing log entry.
    :param session_: A Cassandra 'Session' object used to execute the CQL query.
    :param log_id: The unique identifier of the log entry
    :param metadata: A dictionary containing the new metadata to be updated for the log entry.
    """
    session_.execute(
        """
            UPDATE logs
            SET metadata = %(metadata)s
            WHERE event_id = %(log_id)s
        """,
        {"log_id": log_id, "metadata": json.dumps(metadata)},
    )


if __name__ == "__main__":
    user_id = uuid4()

    with Cluster(["127.0.0.1"], port=9042) as cluster:
        with cluster.connect() as session:
            create_keyspace(session)
            session.set_keyspace("hw_cassandra")
            create_table(session)
            add_log(session, user_id, "login", {"metadata": "test"})
            delete_old_logs(session)
            print(get_logs_by_type(session, "login"))
