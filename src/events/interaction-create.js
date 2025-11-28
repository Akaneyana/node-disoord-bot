import { PermissionsBitField } from 'discord.js'
import { setPrefix } from '../config/prefix-store.js'

/** @param {import('discord.js').Interaction} interaction */
export async function interactionCreate(interaction) {
  if (!interaction.isChatInputCommand()) return

  /** @type {import('discord.js').ChatInputCommandInteraction} */
  const chat = interaction

  if (chat.commandName === 'ping') {
    const start = Date.now()
    await chat.reply({ content: 'Pong!' })
    const reply = await chat.fetchReply()
    const latency = reply.createdTimestamp - start
    await chat.editReply(`Pong! (**${latency}ms**)`)
    return
  }

  if (chat.commandName === 'setprefix') {
    const hasAdmin = chat.memberPermissions?.has(PermissionsBitField.Flags.Administrator)
    if (!hasAdmin) {
      return chat.reply({ content: 'You need Administrator permission to change the prefix.', ephemeral: true })
    }
    const newPrefix = chat.options.getString('prefix')
    const guildId = chat.guild.id
    await setPrefix(guildId, newPrefix, chat.guild.name)
    return chat.reply(`Prefix successfully changed to: \`${newPrefix}\``)
  }
}
