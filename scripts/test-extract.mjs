import { readFileSync } from 'fs'
const raw = JSON.parse(readFileSync('C:/Users/DLRiv/AppData/Local/Temp/agents_output.json', 'utf8'))
const agent = raw[0]
const content = agent.rawContent

const instrIdx = content.indexOf('## Instructions')
const fenceOpenIdx = content.indexOf('```', instrIdx) + 3
const contentStart = content.indexOf('\n', fenceOpenIdx) + 1
const rest = content.slice(contentStart)
const closingMatch = rest.match(/\n```(\n|$)/)
const instrContent = closingMatch ? rest.slice(0, closingMatch.index) : rest
console.log('Length:', instrContent.length)
console.log('First 200:', instrContent.slice(0, 200))
console.log('Last 80:', instrContent.slice(-80))
