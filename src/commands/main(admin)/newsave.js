const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const SaveGame = require('../../models/SaveGame');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) { //Does not let you run command outside of servers.
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

        const newSaveGame = new SaveGame({ //Creates new SaveGame to be stored in the database. Based on user input.
            saveGame: interaction.options.get('save-name').value,
        });

        await newSaveGame.save();
        await interaction.deferReply();

        interaction.editReply(
        `Created new save game!`
        );
    },

    name: 'newsave',
    description: 'Creates new save file. (Admin only)',
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