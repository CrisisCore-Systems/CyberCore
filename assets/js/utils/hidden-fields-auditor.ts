/**
 * HIDDEN-FIELDS-AUDITOR.TS
 * Utility for auditing hidden form fields for potential security risks
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 * @Date: April 26, 2025
 */

/**
 * Interface for an audited field with risk assessment
 */
interface AuditedField {
  form: string; // Form ID or name
  name: string; // Field name
  value: string; // Field value (may be partially masked for sensitive data)
  riskLevel: RiskLevel; // Assessed risk level
  issues: string[]; // Identified potential issues
}

/**
 * Risk level enumeration
 */
enum RiskLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Sensitive field patterns to check
 */
const SENSITIVE_FIELD_PATTERNS = [
  { pattern: /pass(word)?/i, riskLevel: RiskLevel.HIGH, message: 'Password found in hidden field' },
  {
    pattern: /token|api[-_]?key/i,
    riskLevel: RiskLevel.MEDIUM,
    message: 'API token or key found in hidden field',
  },
  {
    pattern: /secret/i,
    riskLevel: RiskLevel.MEDIUM,
    message: 'Secret value found in hidden field',
  },
  {
    pattern: /credit[-_]?card|cc[-_]?(num|number)/i,
    riskLevel: RiskLevel.CRITICAL,
    message: 'Credit card information found in hidden field',
  },
  {
    pattern: /ssn|social[-_]?security/i,
    riskLevel: RiskLevel.CRITICAL,
    message: 'Social security number found in hidden field',
  },
  {
    pattern: /account[-_]?(id|number)/i,
    riskLevel: RiskLevel.HIGH,
    message: 'Account number found in hidden field',
  },
  {
    pattern: /auth/i,
    riskLevel: RiskLevel.MEDIUM,
    message: 'Authentication data found in hidden field',
  },
  {
    pattern: /session/i,
    riskLevel: RiskLevel.MEDIUM,
    message: 'Session information found in hidden field',
  },
  {
    pattern: /@[\w.-]+\.\w{2,}/i,
    riskLevel: RiskLevel.MEDIUM,
    message: 'Email address found in hidden field',
  },
  {
    pattern: /[^a-zA-Z0-9]/,
    riskLevel: RiskLevel.LOW,
    message: 'Special characters found in value',
  },
  { pattern: /^(https?:)?\/\//, riskLevel: RiskLevel.MEDIUM, message: 'URL found in hidden field' },
];

/**
 * Expected/whitelisted CSRF token field names
 */
const CSRF_FIELD_NAMES = [
  'x-voidbloom-csrf-token',
  'X-CSRF-Token',
  'csrf_token',
  'csrfmiddlewaretoken',
  '_token',
];

/**
 * HiddenFieldsAuditor class for scanning and auditing hidden form fields
 */
export class HiddenFieldsAuditor {
  // Singleton instance
  private static instance: HiddenFieldsAuditor;

  // Debug mode
  private debugMode = false;

  // List of audited fields
  private auditedFields: AuditedField[] = [];

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): HiddenFieldsAuditor {
    if (!HiddenFieldsAuditor.instance) {
      HiddenFieldsAuditor.instance = new HiddenFieldsAuditor();
    }
    return HiddenFieldsAuditor.instance;
  }

  /**
   * Set debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Audit all hidden fields in the document
   * @returns Array of audited fields with risk assessment
   */
  public auditAllHiddenFields(): AuditedField[] {
    // Reset audit results
    this.auditedFields = [];

    // Get all forms in the document
    const forms = document.querySelectorAll('form');

    forms.forEach((form) => {
      this.auditFormHiddenFields(form as HTMLFormElement);
    });

    // Log results in debug mode
    if (this.debugMode) {
      console.log('[HiddenFieldsAuditor] Audit completed:', this.auditedFields);
    }

    return this.auditedFields;
  }

  /**
   * Audit hidden fields in a specific form
   * @param form Form to audit
   * @returns Array of audited fields in this form
   */
  public auditFormHiddenFields(form: HTMLFormElement): AuditedField[] {
    if (!form) return [];

    // Get form identifier
    const formId = form.id || form.name || 'unknown-form';

    // Get all hidden inputs in the form
    const hiddenFields = form.querySelectorAll('input[type="hidden"]');

    // Create or get form-specific results array
    const formResults: AuditedField[] = [];

    // Audit each hidden field
    hiddenFields.forEach((field) => {
      const name = field.getAttribute('name') || 'unnamed-field';
      const value = field.value || '';
      const issues: string[] = [];
      let highestRiskLevel: RiskLevel = RiskLevel.NONE;

      // Skip CSRF token fields (these are expected and necessary)
      if (CSRF_FIELD_NAMES.includes(name)) {
        // Validate that it has a proper value though
        if (!value || value.length < 16) {
          issues.push('CSRF token is missing or too short');
          highestRiskLevel = RiskLevel.HIGH;
        }
      } else {
        // Check the field against sensitive patterns
        SENSITIVE_FIELD_PATTERNS.forEach((check) => {
          if (check.pattern.test(name) || check.pattern.test(value)) {
            issues.push(check.message);
            if (check.riskLevel > highestRiskLevel) {
              highestRiskLevel = check.riskLevel;
            }
          }
        });

        // Check for unusually long values (could be serialized data, encoded content, etc.)
        if (value.length > 500) {
          issues.push('Unusually long value (possible serialized data)');
          if (highestRiskLevel < RiskLevel.MEDIUM) {
            highestRiskLevel = RiskLevel.MEDIUM;
          }
        }
      }

      // Create audit result
      const result: AuditedField = {
        form: formId,
        name: name,
        // Mask potentially sensitive values in the report
        value: this.maskSensitiveValue(value, highestRiskLevel),
        riskLevel: highestRiskLevel,
        issues: issues,
      };

      // Add to results
      formResults.push(result);
      this.auditedFields.push(result);
    });

    return formResults;
  }

  /**
   * Mask potentially sensitive values for reporting
   * @param value Value to mask
   * @param riskLevel Risk level of the field
   * @returns Masked value for reporting
   */
  private maskSensitiveValue(value: string, riskLevel: RiskLevel): string {
    if (!value) return '';

    // For high risk or critical values, mask most of the value
    if (riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.CRITICAL) {
      if (value.length <= 4) {
        return '****';
      }
      return value.substring(0, 2) + '****' + value.substring(value.length - 2);
    }

    // For medium risk, show a bit more
    if (riskLevel === RiskLevel.MEDIUM) {
      if (value.length <= 6) {
        return value.substring(0, 2) + '****';
      }
      return value.substring(0, 3) + '****' + value.substring(value.length - 3);
    }

    // For low or no risk, return full value or truncate if very long
    if (value.length > 50) {
      return value.substring(0, 47) + '...';
    }

    return value;
  }

  /**
   * Get high risk fields only
   * @returns Array of high and critical risk fields
   */
  public getHighRiskFields(): AuditedField[] {
    return this.auditedFields.filter(
      (field) => field.riskLevel === RiskLevel.HIGH || field.riskLevel === RiskLevel.CRITICAL
    );
  }

  /**
   * Generate a report of all audited fields
   * @param includeValues Whether to include values in the report
   * @returns HTML report of audited fields
   */
  public generateReport(includeValues: boolean = false): string {
    let report = '<h2>Hidden Fields Audit Report</h2>';

    if (this.auditedFields.length === 0) {
      report += '<p>No hidden fields found.</p>';
      return report;
    }

    // Group by risk level
    const criticalFields = this.auditedFields.filter((f) => f.riskLevel === RiskLevel.CRITICAL);
    const highFields = this.auditedFields.filter((f) => f.riskLevel === RiskLevel.HIGH);
    const mediumFields = this.auditedFields.filter((f) => f.riskLevel === RiskLevel.MEDIUM);
    const lowFields = this.auditedFields.filter((f) => f.riskLevel === RiskLevel.LOW);
    const noRiskFields = this.auditedFields.filter((f) => f.riskLevel === RiskLevel.NONE);

    // Add summary
    report += `
      <div class="audit-summary">
        <p>Total hidden fields: <strong>${this.auditedFields.length}</strong></p>
        <ul>
          <li>Critical Risk: <strong>${criticalFields.length}</strong></li>
          <li>High Risk: <strong>${highFields.length}</strong></li>
          <li>Medium Risk: <strong>${mediumFields.length}</strong></li>
          <li>Low Risk: <strong>${lowFields.length}</strong></li>
          <li>No Risk: <strong>${noRiskFields.length}</strong></li>
        </ul>
      </div>
    `;

    // Generate tables for each risk level
    if (criticalFields.length > 0) {
      report += this.generateRiskTable('Critical Risk Fields', criticalFields, includeValues);
    }

    if (highFields.length > 0) {
      report += this.generateRiskTable('High Risk Fields', highFields, includeValues);
    }

    if (mediumFields.length > 0) {
      report += this.generateRiskTable('Medium Risk Fields', mediumFields, includeValues);
    }

    if (lowFields.length > 0) {
      report += this.generateRiskTable('Low Risk Fields', lowFields, includeValues);
    }

    if (noRiskFields.length > 0) {
      report += this.generateRiskTable('No Risk Fields', noRiskFields, includeValues);
    }

    return report;
  }

  /**
   * Generate an HTML table for a given risk level
   * @param title Title of the table
   * @param fields Fields to include in the table
   * @param includeValues Whether to include values in the table
   * @returns HTML table as a string
   */
  private generateRiskTable(title: string, fields: AuditedField[], includeValues: boolean): string {
    let table = `
      <div class="audit-section">
        <h3>${title}</h3>
        <table class="audit-table">
          <thead>
            <tr>
              <th>Form</th>
              <th>Field Name</th>
              ${includeValues ? '<th>Value</th>' : ''}
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
    `;

    fields.forEach((field) => {
      table += `
        <tr>
          <td>${field.form}</td>
          <td>${field.name}</td>
          ${includeValues ? `<td>${field.value}</td>` : ''}
          <td>${field.issues.join('<br>')}</td>
        </tr>
      `;
    });

    table += `
          </tbody>
        </table>
      </div>
    `;

    return table;
  }
}

// Export singleton instance
export const hiddenFieldsAuditor = HiddenFieldsAuditor.getInstance();
export default hiddenFieldsAuditor;
