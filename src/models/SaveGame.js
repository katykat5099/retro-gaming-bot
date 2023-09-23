const { Schema, model } = require('mongoose');

const saveGameSchema = Schema({
    saveGame: {
        type: String,
        required: true,
    },
    saveLink: {
        type: String,
        default: 'none',
    },
    active: {
        type: Boolean,
        default: false,
    },
    player: {
        type: String,
        default: 'none',
    },
    timeSpent: {
        type: Number,
        default: 0,
    }
});

module.exports = model('SaveGame', saveGameSchema);