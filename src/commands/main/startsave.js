const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
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

            if (fetchedGame.active === true) { //Cannot start a save that's already in use. (to prevent loss of data)
                interaction.reply("This save game is already active.");
                return;
            }

            /* if the command is used properly:
            /  Sets activity to true and sets the id of the player who is active
            (that way nobody else can use /endgame on behalf of this player.) */
            fetchedGame.player = interaction.member.id;
            fetchedGame.active = true;
            await fetchedGame.save();
            await interaction.deferReply();

            interaction.editReply(
            `Setting activity... Sending link...`
            );

            await wait(1000);

            interaction.editReply( //Sends the current save file's download link and let's the player know to use /endgame when done.
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