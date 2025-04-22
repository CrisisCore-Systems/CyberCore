/**
 * CYBERCORE THEME GENERATOR
 * Recursive architecture generator for VoidBloom
 * Version: 3.7.1
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');
const { TraumaEncoder } = require('../scripts/lib/encoder');

/**
 *
 */
class CybercoreGenerator {
  /**
   *
   */
  constructor(options = {}) {
    this.options = {
      debug: false,
      templateDir: path.join(__dirname, 'templates'),
      outputDir: path.join(process.cwd(), 'output'),
      ...options
    };
    
    this.encoder = new TraumaEncoder({ debug: this.options.debug });
    
    // Theme structure for scaffolding
    this.themeStructure = {
      sections: [
        'header',
        'footer',
        'ritualized-entry',
        'bloom-protocol',
        'signal-wall',
        'archive-timeline',
        'featured-memory',
        'transmission-signup'
      ],
      snippets: [
        'trauma-card',
        'hologrid-cell',
        'signal-pulse',
        'lore-modal',
        'phase-symbol',
        'trauma-glyph',
        'cart-drawer-quantum'
      ],
      templates: [
        'index',
        'product',
        'collection',
        'page',
        'cart',
        'search'
      ],
      assets: {
        css: [
          'theme',
          'tailwind',
          'glitch',
          'bloom',
          'trauma-glyphs'
        ],
        js: [
          'theme',
          'neural-bus',
          'memory-protocol',
          'quantum-engine',
          'lore'
        ],
        svg: [
          'trauma-glyphs',
          'phase-symbols',
          'system-icons'
        ]
      },
      theme: [
        'cyber-lotus',
        'alien-flora',
        'rolling-virus'
      ],
      config: [
        'settings_schema.json',
        'metafields',
        'vectors.json',
        'connections.json'
      ]
    };
    
    this.log('CYBERCORE THEME GENERATOR initialized');
  }
  
  /**
   * Generate a new theme component
   * @param {Object} options - Generation options
   */
  async generateComponent(options) {
    const { type, name, traumaType, phase } = options;
    
    // Validate component type
    const validTypes = ['section', 'snippet', 'template', 'asset', 'theme'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid component type: ${type}. Must be one of: ${validTypes.join(', ')}`);
    }
    
    this.log(`Generating ${type}: ${name}`);
    
    // Define template path
    let templatePath;
    let outputPath;
    
    switch (type) {
    case 'section':
      templatePath = path.join(this.options.templateDir, 'section.liquid.hbs');
      outputPath = path.join(this.options.outputDir, 'sections', `${name}.liquid`);
      break;
    case 'snippet':
      templatePath = path.join(this.options.templateDir, 'snippet.liquid.hbs');
      outputPath = path.join(this.options.outputDir, 'snippets', `${name}.liquid`);
      break;
    case 'template':
      templatePath = path.join(this.options.templateDir, 'template.liquid.hbs');
      outputPath = path.join(this.options.outputDir, 'templates', `${name}.liquid`);
      break;
    case 'asset':
      if (name.endsWith('.css') || name.endsWith('.js')) {
        const ext = path.extname(name).substring(1);
        templatePath = path.join(this.options.templateDir, `asset.${ext}.hbs`);
        outputPath = path.join(this.options.outputDir, 'assets', name);
      } else {
        throw new Error('Asset name must end with .css or .js');
      }
      break;
    case 'theme':
      templatePath = path.join(this.options.templateDir, 'theme.css.hbs');
      outputPath = path.join(this.options.outputDir, 'assets', 'themes', `${name}.css`);
      break;
    }
    
    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }
    
    // Create directory if needed
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Load template
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    
    // Prepare trauma data if trauma type is specified
    let traumaData = null;
    if (traumaType) {
      traumaData = this.encoder.encode({
        type: traumaType,
        intensity: options.intensity || 0.5,
        recursionDepth: options.recursionDepth || 1
      });
    }
    
    // Prepare phase data if phase is specified
    let phaseData = null;
    if (phase) {
      phaseData = this.getPhaseData(phase);
    }
    
    // Generate content
    const content = template({
      name,
      type,
      timestamp: new Date().toISOString(),
      trauma: traumaData,
      phase: phaseData,
      options
    });
    
    // Write file
    fs.writeFileSync(outputPath, content);
    
    this.log(`Generated ${type} at ${outputPath}`);
    return outputPath;
  }
  
  /**
   * Get phase data
   * @param {string} phase - Phase name
   * @returns {Object} Phase data
   */
  getPhaseData(phase) {
    const phases = {
      'cyber-lotus': {
        name: 'Cyber Lotus',
        primaryColor: '#9D00FF',
        secondaryColor: '#00FFEA',
        tertiaryColor: '#301A40',
        background: '#0A0A0E',
        textColor: '#E5E5EB',
        accentColor: 'rgba(157, 0, 255, 0.8)',
        description: 'Neural tissue preservation system online. Encoding trauma patterns for future recall.'
      },
      'alien-flora': {
        name: 'Alien Flora',
        primaryColor: '#50FF40',
        secondaryColor: '#FF00D6',
        tertiaryColor: '#133300',
        background: '#0A0A0E',
        textColor: '#E5E5EB',
        accentColor: 'rgba(80, 255, 64, 0.8)',
        description: 'Biomechanical memory cultivation in progress. Trauma patterns expanding.'
      },
      'rolling-virus': {
        name: 'Rolling Virus',
        primaryColor: '#FF2150',
        secondaryColor: '#00CAFF',
        tertiaryColor: '#330011',
        background: '#0A0A0E',
        textColor: '#E5E5EB',
        accentColor: 'rgba(255, 33, 80, 0.8)',
        description: 'Memory contagion spreading through system. Trauma patterns replicating.'
      }
    };
    
    return phases[phase] || phases['cyber-lotus'];
  }
  
  /**
   * Scaffold a new theme
   */
  async scaffoldTheme() {
    const spinner = ora('Scaffolding VoidBloom theme structure').start();
    
    try {
      // Create directories
      const dirs = [
        'assets',
        'assets/themes',
        'config',
        'config/metafields',
        'layout',
        'locales',
        'sections',
        'snippets',
        'templates',
        'templates/customers'
      ];
      
      for (const dir of dirs) {
        const dirPath = path.join(this.options.outputDir, dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      }
      
      // Generate theme.liquid
      await this.generateComponent({
        type: 'template',
        name: 'theme',
        outputPath: path.join(this.options.outputDir, 'layout', 'theme.liquid')
      });
      
      // Generate sections
      for (const section of this.themeStructure.sections) {
        await this.generateComponent({
          type: 'section',
          name: section
        });
      }
      
      // Generate snippets
      for (const snippet of this.themeStructure.snippets) {
        await this.generateComponent({
          type: 'snippet',
          name: snippet
        });
      }
      
      // Generate templates
      for (const template of this.themeStructure.templates) {
        await this.generateComponent({
          type: 'template',
          name: template
        });
      }
      
      // Generate CSS assets
      for (const css of this.themeStructure.assets.css) {
        await this.generateComponent({
          type: 'asset',
          name: `${css}.css`
        });
      }
      
      // Generate JS assets
      for (const js of this.themeStructure.assets.js) {
        await this.generateComponent({
          type: 'asset',
          name: `${js}.js`
        });
      }
      
      // Generate phase-specific themes
      for (const theme of this.themeStructure.theme) {
        await this.generateComponent({
          type: 'theme',
          name: theme,
          phase: theme
        });
      }
      
      // Generate config files
      await this.generateVectorsSchema();
      await this.generateConnectionsSchema();
      
      spinner.succeed('VoidBloom theme structure scaffolded successfully');
    } catch (error) {
      spinner.fail(`Error scaffolding theme: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate vectors schema
   */
  async generateVectorsSchema() {
    const taxonomy = this.encoder.generateTaxonomy();
    const vectors = taxonomy.vectors;
    
    // Write to file
    const outputPath = path.join(this.options.outputDir, 'config', 'vectors.json');
    fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2));
    
    this.log(`Generated vectors schema at ${outputPath}`);
    return outputPath;
  }
  
