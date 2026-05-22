import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from .matchmaking import add_player, remove_player


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        self.group_name = f"game_{self.room}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except ValueError:
            return

        action = data.get("type")

        # Basic validation
        if action == "strike":
            force = data.get("force", 0)
            if force > 10: # Reject cheating/excessive force
                return
            
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "broadcast_strike",
                    "data": data
                }
            )

        elif action == "turn":
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "broadcast_turn",
                    "data": data
                }
            )
            
        elif action == "sync_state":
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "broadcast_sync",
                    "data": data
                }
            )
            
        elif action == "move_striker":
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "broadcast_move_striker",
                    "data": data
                }
            )

    async def broadcast_strike(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def broadcast_turn(self, event):
        await self.send(text_data=json.dumps(event["data"]))
        
    async def broadcast_sync(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def broadcast_move_striker(self, event):
        await self.send(text_data=json.dumps(event["data"]))

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.matched = False
        await self.accept()

    async def disconnect(self, close_code):
        if not self.matched:
            await remove_player(self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except ValueError:
            return

        if data.get("type") == "find_match":
            opponent_channel = await add_player(self.channel_name)

            if opponent_channel:
                room_id = str(uuid.uuid4())[:8]

                # Send match to opponent
                await self.channel_layer.send(
                    opponent_channel,
                    {
                        "type": "match_found",
                        "room": room_id,
                        "player": 1
                    }
                )

                # Send match to self
                self.matched = True
                await self.send(text_data=json.dumps({
                    "type": "match_found",
                    "room": room_id,
                    "player": 2
                }))

            else:
                await self.send(text_data=json.dumps({
                    "type": "waiting"
                }))

        elif data.get("type") == "cancel_match":
            await remove_player(self.channel_name)
            await self.send(text_data=json.dumps({
                "type": "cancelled"
            }))

    async def match_found(self, event):
        self.matched = True
        await self.send(text_data=json.dumps(event))

