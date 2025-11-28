/** @typedef {{ prefix: string, name: string }} GuildPrefix */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONFIG_DIR = path.join(__dirname, '..', 'generated')
const PREFIXES_FILE = path.join(CONFIG_DIR, 'prefixes.json')

/** @type {Record<string, GuildPrefix>} */
let prefixes = {}

export const loadPrefixes = () => {
  if (fs.existsSync(PREFIXES_FILE)) {
    const data = fs.readFileSync(PREFIXES_FILE, 'utf8')
    try {
      prefixes = JSON.parse(data)
      console.log('✅ Prefixes loaded:', prefixes)
    } catch (err) {
      console.error('❌ Error parsing prefixes.json:', err)
    }
  }
}

const ensureConfigDir = async () => {
  await fs.promises.mkdir(CONFIG_DIR, { recursive: true })
}

const save = async () => {
  await ensureConfigDir()
  await fs.promises.writeFile(PREFIXES_FILE, JSON.stringify(prefixes, null, 2))
}

/** @param {string} guildId */
export const getPrefix = guildId => prefixes[guildId]?.prefix || '!'

/**
 * @param {string} guildId
 * @param {string} prefix
 * @param {string} name
 */
export const setPrefix = async (guildId, prefix, name) => {
  prefixes[guildId] = { prefix, name }
  await save()
}
