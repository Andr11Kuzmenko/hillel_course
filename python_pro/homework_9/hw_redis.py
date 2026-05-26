"""
This module provides functions to manage user sessions in Redis.
"""

import json
import uuid
from datetime import datetime

import redis
from redis.client import Redis


def create_session(redis_client_: Redis, user_id_: str, session_token: str) -> None:
    """
    Creates a new session for a user in Redis and stores session data
    :param redis_client_: The Redis client used to interact with the Redis database.
    :param user_id_: The unique identifier for the user associated with the session.
    :param session_token: The token associated with the user session.
    """
    session_info = {
        "user_id": user_id_,
        "session_token": session_token,
        "login_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "last_activity_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    redis_client_.set(user_id_, json.dumps(session_info))
    redis_client_.expire(user_id_, 1800)


def get_active_session(redis_client_: Redis, user_id_: str) -> None | bytes:
    """
    Retrieves the active session for a given user from Redis.
    :param redis_client_: The Redis client used to interact with the Redis database.
    :param user_id_: The unique identifier for the user whose session data is to be retrieved.
    :return: The session data
    """
    return redis_client_.get(user_id_)


def update_last_activity(redis_client_: Redis, user_id_: str) -> None:
    """
    Updates the 'last_activity_time' for the specified user session in Redis and
    resets the session's TTL (Time-To-Live).
    :param redis_client_: The Redis client used to interact with the Redis database.
    :param user_id_: The unique identifier of the user whose session is being updated.
    """
    session_data = redis_client_.get(user_id_)
    if session_data:
        session_info = json.loads(session_data)
        session_info["last_activity_time"] = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        redis_client_.set(user_id_, json.dumps(session_info))
        redis_client_.expire(user_id_, 1800)


def delete_session(redis_client_: Redis, user_id_: str):
    """
    Deletes the session associated with the specified user ID from Redis.
    :param redis_client_: The Redis client used to interact with the Redis database.
    :param user_id_: The unique identifier of the user whose session is being updated.
    """
    redis_client_.delete(user_id_)


if __name__ == "__main__":
    with redis.Redis(host="localhost", port=6379, db=0) as redis_client:
        user_id = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        create_session(redis_client, user_id, session_id)
        update_last_activity(redis_client, user_id)
        delete_session(redis_client, user_id)
