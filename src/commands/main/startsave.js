const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const SaveGame = require('../../models/SaveGame');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

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

            fetchedGame.player = interaction.member.id;
            fetchedGame.active = true;
            await fetchedGame.save();
            await interaction.deferReply();

            interaction.editReply(
            `Setting activity... Sending link...`
            );

            await wait(1000);

            interaction.editReply(
            `Link: ${fetchedGame.saveLink} \nWhen you're finished, use the /endgame command!`
            );

            return;
        } catch (error) {
            console.log(`Error starting save: ${error}`);
        }

    },

    name: 'startsave',
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