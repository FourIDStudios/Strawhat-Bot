const {Schema, model} = require('mongoose');

const levelSchema = new Schema({
    userId:{
        type:String,
        required:true,
    },
    guildId:{
        type: String, 
        required: true,
    },
    currentXp:{
        type:Number,
        default: 0,
    },
    currentLevel:{
        type:Number, 
        default:1
    }
});

module.exports = model('Level',levelSchema)