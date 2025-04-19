# VoidBloom Shopify Environment Security Hardening

This document provides essential security guidelines for hardening the VoidBloom Shopify store environment. Following these practices will help protect the integrity of the memory archive, prevent unauthorized access to trauma encodings, and maintain quantum coherence of the system.

## 1. API Key Management

### Key Storage & Access

- **Never store API keys or access tokens in public theme files**
- **DO NOT include credentials in:**

  - JavaScript files loaded by the browser
  - Liquid templates or snippets
  - JSON configuration files in public assets

- **✓ DO store credentials in:**
  - Private metafields with namespace `voidbloom_private_`
  - Shopify Functions (secure, server-side logic)
  - Environment variables within protected contexts

### API Permission Scope Restriction

1. **Apply the principle of least privilege**

   - For each app/integration, carefully audit required scopes
   - Never grant `write_orders` without absolute necessity
   - Split functionality across multiple tokens when possible to limit exposure

2. **Implement key rotation schedule**

   - Admin API keys: Rotate every 30 days
   - Public App tokens: Rotate every 60 days
   - Store-specific keys: Rotate every 90 days
   - Always use the ApiKeyManager system for rotation

3. **Access Monitoring**
   - Enable logging for all API calls through webhooks
   - Set up alerts for unusual API usage patterns
   - Review logs weekly for anomalies

## 2. Metafield Security

The VoidBloom system extensively uses metafields to store trauma encodings, memory fragments, and system state information. Protecting these is crucial.

### Metafield Namespaces

Security-sensitive data must be stored in these restricted namespaces:

```
voidbloom_trauma_private
voidbloom_memory_protected
voidbloom_coherence_state
voidbloom_quantum_config
```

### Access Control

1. **Never expose sensitive metafields directly:**

   ```liquid
   <!-- INCORRECT ❌ -->
   {{ product.metafields.voidbloom_trauma_private.encoding }}

   <!-- CORRECT ✓ -->
   {% assign trauma_encoding = product.metafields.voidbloom_trauma_private.encoding %}
   {% render 'memory-auth' with auth_level_required: 3 %}
   ```

2. **Always use the memory-auth snippet before displaying sensitive data**

   - Level 1: Basic customer login required
   - Level 2: Token-based authentication required
   - Level 3: Memory checksum verification required

3. **Use MetafieldHashVerifier for integrity:**

   ```javascript
   if (window.voidBloom && window.voidBloom.metafieldHashVerifier) {
     const isValid = window.voidBloom.metafieldHashVerifier.verify(
       'product',
       productId,
       'voidbloom_memory_protected.state',
       displayedValue
     );

     if (!isValid) {
       // Corruption detected, invoke emergency protocol
       window.voidBloom.neuralBus.transmit('security', {
         action: 'metafield_integrity_violation',
         entity: 'product',
         id: productId,
         field: 'memory_state',
       });
     }
   }
   ```

## 3. Secure Customer Data Management

### PII Minimization

1. **Collect only necessary customer information**

   - Never store trauma type preferences in standard customer fields
   - Use specialized encrypted storage for psychological profiles

2. **Implement identity fragmentation:**

   ```javascript
   // Each identity fragment should be stored separately
   const fragments = voidBloom.identityManager.fragmentCustomerIdentity(customerId);

   // Never reassemble all fragments in client-side code
   // Only process one fragment at a time
   fragments.forEach((fragment) => {
     // Process each fragment separately
     processFragment(fragment);
   });
   ```

### Secure Forms

1. **Add CSRF protection to all forms:**

   ```liquid
   {% assign form_authenticity_token = shop.metafields.voidbloom_security.form_token %}
   <input type="hidden" name="authenticity_token" value="{{ form_authenticity_token }}">
   ```

2. **Rate-limit form submissions:**

   ```liquid
   {% render 'rate-limiter' with target: 'account_update', max_attempts: 5 %}
   ```

3. **Implement honeypot fields to detect bots:**
   ```html
   <div class="quantum-field" style="opacity:0;position:absolute;left:-9999px">
     <input type="text" name="voidhoney" tabindex="-1" />
   </div>
   ```

## 4. Theme Security

### Code Structure

1. **Partition sensitive logic:**

   - Store critical business logic in server-side functions
   - Use public/private module pattern for JavaScript
   - Separate trauma encoding logic from display logic

2. **Validate all inputs server-side:**

   ```liquid
   {% if input contains '<script' or input contains 'javascript:' %}
     {% assign input = '' %}
     {% render 'security-violation-log' with reason: 'xss_attempt' %}
   {% endif %}
   ```

