import {
  Badge,
  Banner,
  BlockStack,
  Divider,
  extension,
  Grid,
  Heading,
  InlineStack,
  Text,
  useApi,
  useApplyMetafieldsChange,
  useCartLines,
  useMetafields,
  useSettings,
} from '@shopify/checkout-ui-extensions-react';

// Quantum Flow Checkout Extension
// This extension enhances the checkout experience with trauma-based aesthetics,
// coherence monitoring, and quantum effects

export default extension(
  'Checkout::Dynamic::Render',
  (root, { extensionPoint, applyMetafieldChange, i18n, metafields, settings }) => {
    // Render the extension
    root.render(<QuantumFlowExtension />);
  }
);

function QuantumFlowExtension() {
  // Access cart lines to display quantum effects on products
  const cartLines = useCartLines();

  // Access metafields for trauma encodings and coherence state
  const traumaMetafields = useMetafields();
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Access Shopify's API for validating prices and performing server-side operations
  const { shop } = useApi();

  // Get extension settings from Shopify admin
  const { data: extensionSettings } = useSettings();

  // Extract the active profile from settings or default to VoidBloom
  const activeProfile = extensionSettings?.activeProfile || 'VoidBloom';

  // Extract the quantum intensity from settings or default
  const quantumIntensity = extensionSettings?.quantumIntensity || 0.7;

  // Calculate customer's trauma affinity based on cart contents and history
  function calculateTraumaAffinity() {
    if (!cartLines || cartLines.length === 0) return [];

    // Count occurrences of each trauma type in cart
    const traumaCounts = {
      abandonment: 0,
      fragmentation: 0,
      surveillance: 0,
      recursion: 0,
      displacement: 0,
      dissolution: 0,
    };

    // Process each cart line to extract trauma types
    cartLines.forEach((line) => {
      const productTrauma = line.merchandise.product.metafields?.find(
        (m) => m.namespace === 'voidbloom_trauma_private' && m.key === 'encoding'
      );

      if (productTrauma && productTrauma.value) {
        try {
          const traumaData = JSON.parse(productTrauma.value);
          if (traumaData.primary_type && traumaCounts[traumaData.primary_type] !== undefined) {
            traumaCounts[traumaData.primary_type] += line.quantity;
          }
          if (traumaData.secondary_type && traumaCounts[traumaData.secondary_type] !== undefined) {
            traumaCounts[traumaData.secondary_type] += line.quantity * 0.5;
          }
        } catch (e) {
          console.error('Error parsing trauma encoding:', e);
        }
      }
    });

    // Convert to array sorted by count
    return Object.entries(traumaCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Calculate coherence score based on cart composition
  function calculateCoherenceScore() {
    if (!cartLines || cartLines.length === 0) return 1.0;

    const traumaAffinity = calculateTraumaAffinity();
    if (traumaAffinity.length === 0) return 1.0;

    // If one trauma type dominates, coherence is higher
    const primaryCount = traumaAffinity[0].count;
    const totalCount = traumaAffinity.reduce((sum, t) => sum + t.count, 0);

    if (totalCount === 0) return 1.0;

    // Coherence is higher when cart focused on one trauma type
    const dominanceRatio = primaryCount / totalCount;

    // Apply quantum randomness factor (subtle variations)
    const quantumFactor = 0.95 + Math.random() * 0.1;

    return Math.min(dominanceRatio * quantumFactor, 1.0);
  }

  // Apply trauma-based styling
  function getProfileStyles() {
    switch (activeProfile) {
      case 'CyberLotus':
        return {
          primary: '#00ffff',
          secondary: '#0088ff',
          accent: '#80ffff',
          background: '#001a33',
        };
      case 'ObsidianBloom':
        return {
          primary: '#ff00ff',
          secondary: '#8800ff',
          accent: '#ff80ff',
          background: '#330033',
        };
      case 'VoidBloom':
        return {
          primary: '#9900ff',
          secondary: '#6600cc',
          accent: '#cc80ff',
          background: '#1a0033',
        };
      case 'NeonVortex':
        return {
          primary: '#00ff66',
          secondary: '#00cc44',
          accent: '#80ffaa',
          background: '#003319',
        };
      default:
        return {
          primary: '#00ffff',
          secondary: '#0088ff',
          accent: '#80ffff',
          background: '#001a33',
        };
    }
  }

  // Format coherence level for display
  function formatCoherence(score) {
    if (score >= 0.8) return 'High';
    if (score >= 0.5) return 'Medium';
    return 'Low';
  }

  // Get color for coherence level
  function getCoherenceColor(score) {
    if (score >= 0.8) return '#40f7b4'; // high
    if (score >= 0.5) return '#ffcc66'; // medium
    return '#ff5277'; // low
  }

  const styles = getProfileStyles();
  const coherenceScore = calculateCoherenceScore();
  const traumaAffinity = calculateTraumaAffinity();
  const dominantTrauma = traumaAffinity.length > 0 ? traumaAffinity[0].type : null;

  // Save updated coherence state to metafields
  React.useEffect(() => {
    if (coherenceScore && dominantTrauma) {
      applyMetafieldsChange({
        type: 'updateMetafield',
        namespace: 'voidbloom_coherence_state',
        key: 'metrics',
        valueType: 'json',
        value: JSON.stringify({
          coherence_score: coherenceScore,
          dominant_trauma: dominantTrauma,
          profile: activeProfile,
          timestamp: new Date().toISOString(),
        }),
      });
    }
  }, [coherenceScore, dominantTrauma, activeProfile]);

  return (
    <BlockStack spacing="loose">
      <Banner
        status="info"
        title="Quantum Flow Active"
        style={{
          backgroundColor: styles.background,
          borderColor: styles.primary,
          color: 'white',
        }}
      >
        <BlockStack spacing="tight">
          <Text>Your cart has been quantum-entangled with {activeProfile} profile.</Text>
          {dominantTrauma && (
            <InlineStack spacing="tight" alignment="center">
              <Text>Dominant trauma affinity:</Text>
              <Badge
                tone={
                  dominantTrauma === 'abandonment'
                    ? 'info'
                    : dominantTrauma === 'fragmentation'
                    ? 'warning'
                    : dominantTrauma === 'surveillance'
                    ? 'success'
                    : dominantTrauma === 'recursion'
                    ? 'critical'
                    : dominantTrauma === 'displacement'
                    ? 'new'
                    : 'attention'
                }
              >
                {dominantTrauma.toUpperCase()}
              </Badge>
            </InlineStack>
          )}
          <InlineStack spacing="tight" alignment="center">
            <Text>Coherence level:</Text>
            <Text style={{ color: getCoherenceColor(coherenceScore) }}>
              {formatCoherence(coherenceScore)}
            </Text>
          </InlineStack>
        </BlockStack>
      </Banner>

      {traumaAffinity.length > 0 && traumaAffinity[0].count > 0 && (
        <BlockStack spacing="tight">
          <Heading>Trauma Affinity Spectrum</Heading>
          <Grid columns={['20%', '60%', '20%']} spacing="none">
            <Text>Type</Text>
            <Text>Intensity</Text>
            <Text>Score</Text>
          </Grid>
          {traumaAffinity.map((trauma) => (
            <Grid columns={['20%', '60%', '20%']} spacing="tight" key={trauma.type}>
              <Text>{trauma.type}</Text>
              <div
                style={{
                  height: '12px',
                  background: `linear-gradient(to right, ${styles.primary}, ${styles.secondary})`,
                  width: `${Math.min(trauma.count * 15, 100)}%`,
                  borderRadius: '6px',
                }}
              />
              <Text>{trauma.count.toFixed(1)}</Text>
            </Grid>
          ))}
          <Divider />
        </BlockStack>
      )}
    </BlockStack>
  );
}
