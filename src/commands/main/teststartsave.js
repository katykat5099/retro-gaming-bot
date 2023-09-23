const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const SaveGame = require('../../models/SaveGame');
const wait = require('node:timers/promises').setTimeout;

module.exports = {

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }1
        try {
            const fetchedGame = await SaveGame.findOne({
                saveGame: interaction.options.get('save-name').value,
            });

            if (!fetchedGame) {
                interaction.reply("That save does not exist.");
                return;
            }

            if (fetchedGame.active === true) {
                interaction.reply("This save game is already active.");
                return;
            }

            const collector = interaction.channel.createMessageCollector({
                filter: (message) => message.content || message.attachments,
                time: 30_000,
            });

            collector.on('collect', (message) => {
                if (message.author.bot) {
                    return;
                }

                interaction.channel.send(
                    `Result: ${message}`
                );
            });

            collector.on('end', () => {
                interaction.channel.send(
                    `Try again.`
                );
            });

            interaction.reply(
            `Input message...`
            );

            await fetchedGame.save();
            return;

        } catch (error) {
              console.log(`Error starting save: ${error}`);
          }
    },

    name: 'teststartsave',
    description: 'Set yourself as "active" for a save file.',
    options: [
        {
            name: 'save-name',
            description: 'Name of the save file.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
};