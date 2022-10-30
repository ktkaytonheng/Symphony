require('dotenv').config()
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { DisTube } = require("distube");
const fs = require("fs");

const client = new Client({
    partials: [
        Partials.Channel, // for text channel
        Partials.GuildMember, // for guild member
        Partials.User, // for discord user
    ],
    intents: [
        GatewayIntentBits.Guilds, // for guild related things
        GatewayIntentBits.GuildMembers, // for guild members related things
        GatewayIntentBits.GuildIntegrations, // for discord Integrations
        GatewayIntentBits.GuildVoiceStates, // for voice related things
    ],
});

client.player = new DisTube(client, {
    leaveOnStop: false,
    leaveOnFinish: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
});

client.commands = [];
fs.readdir("./src/commands", (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
        try {
            if (f.endsWith(".js")) {
                let props = require(`./commands/${f}`);
                client.commands.push({
                    name: props.name,
                    description: props.description,
                    options: props.options,
                });
                console.log(`loaded ${props.name}`);
            }
        } catch (err) {
            console.log(err);
        }
    });
});

if (process.env.TOKEN) {
    client.login(process.env.TOKEN)
        .then(console.log("Initialized bot"))
        .catch((e) => {
            console.log("Couldn't initialize bot with token");
        });
} else {
    setTimeout(() => {
        console.log("No token found");
    }, 2000);
}