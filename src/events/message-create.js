import { PermissionsBitField } from 'discord.js'
import { getPrefix, setPrefix } from '../config/prefix-store.js'

/** @param {import('discord.js').Message} message */
export async function messageCreate(message) {
    if (message.author.bot || !message.guild) return

    const guildId = message.guild.id
    const prefix = getPrefix(guildId)
    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase()

    if (command === 'ping') {
        const sent = Date.now()
        const reply = await message.reply('Pong!')
        const latency = reply.createdTimestamp - message.createdTimestamp
        await reply.edit(`Pong! (**${latency}ms**) | Bot latency: **${Date.now() - sent}ms**`)
        return
    }

    if (command === 'setprefix') {
        const hasAdmin = message.member?.permissions.has(PermissionsBitField.Flags.Administrator)
        if (!hasAdmin) {
            return message.reply('You need Administrator permission to change the prefix.')
        }
        if (!args[0]) {
            return message.reply(`Current prefix is: \`${prefix}\``)
        }

        await setPrefix(guildId, args[0], message.guild.name)
        return message.reply(`Prefix successfully changed to: \`${args[0]}\``)
    }
}
