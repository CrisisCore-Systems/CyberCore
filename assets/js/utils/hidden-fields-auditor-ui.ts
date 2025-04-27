/**
 * HIDDEN-FIELDS-AUDITOR-UI.TS
 * UI component for auditing hidden form fields
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 * @Date: April 26, 2025
 */

import { hiddenFieldsAuditor } from './hidden-fields-auditor';

/**
 * CSS styles for the auditor UI
 */
const AUDITOR_STYLES = `
  .hidden-fields-auditor {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #333;
    border-radius: 50%;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 99999;
    transition: all 0.3s ease;
    font-family: sans-serif;
    font-size: 24px;
  }

  .hidden-fields-auditor:hover {
    transform: scale(1.1);
    background: #444;
  }

  .auditor-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 800px;
    max-width: 90vw;
    max-height: 80vh;
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    z-index: 99999;
    display: none;
    flex-direction: column;
    font-family: sans-serif;
  }

  .auditor-panel.active {
    display: flex;
  }

  .auditor-header {
    background: #333;
    color: white;
    padding: 15px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .auditor-content {
    padding: 15px;
    overflow-y: auto;
  }

  .auditor-close {
    cursor: pointer;
    font-size: 20px;
    padding: 5px;
  }

  .auditor-refresh {
    background: #4a90e2;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }

  .auditor-summary {
    margin-bottom: 20px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .auditor-section {
    margin-bottom: 20px;
  }

  .auditor-section h3 {
    margin-top: 0;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
  }

  .audit-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }

  .audit-table th {
    background: #f0f0f0;
    text-align: left;
    padding: 8px;
  }

  .audit-table td {
    padding: 8px;
    border-bottom: 1px solid #eee;
    word-break: break-word;
  }

  .risk-critical {
    background-color: #ffdddd;
  }

  .risk-high {
    background-color: #fff0dd;
  }

  .risk-medium {
    background-color: #ffffdd;
  }

  .toggle-values {
    background: #ddd;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }
`;

/**
 * UI Component for the Hidden Fields Auditor
 */
export class HiddenFieldsAuditorUI {
  // Singleton instance
  private static instance: HiddenFieldsAuditorUI;

  // DOM elements
  private button: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private isActive = false;
  private showValues = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): HiddenFieldsAuditorUI {
    if (!HiddenFieldsAuditorUI.instance) {
      HiddenFieldsAuditorUI.instance = new HiddenFieldsAuditorUI();
    }
    return HiddenFieldsAuditorUI.instance;
  }

  /**
   * Initialize the UI
   */
  public initialize(): void {
    this.injectStyles();
    this.createButton();
    this.createPanel();
  }

  /**
   * Inject CSS styles into the document
   */
  private injectStyles(): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = AUDITOR_STYLES;
    document.head.appendChild(styleElement);
  }

  /**
   * Create the floating button
   */
  private createButton(): void {
    // Create button element
    this.button = document.createElement('div');
    this.button.className = 'hidden-fields-auditor';
    this.button.innerHTML = '🔍';
    this.button.title = 'Audit Hidden Fields';

    // Add event listener
    this.button.addEventListener('click', () => {
      this.togglePanel();
    });

    // Append to document
    document.body.appendChild(this.button);
  }

  /**
   * Create the panel for displaying audit results
   */
  private createPanel(): void {
    // Create panel element
    this.panel = document.createElement('div');
    this.panel.className = 'auditor-panel';

    // Create header
    const header = document.createElement('div');
    header.className = 'auditor-header';
    header.innerHTML = '<span>Hidden Fields Auditor</span>';

    // Create close button
    const closeButton = document.createElement('span');
    closeButton.className = 'auditor-close';
    closeButton.innerHTML = '✕';
    closeButton.addEventListener('click', () => {
      this.togglePanel(false);
    });

    // Create refresh button
    const refreshButton = document.createElement('button');
    refreshButton.className = 'auditor-refresh';
    refreshButton.innerHTML = '🔄 Refresh';
    refreshButton.addEventListener('click', () => {
      this.refreshAudit();
    });

    // Create toggle values button
    const toggleValuesButton = document.createElement('button');
    toggleValuesButton.className = 'toggle-values';
    toggleValuesButton.innerHTML = '👁️ Show Values';
    toggleValuesButton.addEventListener('click', () => {
      this.showValues = !this.showValues;
      toggleValuesButton.innerHTML = this.showValues ? '👁️ Hide Values' : '👁️ Show Values';
      this.refreshAudit();
    });

    // Add buttons to header
    header.appendChild(toggleValuesButton);
    header.appendChild(refreshButton);
    header.appendChild(closeButton);

    // Create content area
    const content = document.createElement('div');
    content.className = 'auditor-content';

    // Add initial content
    content.innerHTML = '<p>Click Refresh to scan the page for hidden fields.</p>';

    // Assemble panel
    this.panel.appendChild(header);
    this.panel.appendChild(content);

    // Append to document
    document.body.appendChild(this.panel);
  }

  /**
   * Toggle the panel visibility
   */
  private togglePanel(force?: boolean): void {
    if (force !== undefined) {
      this.isActive = force;
    } else {
      this.isActive = !this.isActive;
    }

    if (this.panel) {
      if (this.isActive) {
        this.panel.classList.add('active');
        this.refreshAudit();
      } else {
        this.panel.classList.remove('active');
      }
    }
  }

  /**
   * Refresh the audit results
   */
  private refreshAudit(): void {
    if (!this.panel || !this.isActive) return;

    // Get the content element
    const content = this.panel.querySelector('.auditor-content');
    if (!content) return;

    // Run the audit
    const auditResults = hiddenFieldsAuditor.auditAllHiddenFields();

    // Generate report HTML
    content.innerHTML = hiddenFieldsAuditor.generateReport(this.showValues);
  }
}

// Export singleton instance
export const hiddenFieldsAuditorUI = HiddenFieldsAuditorUI.getInstance();
export default hiddenFieldsAuditorUI;
