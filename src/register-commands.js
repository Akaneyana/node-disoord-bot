require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  {
    name: 'setprefix',
    description: 'Sets a new prefix for the bot',
    options: [
      {
        name: 'prefix',
        description: 'The new prefix to set',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
];

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try{
    console.log('Started refreshing application (/) commands.....');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      {body: commands},
    )

    console.log('Successfully registered Slash (/) commands!');
  }catch (error){
    console.log(`There was an error: ${error}`);
  }
})();

