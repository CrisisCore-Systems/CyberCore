// Development server for CyberCore components
const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const fs = require('fs');
const { execSync } = require('child_process');

// Run the sync-assets script before starting the server
console.log('🔄 Running asset sync script...');
try {
  require('./scripts/sync-assets');
} catch (error) {
  console.error('❌ Error syncing assets:', error.message);
  console.log('⚠️ Continuing startup with potentially missing assets');
}

// Create Express server
const app = express();
const port = 3000;

// Configure livereload server with custom port to avoid conflicts
const liveReloadServer = livereload.createServer({
  exts: ['js', 'html', 'css', 'liquid', 'json'],
  delay: 1000,
  port: 35731, // Changed to 35731 to avoid conflicts with other processes
});
liveReloadServer.watch([
  path.join(__dirname, 'deploy/dev'),
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'templates'),
  path.join(__dirname, 'sections'),
  path.join(__dirname, 'snippets'),
]);

// Add livereload middleware
app.use(connectLivereload({ port: 35731 }));

// Serve static files from deploy/dev directory
app.use(express.static(path.join(__dirname, 'deploy/dev')));

// Serve asset files directly (for development)
// Add fallback paths to ensure assets are found
app.use('/assets', [
  // First try deploy/dev/assets
  express.static(path.join(__dirname, 'deploy/dev/assets')),
  // Then try the source assets directory
  express.static(path.join(__dirname, 'assets')),
  // Finally try the dist directory
  express.static(path.join(__dirname, 'dist')),
]);

// Simple liquid variable parser for demonstration
/**
 *
 */
