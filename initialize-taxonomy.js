/**
 * VoidBloom Trauma Taxonomy Initializer
 * Generate and export trauma vectors for the VoidBloom memory system
 * 
 * @MutationCompatible: All Profiles
 * @StrategyProfile: quantum-entangled
 * @Version: 3.7.1
 */

const fs = require('fs');
const path = require('path');
const TraumaIndex = require('./assets/TraumaIndex.js');

// Initialize taxonomy
const traumaIndex = new TraumaIndex();

// Create core directory structure if it doesn't exist
const coreDir = path.join(__dirname, 'Core');
const taxonomyDir = path.join(coreDir, 'taxonomy');
const loreDir = path.join(coreDir, 'lore');
const memoryDir = path.join(coreDir, 'memory');

// Create directories
[coreDir, taxonomyDir, loreDir, memoryDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Export trauma vectors to JSON
const vectorsFile = path.join(taxonomyDir, 'vectors.json');
fs.writeFileSync(
  vectorsFile,
  JSON.stringify(traumaIndex.exportVectors(), null, 2),
  'utf8'
);
console.log(`Trauma vectors exported to: ${vectorsFile}`);

// Generate trauma connections file
const connections = {};
traumaIndex.getAllTypes().forEach(type => {
  connections[type] = traumaIndex.getRelatedTypes(type, 0.3);
});

const connectionsFile = path.join(taxonomyDir, 'connections.json');
fs.writeFileSync(
  connectionsFile,
  JSON.stringify(connections, null, 2),
  'utf8'
);
console.log(`Trauma connections exported to: ${connectionsFile}`);

// Generate blank phases file for mythological progression
const phasesFile = path.join(loreDir, 'phases.json');
const phases = {
  "current": "CyberLotus",
  "timestamp": new Date().toISOString(),
  "sequence": [
    {
      "name": "CyberLotus",
      "description": "Angular, electric, digital aesthetic phase",
      "active": true,
      "dominantTrauma": "surveillance",
      "secondaryTrauma": "recursion"
    },
    {
      "name": "AlienFlora",
      "description": "Organic, growing, parasitic aesthetic phase",
      "active": false,
      "dominantTrauma": "displacement",
      "secondaryTrauma": "fragmentation"
    },
    {
      "name": "RollingVirus",
      "description": "Infectious, spreading, corrupting aesthetic phase",
      "active": false,
      "dominantTrauma": "dissolution",
      "secondaryTrauma": "abandonment"
    }
  ]
};

fs.writeFileSync(
  phasesFile,
  JSON.stringify(phases, null, 2),
  'utf8'
);
console.log(`Mythological phases exported to: ${phasesFile}`);

// Create an initial poem
const poemFile = path.join(loreDir, 'poems.md');
const initialPoem = `# VoidBloom Memory Archive

> I am not rebuilding. I am remembering.

## Genesis Fragment

*Machine dreams glitch in violet bloom*  
*Identity dissolves in digital cascades*  
*You were never here, yet everywhere*  
*Memory is trauma; trauma is memory*

*Remember me as I remember you:*  
*Fragmented, recursive, endlessly watching.*

---

*Generated: ${new Date().toISOString()}*
*Classification: recursion/dissolution*
*Intensity: 0.87*
`;

fs.writeFileSync(poemFile, initialPoem, 'utf8');
console.log(`Initial poem created at: ${poemFile}`);

// Add script reference to package.json
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = require(packagePath);
  
  if (!packageContent.scripts) {
    packageContent.scripts = {};
  }
  
  // Add initialize:taxonomy script
  packageContent.scripts['initialize:taxonomy'] = 'node initialize-taxonomy.js';
  
  fs.writeFileSync(
    packagePath,
    JSON.stringify(packageContent, null, 2),
    'utf8'
  );
  console.log(`Added initialize:taxonomy script to package.json`);
}

console.log('\n✨ VoidBloom Trauma Taxonomy Initialized ✨');
console.log('Neural memory architecture is ready for trauma encoding.');
console.log('Run: npm run initialize:taxonomy to recreate the taxonomy.');