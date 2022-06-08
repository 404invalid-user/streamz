require('dotenv').config();
const config = require('./config')
const discord = require('discord.js');
const browserApi = require('./browser-api');
const botIntents = [discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS];
const client = new discord.Client({ intents: botIntents });

const prefix = 'v!';
client.once('ready', async() => {
    await browserApi.start();
    if (process.env.GOOGLE_email && process.env.GOOGLE_password) {
        await browserApi.googleLogin();
    }
    await browserApi.open(config.defaultPage);

    console.log('Ready!');
});

const cookiesYoutube = [{
    'name': 'cookie1',
    'value': 'val1'
}, {
    'name': 'cookie2',
    'value': 'val2'
}, {
    'name': 'cookie3',
    'value': 'val3'
}];


//message is now deprecated we use messageCreate now
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    let args = message.content.substring(prefix.length).split(" ");

    if (args[0] == 'play') {
        if (!args[1]) return message.channel.send("please provide a url");
        const url = browserApi.getUrl(args[1]);
        if (!config.whitelistDomains.includes(url.domain.toLocaleLowerCase()) && !config.admins.includes(message.author.id)) return message.channel.send("that url has not been whitelisted and you are not an admin");
        await browserApi.open(args[1]);
        message.channel.send("now playing");
    }

    //toggle fullscreen and cinema mode

    if (args[0] == 't') {
        try {
            await browserApi.youtubeCinemaModeToggle();
        } catch (err) {
            return message.channel.send("Error: must be youtube video url");
        }
        return message.channel.send("it has been done")
    }
    if (args[0] == 'f') {
        try {
            await browserApi.youtubeFullScreen();
        } catch (err) {
            message.channel.send("Error: must be youtube video url");
        }
        return message.channel.send("it has been done")
    }

    if (args[0] == 'k' || args[0] == 'play' || args[0] == 'pause') {
        const a = await browserApi.togglePlayPause();
        return message.channel.send("stream is now " + a.state)
    }

    if (args[0] == 'shutdown') {
        if (config.admins.includes(message.author.id)) {
            await message.channel.send("shutting down bot");
            return process.exit(0)
        } else {
            return message.channel.send("you cant do that");
        }
    }
});


client.login(process.env.TOKEN);