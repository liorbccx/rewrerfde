# Chat Service

## Actions

### listRooms
List all created rooms.
> Returns array of roomids

### getRoom
Get room state.
> Returns [room](#room-object) object.

* `roomid` - The id of the room.

### createRoom
Create a new room.
> Returns [room](#room-object) object.

* `roomid` - The id of the room.

### removeMessage
Remove the given message from a room.
> Returns `true`

* `messageid` - The id of the message.
* `roomid` - The id of the room.

### removeUserMessages
Remove all user messages from a room.
> Returns `true`

* `userid` - The id of the user.
* `roomid` - The id of the room.

### removeRoom
Delete a created room.
> Returns `true`

* `roomid` - The id of the room.

### speak
Create a new message in a room.
> Returns the created message.

* `message` - The string you would like to send.
* `user` - The user object, containing: `id`, `avatarurl`, `username`
* `roomid` - The id of the room.