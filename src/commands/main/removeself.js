const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const SaveGame = require('../../models/SaveGame');
const wait = require('node:timers/promises').setTimeout;

module.exports = {

    callback: async (client, interaction) => { //Loop through this until hit return.
        if (!interaction.inGuild()) { //Does not let you run command outside of servers.
            interaction.reply("You can only run this command inside a server.");
            return;
        }1
        try {
            const fetchedGame = await SaveGame.findOne({ //Finds the save file associated with the name given in the command.
                saveGame: interaction.options.get('save-name').value,
            });

            if (!fetchedGame) { //If the name given in the command doesn't match any in the database.
                interaction.reply("That save does not exist.");
                return;
            }

            if (fetchedGame.active !== true) { //Nobody is using this save.
                interaction.reply("This save game is inactive.");
                return;
            }

            if ( fetchedGame.player === interaction.member.id ) {
                /* Player who is set to active wants to set themselves inactive without using /endgame
                /(resulting in no save file (progress) being uploaded.) */
                fetchedGame.active = false;
                fetchedGame.player = 'none';

                await fetchedGame.save();

                await interaction.deferReply();

                interaction.editReply(`You are no longer set to active in ${fetchedGame.saveGame}.`);

                return;
            }

            interaction.editReply(
            `Error`
            );

            return;
        } catch (error) {
            console.log(`Error starting save: ${error}`);
        }

    },

    name: 'removeself',
    description: 'If you cant/dont want to upload save progress.',
    options: [
        {
            name: 'save-name',
            description: 'Name of the save file.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
};