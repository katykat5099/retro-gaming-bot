// Imports
const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const SaveGame = require('../../models/SaveGame');
const wait = require('node:timers/promises').setTimeout;

module.exports = { //Class

    callback: async (client, interaction) => { //Loop through this until hit return.

        if (!interaction.inGuild()) { //Does not let you run command outside of servers.
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        const fetchedGame = await SaveGame.findOne({ //Finds the save file associated with the name given in the command.
            saveGame: interaction.options.get('save-name').value,
        });

        if (!fetchedGame) { //If the name given in the command doesn't match any in the database.
            interaction.reply("That save does not exist.");
            return;
        }

        if (fetchedGame.active === false) { //Command used wrongly.
            interaction.reply("This save game is not being used, do /startsave to start!");
            return;
        }

        if (!fetchedGame.player === interaction.member.id) { //Not the active player using the save file.
            interaction.reply("This save game was started by someone else.");
            return;
        }

        if (!interaction.options.get('save-link')?.value) { //No link provided.
            console.log(`nothing provided.`);

            interaction.reply(`Attach file here:`);

            const collector = interaction.channel.createMessageCollector({
                filter: (message) => message.attachments.first()?.url !== fetchedGame.saveLink,
                time: 30_000,
            });

            let responded = false;

            collector.on('collect', (message) => {
                if (message.author.bot) {
                    return;
                }

                interaction.channel.send(
                    `Link provided. Check Database.`
                );

                fetchedGame.saveLink = message.attachments.first()?.url;

                responded = true;
                collector.stop();
            });

            collector.on('end', () => { //If no file is provided.
                if ( !responded ) {
                    interaction.channel.send(
                        `No file provided.`
                    );
                    return;
                }
            });

            await wait(31_000); // Eventually find a way to wait for file attachment response, then continue.

            console.log(`saveLink: ${fetchedGame.saveLink}`);
            fetchedGame.active = false;
            await fetchedGame.save();
            return;
        }

        /* if the command is used without providing link:
        / Assigns new save link given in the command & sets activity to none. (activity = false & player = none) */
        fetchedGame.saveLink = interaction.options.get('save-link').value;
        fetchedGame.active = false;
        fetchedGame.player = 'none';
        await fetchedGame.save();
        await interaction.deferReply();


        await wait(1000);

        interaction.reply(
        `Done! Thanks for playing! See you soon.`
        );

        return;
    },

    name: 'testendgame',
    description: 'deactivate your status, and send the new save.',
    options: [
        {
            name: 'save-name',
            description: 'Name of the save file.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'save-link',
            description: 'Link to the save upload. (recommended to not loose progress)',
            type: ApplicationCommandOptionType.String,
        }
    ],
};