#!/usr/bin/env node

/**
 * CYBERCORE CLI
 * Command-line interface for VoidBloom theme generation
 * Version: 3.7.1
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { CybercoreGenerator } = require('./cybercore/generator');
const figlet = require('figlet');

// ASCII art banner
console.log(chalk.magenta(figlet.textSync('CYBERCORE', {
  font: 'ANSI Shadow',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})));
console.log(chalk.cyan('  VoidBloom Theme Generator  ') + chalk.gray('v3.7.1\n'));

// Configure CLI
program
  .version('3.7.1')
  .description('CYBERCORE Theme Generator for VoidBloom Memorywear');

// Init command - create a new theme
program
  .command('init')
  .description('Initialize a new VoidBloom theme')
  .option('-o, --output <dir>', 'Output directory', './voidbloom-theme')
  .option('-f, --force', 'Force overwrite if directory exists', false)
  .action(async (options) => {
    console.log(chalk.cyan('Initializing new VoidBloom theme...\n'));
    
    // Check if directory exists
    if (fs.existsSync(options.output) && !options.force) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Directory ${options.output} already exists. Overwrite?`,
          default: false
        }
      ]);
      
      if (!confirm) {
        console.log(chalk.yellow('Initialization cancelled.'));
        return;
      }
    }
    
    // Create generator
    const generator = new CybercoreGenerator({
      debug: true,
      outputDir: options.output
    });
    
    try {
      // Scaffold theme
      await generator.scaffoldTheme();
      
      console.log(chalk.green('\n✓ VoidBloom theme initialized successfully!'));
      console.log(chalk.white(`\nNext steps:`));
      console.log(chalk.gray('1. Navigate to your theme directory:'));
      console.log(chalk.white(`   cd ${options.output}`));
      console.log(chalk.gray('2. Generate trauma glyphs:'));
      console.log(chalk.white('   cybercore generate:glyphs'));
      console.log(chalk.gray('3. Generate phase symbols:'));
      console.log(chalk.white('   cybercore generate:phases'));
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Generate component command
program
  .command('generate:component')
  .description('Generate a new theme component')
  .option('-t, --type <type>', 'Component type (section, snippet, template, asset, theme)')
  .option('-n, --name <name>', 'Component name')
  .option('--trauma <type>', 'Associated trauma type')
  .option('--intensity <value>', 'Trauma intensity (0.1-1.0)', parseFloat)
  .option('--phase <phase>', 'Associated phase (cyber-lotus, alien-flora, rolling-virus)')
  .action(async (options) => {
    // Interactive mode if options are missing
    if (!options.type || !options.name) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Component type:',
          choices: ['section', 'snippet', 'template', 'asset', 'theme'],
          default: options.type
        },
        {
          type: 'input',
          name: 'name',
          message: 'Component name:',
          default: options.name,
          validate: input => input ? true : 'Name is required'
        },
        {
          type: 'list',
          name: 'trauma',
          message: 'Associated trauma type (optional):',
          choices: [
            { name: 'None', value: null },
            { name: 'Abandonment', value: 'abandonment' },
            { name: 'Fragmentation', value: 'fragmentation' },
            { name: 'Surveillance', value: 'surveillance' },
            { name: 'Recursion', value: 'recursion' },
            { name: 'Displacement', value: 'displacement' },
            { name: 'Dissolution', value: 'dissolution' }
          ],
          default: options.trauma
        },
        {
          type: 'number',
          name: 'intensity',
          message: 'Trauma intensity (0.1-1.0):',
          default: options.intensity || 0.5,
          when: answers => answers.trauma,
          validate: input => (input >= 0.1 && input <= 1.0) ? true : 'Intensity must be between 0.1 and 1.0'
        },
        {
          type: 'list',
          name: 'phase',
          message: 'Associated phase (optional):',
          choices: [
            { name: 'None', value: null },
            { name: 'Cyber Lotus', value: 'cyber-lotus' },
            { name: 'Alien Flora', value: 'alien-flora' },
            { name: 'Rolling Virus', value: 'rolling-virus' }
          ],
          default: options.phase
        }
      ]);
      
      // Merge answers with options
      options = { ...options, ...answers };
    }
    
    console.log(chalk.cyan(`Generating ${options.type}: ${options.name}...\n`));
    
    // Create generator
    const generator = new CybercoreGenerator({
      debug: true
    });
    
    try {
      // Generate component
      const outputPath = await generator.generateComponent(options);
      
      console.log(chalk.green(`\n✓ Generated ${options.type} at ${outputPath}`));
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Generate trauma glyphs command
program
  .command('generate:glyphs')
  .description('Generate trauma glyph SVGs')
  .option('-o, --output <dir>', 'Output directory', './assets/svg')
  .action(async (options) => {
    console.log(chalk.cyan('Generating trauma glyphs...\n'));
    
    // Create generator
    const generator = new CybercoreGenerator({
      debug: true,
      outputDir: process.cwd()
    });
    
    try {
      // Generate glyphs
      await generator.generateTraumaGlyphs();
      
      console.log(chalk.green('\n✓ Trauma glyphs generated successfully!'));
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Generate phase symbols command
program
  .command('generate:phases')
  .description('Generate phase symbol SVGs')
  .option('-o, --output <dir>', 'Output directory', './assets/svg')
  .action(async (options) => {
    console.log(chalk.cyan('Generating phase symbols...\n'));
    
    // Create generator
    const generator = new CybercoreGenerator({
      debug: true,
      outputDir: process.cwd()
    });
    
    try {
      // Generate phase symbols
      await generator.generatePhaseSymbols();
      
      console.log(chalk.green('\n✓ Phase symbols generated successfully!'));
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Generate taxonomy command
program
  .command('generate:taxonomy')
  .description('Generate trauma taxonomy files')
  .option('-o, --output <dir>', 'Output directory', './config')
  .action(async (options) => {
    console.log(chalk.cyan('Generating trauma taxonomy...\n'));
    
    // Create generator
    const generator = new CybercoreGenerator({
      debug: true,
      outputDir: process.cwd()
    });
    
    try {
      // Generate taxonomy files
      const vectorsPath = await generator.generateVectorsSchema();
      const connectionsPath = await generator.generateConnectionsSchema();
      
      console.log(chalk.green('\n✓ Trauma taxonomy generated successfully!'));
      console.log(chalk.white(`\nGenerated files:`));
      console.log(chalk.gray(`- Vectors: ${vectorsPath}`));
      console.log(chalk.gray(`- Connections: ${connectionsPath}`));
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Command to export product metafields schema
program
  .command('export:metafields')
  .description('Export metafields schema for Shopify product trauma vectors')
  .option('-o, --output <file>', 'Output file', './config/metafields/product.voidbloom.json')
  .action(async (options) => {
    console.log(chalk.cyan('Exporting metafields schema...\n'));
    
    // Define metafields schema
    const schema = {
      "trauma_type": {
        "type": "single_line_text_field",
        "name": "Trauma Type",
        "description": "Primary trauma vector (abandonment, fragmentation, surveillance, recursion, displacement, dissolution)",
        "validations": {
          "required": true,
          "allowed_values": [
            "abandonment", 
            "fragmentation", 
            "surveillance", 
            "recursion", 
            "displacement", 
            "dissolution"
          ]
        }
      },
      "intensity": {
        "type": "number_decimal",
        "name": "Trauma Intensity",
        "description": "Visual intensity of trauma effects (0.1-1.0)",
        "validations": {
          "required": true,
          "min": 0.1,
          "max": 1.0
        }
      },
      "recursion_depth": {
        "type": "number_integer",
        "name": "Recursion Depth",
        "description": "Depth of trauma recursion layers",
        "validations": {
          "required": true,
          "min": 1,
          "max": 5
        }
      },
      "memory_date": {
        "type": "date",
        "name": "Memory Date",
        "description": "Date associated with this memory node"
      },
      "poem_excerpt": {
        "type": "multi_line_text_field",
        "name": "Poem Excerpt",
        "description": "Poetic fragment associated with this trauma vector"
      },
      "connected_nodes": {
        "type": "json",
        "name": "Connected Nodes",
        "description": "Array of product IDs that are neuronally connected to this memory node"
      }
    };
    
    try {
      // Create output directory if needed
      const outputDir = path.dirname(options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write schema to file
      fs.writeFileSync(options.output, JSON.stringify(schema, null, 2));
      
      console.log(chalk.green(`\n✓ Metafields schema exported to ${options.output}`));
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command specified
if (!process.argv.slice(2).length) {
  program.outputHelp();
}