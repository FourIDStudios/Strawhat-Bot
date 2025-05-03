
/* Libraries & Imports */
const {Client, Events, GatewayIntentBits}   = require('discord.js')
const {CommandKit}                          = require("commandkit")
const mongoose                              = require('mongoose')
const Env                                   = require("dotenv")
const path                                  = require('path');

/* Pre-Process */
Env.config()

/* Setup */
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,

    ]}); /* Client */


(async () => { 
    try {
        /* Database */         
        mongoose.set('strictQuery', false);  
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_ACCESS_TOKEN}@mbdatabase.heuls.mongodb.net/?retryWrites=true&w=majority&appName=MBDatabase`);
        console.log('Connected To Database.');

        /* Commands */
        new CommandKit({                                                    
            client,
            devGuildIds     :      [process.env.DEV_SERVER_ID],
            devUserIds      :      ['147806040455512064','287438686356897793'],
            eventsPath      :      path.join(__dirname,`/Events`),
            commandsPath    :      path.join(__dirname,`/Commands`),
            validationsPath :      path.join(__dirname,`/Validations`),
            skipBuiltInValidations: true,
            bulkRegister    :      true
        });

        /* Start */
        client.login(process.env.BOT_TOKEN);
    } catch(error) {
        console.log(`Failed To Setup Bot: ${error}`);
    }
})();