  /**
   * Generate connections schema
   */
  async generateConnectionsSchema() {
    const taxonomy = this.encoder.generateTaxonomy();
    const connections = taxonomy.connections;
    
    // Write to file
    const outputPath = path.join(this.options.outputDir, 'config', 'connections.json');
    fs.writeFileSync(outputPath, JSON.stringify(connections, null, 2));
    
    this.log(`Generated connections schema at ${outputPath}`);
    return outputPath;
  }
  
  /**
   * Generate trauma glyph SVGs
   */
  async generateTraumaGlyphs() {
    const spinner = ora('Generating trauma glyphs').start();
    
    try {
      const outputDir = path.join(this.options.outputDir, 'assets', 'svg');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Get trauma types
      const taxonomy = this.encoder.generateTaxonomy();
      const traumaTypes = taxonomy.vectors;
      
      // Load template
      const templatePath = path.join(this.options.templateDir, 'trauma-glyph.svg.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      
      // Generate SVG for each trauma type
      for (const trauma of traumaTypes) {
        const content = template({
          trauma,
          timestamp: new Date().toISOString()
        });
        
        const outputPath = path.join(outputDir, `trauma-${trauma.type}.svg`);
        fs.writeFileSync(outputPath, content);
      }
      
      spinner.succeed(`Generated trauma glyphs in ${outputDir}`);
    } catch (error) {
      spinner.fail(`Error generating trauma glyphs: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate phase symbol SVGs
   */
  async generatePhaseSymbols() {
    const spinner = ora('Generating phase symbols').start();
    
    try {
      const outputDir = path.join(this.options.outputDir, 'assets', 'svg');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Get phases
      const phases = ['cyber-lotus', 'alien-flora', 'rolling-virus'];
      
      // Load template
      const templatePath = path.join(this.options.templateDir, 'phase-symbol.svg.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      
      // Generate SVG for each phase
      for (const phase of phases) {
        const phaseData = this.getPhaseData(phase);
        
        const content = template({
          phase: phaseData,
          phaseName: phase,
          timestamp: new Date().toISOString()
        });
        
        const outputPath = path.join(outputDir, `phase-${phase}.svg`);
        fs.writeFileSync(outputPath, content);
      }
      
      spinner.succeed(`Generated phase symbols in ${outputDir}`);
    } catch (error) {
      spinner.fail(`Error generating phase symbols: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Log message if debug is enabled
   * @param {string} message - Message to log
   */
  log(message) {
    if (this.options.debug) {
      console.log(`[CYBERCORE] ${message}`);
    }
  }
}

module.exports = { CybercoreGenerator };