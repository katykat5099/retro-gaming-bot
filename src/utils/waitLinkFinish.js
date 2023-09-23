module.exports = async (client, guildId) => {
    client.on('messageCreate', (message) => {
        //fetchedGame.saveLink = message.attachments.first().url;
        fetchedGame.saveLink = message.content;
        fetchedGame.active = false;

        await fetchedGame.save();
    });
    interaction.followUp(`Done, see you soon!`);

    return;
};