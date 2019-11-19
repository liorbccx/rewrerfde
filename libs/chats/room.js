var lodash = require("lodash");
var Emoji = require("emojione");
Emoji.ascii = true;
Emoji.imageType = "svg";
Emoji.imagePathSVGSprites = "./emojis.svg";
Emoji.sprites = true;
Emoji.spriteSize = 64;

module.exports = function (Room) {
    var methods = {}

    function defaults(room) {
        return lodash.defaults(room, {
            creator: 'system',
            created: Date.now(),
            messages: []
        })
    }

    methods.get = function (fields) {
        return Room.get(fields)
    }

    methods.disconnect = function () {
        if (Room) Room.disconnect()
    }

    methods.create = function (roomid, userid) {
        return defaults({
            id: roomid,
            creator: userid
        })
    }

    methods.addMessage = function (message) {
        message.message = Emoji.shortnameToImage(message.message);

        Room.push('messages', message)
        while (Room('messages').length > 25) {
            Room.shift('messages')
        }

        return Room
    }

    function filterMessages(prop, comparison) {
        var messages = Room('messages')
        messages = lodash.filter(messages, message => {
            return message[prop] != comparison
        })
        Room.set('messages', messages)
        return Room
    }

    methods.removeMessage = function (messageid) {
        return filterMessages('id', messageid)
    }

    methods.removeUserMessages = function (userid) {
        return filterMessages('userid', userid)
    }

    return methods
}