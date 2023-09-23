const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const SaveGame = require('../../models/SaveGame');

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
        }

        /*
        const fetchedGame = await SaveGame.findOne({
            saveGame: interaction.options.get('save-name').value,
        });

        if (fetchedGame.saveGame === interaction.options.get('save-name').value){
            interaction.reply("Save with this name already exists.");
            return;
        }
        */

        const newSaveGame = new SaveGame({
            saveGame: interaction.options.get('save-name').value,
        });

        await newSaveGame.save();
        await interaction.deferReply();

        interaction.editReply(
        `Created new save game!`
        );
    },

    name: 'newsave',
    description: 'Creates new save file.',
    options: [
        {
            name: 'save-name',
            description: 'Name of the save file.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
};