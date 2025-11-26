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

// Correct event: "ready" (NOT clientReady)
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => { // Prefix Commands
    if (message.author.bot || !message.guild) return;

    // respond to "hi" without prefix
/*      const raw = message.content.trim().toLowerCase();
    if (raw === 'hi') {
        return message.reply('Hallo o/');
    } */
 
    const guildId = message.guild.id;
    const prefix = prefixes[guildId]?.prefix || '!'; // default prefix = '!'

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        const sent = Date.now(); // time when bot STARTS processing

        return message.reply('Pong!').then(msg => {
            const latency = msg.createdTimestamp - message.createdTimestamp; // message roundtrip

            msg.edit(`Pong! (**${latency}ms**)`);});
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

// Slash Commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        const start = Date.now();
        const reply = await interaction.reply({ content: 'Pong!', fetchReply: true });
        const latency = reply.createdTimestamp - start;
        await interaction.editReply(`Pong! (**${latency}ms**)`);
    }

    if (interaction.commandName === 'setprefix') {
        const newPrefix = interaction.options.getString('prefix');
        const guildId = interaction.guild.id;
        prefixes[guildId] = {
            prefix: newPrefix,
            name: interaction.guild.name
        };
        // Save to JSON file
        try {
            fs.writeFileSync('./prefixes.json', JSON.stringify(prefixes, null, 2));
            console.log(`✅ Saved new prefix for ${guildId}: ${newPrefix} (${interaction.guild.name})`);
        } catch (err) {
            console.error("❌ Error writing prefixes.json:", err);
        }
        return interaction.reply(`Prefix successfully changed to: \`${newPrefix}\``);
    }
});



client.login(process.env.DISCORD_TOKEN);
