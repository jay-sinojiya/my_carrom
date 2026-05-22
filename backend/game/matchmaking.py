import redis.asyncio as redis

# Explicitly use redis.asyncio for async operations
client = redis.from_url("redis://127.0.0.1:6379")

async def add_player(player_channel):
    # Try to get an opponent from the queue
    opponent = await client.lpop("matchmaking_queue")
    
    if opponent:
        return opponent.decode("utf-8")
    else:
        # Add self to queue if no opponent
        await client.rpush("matchmaking_queue", player_channel)
        return None

async def remove_player(player_channel):
    # Remove player from queue if they disconnect
    await client.lrem("matchmaking_queue", 0, player_channel)
