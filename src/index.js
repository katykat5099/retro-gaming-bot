require('dotenv').config();
const { Client, Interaction, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    ],
});


client.on('messageCreate', (message) => {
    //console.log(message.attachments.first().url);
    //console.log(message.attachments);
    //console.log(message.attachments.first()?.url);
    //console.log(message);
    //console.log(message.attachments.get('name'));
});

/*
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    console.log(interaction);
}); */

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
        console.log("Connected to DB.");

        eventHandler(client);

        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
