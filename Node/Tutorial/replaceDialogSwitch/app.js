var builder = require('botbuilder');
var restify = require('restify');

//MICROSOFT_APP_ID='363358fc-9d37-4891-90be-fd9fb2f8e7f9' MICROSOFT_APP_PASSWORD='Pbzuj7LafSoceTfmUAAMQH7' node app.js
// MICROSOFT_APP_ID='363358fc-9d37-4891-90be-fd9fb2f8e7f9' MICROSOFT_APP_PASSWORD='Pbzuj7LafSoceTfmUAAMQH7' node --debug-brk=5314 app.js 

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.dialog('/', [
    function (session) {
        session.send("You're in a large clearing. There's a path to the north.");
        builder.Prompts.choice(session, "command?", ["north", "look"]);
    },
    function (session, results) {
        switch (results.response.entity) {
            case "north":
                session.replaceDialog("/room1");
                break;
            default:
                session.replaceDialog("/");
                break;
        }
    }
]);
bot.dialog('/room1', [
    function (session) {
        session.send("There's a small house here surrounded by a white fence with a gate. There's a path to the south and west.");
        builder.Prompts.choice(session, "command?", ["open gate", "south", "west", "look"]);
    },
    function (session, results) {
        switch (results.response.entity) {
            case "open gate":
                session.replaceDialog("/room2");
                break;
            case "south":
                session.replaceDialog("/");
                break;
            case "west":
                session.replaceDialog("/room3");
                break;
            default:
                session.replaceDialog("/room1");
                break;
        }
    }
]);