// var builder = require('botbuilder');

// // Create bot and bind to console
// var connector = new builder.ConsoleConnector().listen();
// var bot = new builder.UniversalBot(connector);

var builder = require('botbuilder');
var restify = require('restify');

//MICROSOFT_APP_ID='363358fc-9d37-4891-90be-fd9fb2f8e7f9' MICROSOFT_APP_PASSWORD='Pbzuj7LafSoceTfmUAAMQH7' node app.js

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

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4ae18224-cdb3-4676-8fef-ab92401a91b0?subscription-key=c77f95149dea4c4c820a617d01720f31&timezoneOffset=0.0&verbose=true&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Add intent handlers
dialog.matches('BookFlight', [
    function (session, args, next) {
        session.send('You want to book a flight.');
    }
]);

dialog.matches('GetWeather', [
    function (session, args, next) {
        session.send('You want to get the weather.');
    }
]);



dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));
