// var builder = require('botbuilder');

// // Create bot and bind to console
// var connector = new builder.ConsoleConnector().listen();
// var bot = new builder.UniversalBot(connector);

var builder = require('botbuilder');
var restify = require('restify');

//MICROSOFT_APP_ID='66abcc6a-33e6-495c-819d-bd574b3604c5' MICROSOFT_APP_PASSWORD='fxJn2cjcNunesZmqDZxMhVT' node app.js

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
// var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4ae18224-cdb3-4676-8fef-ab92401a91b0?subscription-key=c77f95149dea4c4c820a617d01720f31&timezoneOffset=0.0&verbose=true&q=';
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/45920bdd-a3db-4d6e-b05e-ebfbf5a8e262?subscription-key=5871c7a8471840cd9122d563643af60b&verbose=true&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Add intent handlers

dialog.matches('Greeting', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.send("Welcome to Life in Control!\n*Thank you for trusting us with your health. As your care team, we shall do everything we can( to keep you fit and healthy!)/(for your health and well-being!)But always remember, the most important member in your care team is you!Now, it's time for you to meet Maya, your personal health assistant!");
            builder.Prompts.text(session, "What is your name?");
        } else {
            next();
        }
    },
    function (session, results) {
        if(results.response){
            session.userData.name = results.response;
        }
        session.send('Hello %s!', session.userData.name);
        session.endDialog();
    }
]);


dialog.matches(/^change name/i, [
    function (session) {
        // session.beginDialog('/profile');
                session.send('Okk... Changed your name to %s', session.userData.name);

    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);







dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. Try saying hello to me   ."));
