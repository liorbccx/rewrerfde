var Promise = require("bluebird")
var lodash = require("lodash")
var assert = require("assert")
var uuid = require("uuid/v4")
var highland = require("highland")

var State = require('statesync')
var utils = require("./utils")
var Room = require('./room')

module.exports = function (resume, upsert, remove) {
  resume = resume || []
  upsert = upsert || function () {};
  remove = remove || function () {};

  const DEFAULT_ROOMS = ["en", "ru", "us", "de", "pl", "fr", "cn"];
  const PRIMARY_ROOM = "en";
  var Rooms = State({}, lodash.cloneDeep);

  function getRoom(id) {
    var room = Rooms(id)
    assert(room, 'Room not found with that id')
    return room
  }

  function getRoomScope(id) {
    var room = Room(Rooms.scope(id))
    assert(room, 'Room not found with that id')
    return room
  }

  function closeScope(room) {
    if (room) room.disconnect()
  }

  Rooms.listRooms = Promise.method(function () {
    return lodash.keys(Rooms())
  })

  Rooms.getRoom = Promise.method(function (roomid) {
    roomid = roomid || PRIMARY_ROOM;
    assert(Rooms.has(roomid), 'Room does not exist!')
    return getRoom(roomid)
  })

  Rooms.createRoom = Promise.method(function (roomid, userid) {
    assert(!Rooms.has(roomid), 'Room already exists!')
    var room = Room().create(roomid, userid)
    upsert(room)
    Rooms.set(room.id, room)
    return room
  })

  Rooms.removeMessage = Promise.method(function (messageid, roomid) {
    assert(messageid, "requires messageid");
    roomid = roomid || PRIMARY_ROOM;
    var room = getRoomScope(roomid)
    room.removeMessage(messageid)
    upsert(room.get())
    closeScope(room)
    return true
  })

  Rooms.removeUserMessages = Promise.method(function (userid, roomid) {
    assert(messageid, "requires messageid");
    roomid = roomid || PRIMARY_ROOM;
    var room = getRoomScope(roomid)
    room.removeUserMessages(userid)
    upsert(room.get())
    closeScope(room)
    return true
  })

  Rooms.removeRoom = Promise.method(function (roomid) {
    assert(roomid, "requires roomid");
    assert(roomid != PRIMARY_ROOM, `You cannot delete the ${PRIMARY_ROOM} room.`);
    Rooms.delete(roomid)
    remove(roomid)
    return true;
  });

  function formatMessage(message, user) {
    message = lodash.escape(message)
    return {
      id: uuid(),
      user: utils.stripUser(user),
      message: utils.linkify(message),
      time: Date.now()
    };
  }

  Rooms.speak = Promise.method(function (message, user, roomid) {
    roomid = roomid || PRIMARY_ROOM;
    assert(message, "you cant send empty message");
    assert(lodash.isString(message), "message is not a string!");
    assert(
      message.replace(/\s+/g, '').length > 1,
      "You need to type at least a 2 character word..."
    );
    var formattedMessage = formatMessage(message, user);
    assert(formattedMessage.message, "You need to say somthing...");
    assert(formattedMessage.message != "", "You need to say somthing...");
    assert(
      formattedMessage.message.split(" ").length > 0,
      "you need to say more than one word..."
    );

    var room = getRoomScope(roomid)
    room.addMessage(formattedMessage)
    upsert(room.get())
    closeScope(room)
    return formattedMessage
  });

  function init() {
    return Promise.fromCallback(done => {
      highland(resume)
        .doto(room => {
          return Rooms.set(room.id, room)
        })
        .errors(done)
        .done(function () {
          var neededRooms = lodash.difference(DEFAULT_ROOMS, Rooms.listRooms())
          Promise.map(neededRooms, roomid => {
            return Rooms.createRoom(roomid).catch(err => {})
          })
          return done(null, Rooms);
        });
    });
  }

  return init();
};