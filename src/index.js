require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load prefixes from JSON file (or start fresh)
let prefixes = {};
if (fs.existsSync('./prefixes.json')) {
    const data = fs.readFileSync('./prefixes.json', 'utf8');
    try {
        prefixes = JSON.parse(data);
        console.log("✅ Prefixes loaded:", prefixes);
    } catch (err) {
        console.error("❌ Error parsing prefixes.json:", err);
    }
}

// Always use only clientReady
client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.author.bot || !message.guild) return;

/*     // respond to "hi" without prefix
    const raw = message.content.trim().toLowerCase();
    if (raw === 'hi') {
        return message.reply('Hallo o/');
    } */

    const guildId = message.guild.id;
    const prefix = prefixes[guildId]?.prefix || '!'; // default prefix = '!'

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        return message.reply('Pong!');
    }

    if (command === 'setprefix') {
        if (!args[0]) {
            return message.reply(`Current prefix is: \`${prefix}\``);
        }

        // Update or create entry for this guild
        prefixes[guildId] = {
            prefix: args[0],
            name: message.guild.name
        };

        // Save to JSON file
        try {
            fs.writeFileSync('./prefixes.json', JSON.stringify(prefixes, null, 2));
            console.log(`✅ Saved new prefix for ${guildId}: ${args[0]} (${message.guild.name})`);
        } catch (err) {
            console.error("❌ Error writing prefixes.json:", err);
        }

        return message.reply(`Prefix successfully changed to: \`${args[0]}\``);
}

});

client.login(process.env.DISCORD_TOKEN);
