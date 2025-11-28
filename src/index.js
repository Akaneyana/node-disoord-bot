import 'dotenv/config';
import { once } from 'node:events';
import { client } from './core/client.js';
import { loadPrefixes } from './config/prefix-store.js';
import { messageCreate } from './events/message-create.js';
import { interactionCreate } from './events/interaction-create.js';

async function start() {
    loadPrefixes();
    client.on('messageCreate', messageCreate);
    client.on('interactionCreate', interactionCreate);
    await client.login(process.env.DISCORD_TOKEN);
    await once(client, 'ready');
    console.log(`Logged in as ${client.user.tag}!`);
}

start().catch(err => {
    console.error(err);
});
