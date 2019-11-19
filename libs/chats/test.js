var test = require("tape");
var Chats = require("./");

test("chats", function (t) {
    var chats = null;
    t.test("init", function (t) {
        chats = Chats();
        t.ok(chats);
        t.end();
    });
    t.test("speak", function (t) {
        chats
            .speak("hello", "user")
            .then(function (result) {
                t.ok(result);
                t.end();
            })
            .catch(t.end);
    });
    t.test("speak a lot", function (t) {
        var times = 1000;

        function speak(count) {
            if (count >= times) return t.end();
            chats
                .speak("test" + count, "user" + count)
                .then(function (result) {
                    t.ok(result.chat.length <= 100);
                    speak(count + 1);
                })
                .catch(t.end);
        }
        speak(0);
    });
    t.test("create room", function (t) {
        chats
            .createRoom("tests")
            .then(function (result) {
                t.ok(result);
                t.end();
            })
            .catch(t.end);
    });
    t.test("list rooms", function (t) {
        chats
            .listRooms()
            .then(function (result) {
                t.equal(result.length, 2);
                t.end();
            })
            .catch(t.end);
    });
    t.test("get room", function (t) {
        chats
            .getRoom("tests")
            .then(function (result) {
                t.ok(result);
                t.end();
            })
            .catch(t.end);
    });
    t.test("remove message", function (t) {
        var length = 0;
        chats
            .getRoom()
            .then(function (result) {
                length = result.chat.length;
                var message = result.chat[10];
                return chats.removeMessage(message.id);
            })
            .then(function (result) {
                t.equal(length - 1, result.chat.length);
                t.end();
            })
            .catch(t.end);
    });
});