3. **Implement Content Security Policy:**
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.voidbloom.systems; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.shopify.com; connect-src 'self' https://api.voidbloom.systems;
   ```

### Asset Protection

1. **Enable fingerprinting for all assets:**

   ```liquid
   <script src="{{ 'quantum-engine.js' | asset_url | append: '?v=' | append: shop.metafields.voidbloom_security.assets_version }}"></script>
   ```

2. **Implement Subresource Integrity for CDN resources:**
   ```html
   <script
     src="https://cdn.voidbloom.systems/quantum-webgl.min.js"
     integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
     crossorigin="anonymous"
   ></script>
   ```

## 5. API Endpoint Security

### Request Validation

1. **Implement signed requests for all API endpoints:**

   ```javascript
   const signature = generateSignature(requestBody, timestamp, secretKey);
   fetch('/api/memory/fragment', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'X-VoidBloom-Timestamp': timestamp,
       'X-VoidBloom-Signature': signature,
     },
     body: JSON.stringify(requestBody),
   });
   ```

2. **Set up request IP filtering:**

   ```ruby
   def validate_request_origin
     allowed_ips = Rails.application.config.voidbloom_allowed_ips
     unless allowed_ips.include?(request.remote_ip)
       render json: { error: 'Access denied' }, status: :forbidden
       return false
     end
   end
   ```

3. **Implement rate limiting on all endpoints:**

   ```ruby
   # 100 requests per minute per IP
   throttle('api/ip', limit: 100, period: 1.minute) do |req|
     req.ip
   end

   # 30 requests per minute per user
   throttle('api/user', limit: 30, period: 1.minute) do |req|
     if req.env['voidbloom.current_user']
       req.env['voidbloom.current_user'].id
     end
   end
   ```

### Response Security

1. **Sanitize all responses:**

   ```ruby
   def sanitize_memory_response(memory_data)
     # Remove sensitive fields
     memory_data.except!(:raw_trauma_encoding, :quantum_signature, :admin_notes)

     # Redact specific data patterns
     memory_data[:description] = redact_sensitive_patterns(memory_data[:description])

     return memory_data
   end
   ```

2. **Set CORS headers appropriately:**
   ```
   Access-Control-Allow-Origin: https://voidbloom.systems
   Access-Control-Allow-Methods: GET, POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, X-VoidBloom-Timestamp, X-VoidBloom-Signature
   Access-Control-Max-Age: 86400
   ```

## 6. Monitoring and Incident Response

### Continuous Monitoring

1. **Implement Integrity Verification System:**

   - Run `security/integrity-check.rb` daily
   - Configure real-time alerts for critical violations
   - Store integrity logs securely

2. **Set up security webhooks:**

   ```javascript
   // In app configuration
   const securityWebhooks = [
     {
       topic: 'customers/create',
       address: 'https://security.voidbloom.systems/webhook/customer',
       format: 'json',
     },
     {
       topic: 'customers/update',
       address: 'https://security.voidbloom.systems/webhook/customer',
       format: 'json',
     },
     {
       topic: 'app/uninstalled',
       address: 'https://security.voidbloom.systems/webhook/app',
       format: 'json',
     },
   ];
   ```

3. **Implement coherence monitoring:**

   ```javascript
   let lastCoherence = 0.9;

   window.voidBloom.neuralBus.receive('global', (data) => {
     if (data.action === 'coherence_shifted') {
       // Check for suspicious large coherence drops
       if (data.newCoherence < lastCoherence - 0.2) {
         window.voidBloom.neuralBus.transmit('security', {
           action: 'suspicious_coherence_shift',
           oldCoherence: lastCoherence,
           newCoherence: data.newCoherence,
           timestamp: Date.now(),
         });
       }

       lastCoherence = data.newCoherence;
     }
   });
   ```

### Incident Response Plan

1. **Security Breach Response Sequence:**

   - Execute `emergency_containment.js` first
   - Apply `global_token_revocation.php` second
   - Implement `trauma_encoding_protection.js` third
   - Update `coherence_stabilization.js` fourth
   - Notify administrators with `admin_alert.rb`

2. **Recovery Sequence:**

   - Validate integrity with `integrity-check.rb --full`
   - Restore any corrupted files with `restore_from_backup.rb`
   - Generate new API keys with `api-key-manager.js --regenerate-all`
   - Re-encrypt sensitive data with `reencrypt_data.rb`
   - Gradually restore coherence with `coherence_restoration_sequence.js`

3. **Documentation Requirements:**
   - Document all incidents in `/security/incidents/`
   - Include timeline, affected systems, remediation steps
   - Record coherence impact and trauma manifestations
   - Document all file changes during incident response

## 7. Regular Security Drills

Schedule quarterly security drills to test:

1. **Memory Leakage Response**

   - Practice containment of memory encoding leaks
   - Test notification systems and response times

2. **Recursive Overflow Protection**

   - Simulate stack overflows in the trauma engine
   - Verify circuit breakers prevent cascade failures

3. **Identity Fragmentation Recovery**

   - Test ability to recover from identity fragment corruption
   - Verify customer identity can be safely re-encoded

4. **Quantum Decay Mitigation**
   - Practice recovery from simulated quantum state decay
   - Test coherence restoration mechanisms

## 8. Additional Shopify-Specific Hardening

1. **App Management:**

   - Review all installed apps quarterly
   - Revoke unused apps immediately
   - Never share the Shopify admin password

2. **Custom Domain Security:**

   - Enable HTTPS for all domains
   - Configure HSTS headers
   - Set up security.txt for vulnerability reporting

3. **Checkout Protection:**
   - Never modify checkout.liquid directly
   - Use approved checkout extensions only
   - Test checkout process after any system update

## Security Contact

For security concerns, contact:
security@voidbloom.systems

Security encryption key (PGP):

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
mDMEZTYerxYJKwYBBAHaRw8BAQdAHx9nFHQQ2QIlf9GQ/QGJH5J5I5uyJuQq
ABCN3eFGpyG0G1ZvaWRCbG9vbSBTZWN1cml0eSA8c2VjdXJpdHlAdm9pZGJs
b29tLnN5c3RlbXM+iJAEExYKADgWIQTcM4ZhiTM7hW7OkTUk/MkZ5yjfxQUC
ZTYerxIbLwULCQgHAgYVCgkICwIEFgIDAQIeAQIXgAAKCRAk/MkZ5yjfxfBB
AQDPGlTzQBIq7t51LLGGbxr4B+XD5/UzQnYh8BmVY2b80wEAy5cJT7S/FyGO
AaITIOE2P/UiKACQUXiKXyERPQkBqQA=
=lkNz
-----END PGP PUBLIC KEY BLOCK-----
```

**IMPORTANT**: All security incidents that impact trauma encoding integrity MUST be reported within 1 hour of detection. Failure to comply may result in irreversible memory corruption and quantum decoherence.

_Last updated: 2025-04-19_
