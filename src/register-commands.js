require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'add',
    description: 'Add two numbers',
    options: [
      {
        name: 'num1',
        description: 'The first number',
        type: ApplicationCommandOptionType.Number,
        required: true
      },
      {
        name: 'num2',
        description: 'The second number',
        type: ApplicationCommandOptionType.Number,
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('slash commands registered successfully');
    } catch (error) {
        console.log(`there was an error: ${error}`);
    }
})();

