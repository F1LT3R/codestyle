import fs from 'node:fs'

const coverageFile = '.husky/coverage-summary.txt'

if (!fs.existsSync(coverageFile)) {
	console.error('❌ Coverage report not found.')
	process.exit(1)
}

// Read the file
let coverageData = fs.readFileSync(coverageFile, 'utf8')

// Sanitize and split the content into lines
const lines = coverageData.split('\n').map((line) => line.trim())

// Locate the coverage summary section
const summaryStartIndex = lines.findIndex((line) =>
	line.startsWith('=============================== Coverage summary ===============================')
)
if (summaryStartIndex === -1) {
	console.error('❌ Failed to find coverage summary start in the output.')
	process.exit(1)
}

// Extract the summary table
const summaryLines = lines.slice(summaryStartIndex + 1).filter((line) => line.includes(':'))

if (summaryLines.length === 0) {
	console.error('❌ Coverage summary not found in output.')
	process.exit(1)
}

// Debug: Show extracted summary lines
console.log('Extracted coverage summary lines:', summaryLines)

// Parse the "All files" line (replacing manual assumptions with dynamic parsing)
const allFilesLine = summaryLines.find((line) => line.startsWith('Statements'))
if (!allFilesLine) {
	console.error('❌ Failed to find the required coverage metrics.')
	process.exit(1)
}

// Extract the coverage percentage
const match = allFilesLine.match(/Statements\s+:\s+([\d.]+)%/)

if (!match) {
	console.error('❌ Failed to parse coverage percentage from:', allFilesLine)
	process.exit(1)
}

const coverage = Number.parseFloat(match[1])

if (coverage < 100) {
	console.error(`❌ Coverage is too low: ${coverage}%. Commit rejected.`)
	process.exit(1)
}

console.log('✅ 100% coverage achieved. Proceeding with commit.')