function parseLiquid(content, data = {}) {
  // This is a very simplified version that only handles basic variables
  let result = content;

  // Replace section settings with defaults
  result = result.replace(/{{ section\.settings\.([\w]+) \| default: ['"]([^'"]+)['"] }}/g, '$2');

  // Handle default shop name
  result = result.replace(/{{ shop\.name \| default: ['"]([^'"]+)['"] }}/g, '$1');

  // Handle basic date
  result = result.replace(/{{ ['"]now['"] \| date: ['"][^'"]+['"] }}/g, new Date().toISOString());

  // Handle basic variables from data object
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{ ${key} }}`, 'g');
    result = result.replace(regex, data[key]);
  });

  return result;
}

// Helper to read a template and parse it
/**
 *
 */
function renderTemplate(templatePath, data = {}) {
  try {
    let content = fs.readFileSync(templatePath, 'utf8');

    // Handle {% render %} tags
    content = content.replace(
      /{%\s*render\s+['"]([^'"]+)['"]([\s\S]*?)%}/g,
      (match, snippet, params) => {
        const snippetPath = path.join(__dirname, 'snippets', `${snippet}.liquid`);
        if (fs.existsSync(snippetPath)) {
          return fs.readFileSync(snippetPath, 'utf8');
        }
        return `<!-- Snippet ${snippet} not found -->`;
      }
    );

    // Handle {% section %} tags
    content = content.replace(/{%\s*section\s+['"]([^'"]+)['"]\s*%}/g, (match, section) => {
      const sectionPath = path.join(__dirname, 'sections', `${section}.liquid`);
      if (fs.existsSync(sectionPath)) {
        return fs.readFileSync(sectionPath, 'utf8');
      }
      return `<!-- Section ${section} not found -->`;
    });

    // Handle simplified liquid variables
    return parseLiquid(content, data);
  } catch (error) {
    console.error(`Error rendering template: ${error.message}`);
    return `<h1>Error</h1><p>${error.message}</p>`;
  }
}

// VoidBloom homepage route
app.get('/voidbloom', (req, res) => {
  const templatePath = path.join(__dirname, 'templates', 'index.liquid');
  const content = renderTemplate(templatePath, {
    title: 'VoidBloom',
    subtitle: 'Memory Archive System',
  });
  res.send(content);
});

// Create a demo page that showcases the components
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CyberCore Component Preview</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7f9fc;
        }
        header {
          background: linear-gradient(135deg, #2a3990 0%, #4259c3 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        h1 { margin: 0; }
        .page-navigation {
          background: #2a3990;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .page-navigation a {
          color: white;
          margin-right: 15px;
          text-decoration: none;
          padding: 5px 15px;
          border-radius: 4px;
          background: rgba(255,255,255,0.1);
        }
        .page-navigation a:hover {
          background: rgba(255,255,255,0.2);
        }
        .component-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .component-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .component-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }
        .component-header {
          background: linear-gradient(135deg, #2a3990 0%, #4259c3 100%);
          color: white;
          padding: 15px;
        }
        .component-content {
          padding: 15px;
          min-height: 200px;
        }
        .component-footer {
          padding: 15px;
          background: #f1f3f9;
          font-size: 0.9em;
        }
        pre {
          background: #f1f3f9;
          padding: 10px;
          border-radius: 4px;
          overflow: auto;
        }
        .controls {
          margin-bottom: 20px;
        }
        .control-group {
          margin-bottom: 10px;
        }
        .btn {
          background: #4259c3;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn:hover {
          background: #2a3990;
        }
        select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>CyberCore Component Preview</h1>
        <p>Interactive preview of quantum-themed components</p>
      </header>

      <div class="page-navigation">
        <a href="/">Component Demo</a>
        <a href="/voidbloom">VoidBloom Homepage</a>
      </div>

      <div class="controls">
        <div class="control-group">
          <label for="profile">Mutation Profile:</label>
          <select id="profile" onchange="changeMutationProfile(this.value)">
            <option value="CyberLotus">CyberLotus</option>
            <option value="ObsidianBloom">ObsidianBloom</option>
            <option value="VoidBloom">VoidBloom</option>
            <option value="NeonVortex">NeonVortex</option>
          </select>
          <button class="btn" onclick="triggerMutation()">Apply Mutation</button>
        </div>
      </div>

      <div class="component-grid">
        <!-- Hologram Component -->
        <div class="component-card">
          <div class="component-header">
            <h2>Hologram Component</h2>
          </div>
          <div class="component-content">
            <div id="hologram-container" style="height: 200px;">
              <cart-preview-hologram product-id="1001"
                profile="CyberLotus" autorotate="true"
                model-url="/assets/models/cube.glb"></cart-preview-hologram>
            </div>
          </div>
          <div class="component-footer">
            <pre>&lt;cart-preview-hologram
  product-id="1001"
  profile="CyberLotus"
  autorotate="true"&gt;
&lt;/cart-preview-hologram&gt;</pre>
          </div>
        </div>

        <!-- Glitch Effect -->
        <div class="component-card">
          <div class="component-header">
            <h2>Glitch Effect</h2>
          </div>
          <div class="component-content">
            <div id="glitch-demo" style="position: relative; height: 200px;">
              <div id="glitch-target" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; font-weight: bold;">
                CyberCore Quantum
              </div>
              <button class="btn" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);" onclick="triggerGlitch()">Glitch!</button>
            </div>
          </div>
          <div class="component-footer">
            <pre>glitchEngine.pulse({
  intensity: 0.8,
  duration: 800
});</pre>
          </div>
        </div>

        <!-- Quantum Visualizer -->
        <div class="component-card">
          <div class="component-header">
            <h2>Quantum Visualizer</h2>
          </div>
          <div class="component-content">
            <div id="visualizer-container" style="height: 200px; position: relative;">
              <!-- Quantum Visualizer will be initialized here -->
            </div>
          </div>
          <div class="component-footer">
            <pre>QuantumVisualizer.init(
  document.getElementById('visualizer-container'),
  { showNoise: true }
);</pre>
          </div>
        </div>

        <!-- Neural Bus Events -->
        <div class="component-card">
          <div class="component-header">
            <h2>Neural Bus Events</h2>
          </div>
          <div class="component-content">
            <div id="neural-bus-demo">
              <button class="btn" onclick="publishEvent('test:event', { value: Math.random() })">Publish Event</button>
              <div id="event-log" style="height: 150px; overflow-y: auto; margin-top: 10px; padding: 10px; background: #f1f3f9; border-radius: 4px;">
                <div>Event log...</div>
              </div>
            </div>
          </div>
          <div class="component-footer">
            <pre>NeuralBus.publish('test:event', {
  value: Math.random()
});</pre>
          </div>
        </div>
      </div>

      <script src="/assets/neural-bus.js"></script>
      <script src="/assets/glitch-engine.js"></script>
      <script src="/assets/quantum-visualizer.js"></script>
      <script src="/assets/hologram-component.js"></script>

      <script>
        // Initialize components when everything is loaded
        window.addEventListener('DOMContentLoaded', () => {
          // Make sure NeuralBus is initialized
          if (window.NeuralBus && !window.NeuralBus.events) {
            window.NeuralBus.initialize();
          }

          // Initialize Glitch Engine
          window.glitchEngine = new GlitchEngine({
            targetSelector: '#glitch-target',
            intensity: 0.5,
            autoStart: false
          });

          // Initialize Quantum Visualizer
          if (window.QuantumVisualizer) {
            QuantumVisualizer.init(
              document.getElementById('visualizer-container'),
              {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                gridColor: 'rgba(0, 255, 204, 0.3)',
                showNoise: true,
                gridSize: 30
              }
            );
          }

          // Set up Neural Bus event logging
          if (window.NeuralBus) {
            NeuralBus.subscribe('test:event', (data) => {
              logEvent('test:event: ' + JSON.stringify(data));
            });

            NeuralBus.subscribe('glitch:started', (data) => {
              logEvent('glitch:started: ' + JSON.stringify(data));
            });

            NeuralBus.subscribe('glitch:stopped', (data) => {
              logEvent('glitch:stopped: ' + JSON.stringify(data));
            });

            NeuralBus.subscribe('quantum:mutation', (data) => {
              logEvent('quantum:mutation: ' + JSON.stringify(data));
            });
          }
        });

        // Function to trigger glitch effect
        function triggerGlitch() {
          if (window.glitchEngine) {
            window.glitchEngine.pulse({
              intensity: 0.8,
              duration: 800
            });
          }
        }

        // Function to publish neural bus event
        function publishEvent(eventName, data) {
          if (window.NeuralBus) {
            NeuralBus.publish(eventName, data);
            logEvent('Published: ' + eventName);
          }
        }

        // Function to log events
        function logEvent(message) {
          const eventLog = document.getElementById('event-log');
          const entry = document.createElement('div');
          const timestamp = new Date().toISOString().substr(11, 8);
          entry.textContent = timestamp + ': ' + message;
          eventLog.prepend(entry);
        }

        // Function to change mutation profile
        function changeMutationProfile(profile) {
          document.querySelectorAll('cart-preview-hologram').forEach(hologram => {
            hologram.setAttribute('profile', profile);
          });
        }

        // Function to trigger mutation
        function triggerMutation() {
          const profile = document.getElementById('profile').value;
          publishEvent('quantum:mutation', {
            profile,
            timestamp: Date.now(),
            source: 'preview-server'
          });

          // Also trigger a glitch for visual feedback
          triggerGlitch();
        }
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`
┌───────────────────────────────────────────────────┐
│                                                   │
│   CyberCore Preview Server running on port ${port}    │
│                                                   │
│   Open http://localhost:${port} in your browser     │
│                                                   │
└───────────────────────────────────────────────────┘
  `);
});
