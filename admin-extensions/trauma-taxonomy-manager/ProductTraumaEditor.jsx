import {
  Badge,
  Banner,
  BlockStack,
  Button,
  Card,
  Grid,
  InlineStack,
  Modal,
  Select,
  Tabs,
  Text,
  TextField,
  useApi,
  useData,
  useMetafields,
} from '@shopify/admin-ui-extensions-react';
import React, { useEffect, useState } from 'react';

const TRAUMA_TYPES = [
  { value: 'abandonment', label: 'Abandonment', description: 'Fears of abandonment and isolation' },
  {
    value: 'fragmentation',
    label: 'Fragmentation',
    description: 'Dissociation and fragmented sense of self',
  },
  { value: 'surveillance', label: 'Surveillance', description: 'Monitoring and paranoia' },
  {
    value: 'recursion',
    label: 'Recursion',
    description: 'Repetitive thought patterns and behaviors',
  },
  {
    value: 'displacement',
    label: 'Displacement',
    description: 'Feelings of not belonging or being displaced',
  },
  { value: 'dissolution', label: 'Dissolution', description: 'Loss of boundaries and identity' },
];

const INTENSITY_LEVELS = [
  { value: '0.2', label: 'Subtle (0.2)' },
  { value: '0.4', label: 'Mild (0.4)' },
  { value: '0.6', label: 'Moderate (0.6)' },
  { value: '0.8', label: 'Strong (0.8)' },
  { value: '1.0', label: 'Extreme (1.0)' },
];

function ProductTraumaEditor() {
  // Get metafields
  const { data: metafields, isLoading: metafieldsLoading } = useMetafields();

  // Get product data
  const { data: productData } = useData();
  const product = productData?.product;

  // Api access
  const { updateMetafield } = useApi();

  // State for form
  const [selectedTab, setSelectedTab] = useState('details');
  const [primaryTrauma, setPrimaryTrauma] = useState('');
  const [secondaryTrauma, setSecondaryTrauma] = useState('');
  const [traumaIntensity, setTraumaIntensity] = useState('0.6');
  const [traumaNarrative, setTraumaNarrative] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [coherenceScore, setCoherenceScore] = useState(null);
  const [traumaAttributes, setTraumaAttributes] = useState({
    intensity: 0.6,
    persistence: 0.5,
    recursion: 0.5,
    dissolution: 0.5,
    fragmentation: 0.5,
  });

  // Load existing data
  useEffect(() => {
    if (metafieldsLoading || !metafields) return;

    // Find trauma encoding metafield
    const traumaMetafield = metafields.find(
      (m) => m.namespace === 'voidbloom_trauma_private' && m.key === 'encoding'
    );

    if (traumaMetafield?.value) {
      try {
        const traumaData = JSON.parse(traumaMetafield.value);
        setPrimaryTrauma(traumaData.primary_type || '');
        setSecondaryTrauma(traumaData.secondary_type || '');
        setTraumaIntensity(traumaData.intensity?.toString() || '0.6');
        setTraumaNarrative(traumaData.narrative || '');

        if (traumaData.attributes) {
          setTraumaAttributes({
            intensity: parseFloat(traumaData.intensity) || 0.6,
            persistence: traumaData.attributes.persistence || 0.5,
            recursion: traumaData.attributes.recursion || 0.5,
            dissolution: traumaData.attributes.dissolution || 0.5,
            fragmentation: traumaData.attributes.fragmentation || 0.5,
          });
        }
      } catch (e) {
        console.error('Error parsing trauma metafield:', e);
      }
    }

    // Find coherence state metafield
    const coherenceMetafield = metafields.find(
      (m) => m.namespace === 'voidbloom_coherence_state' && m.key === 'metrics'
    );

    if (coherenceMetafield?.value) {
      try {
        const coherenceData = JSON.parse(coherenceMetafield.value);
        setCoherenceScore(coherenceData.coherence_score);
      } catch (e) {
        console.error('Error parsing coherence metafield:', e);
      }
    }
  }, [metafields, metafieldsLoading]);

  // Handle form submission
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Prepare trauma data
      const traumaData = {
        primary_type: primaryTrauma,
        secondary_type: secondaryTrauma,
        intensity: parseFloat(traumaIntensity),
        narrative: traumaNarrative,
        attributes: {
          persistence: traumaAttributes.persistence,
          recursion: traumaAttributes.recursion,
          dissolution: traumaAttributes.dissolution,
          fragmentation: traumaAttributes.fragmentation,
        },
        last_modified: new Date().toISOString(),
      };

      // Update metafield
      await updateMetafield({
        namespace: 'voidbloom_trauma_private',
        key: 'encoding',
        type: 'json',
        value: JSON.stringify(traumaData),
      });

      // Show success message
      alert('Trauma taxonomy saved successfully.');
    } catch (error) {
      console.error('Error saving trauma taxonomy:', error);
      alert('Error saving trauma taxonomy. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate coherence with existing catalog
  const calculateCoherenceScore = () => {
    // In a real implementation, this would query other products
    // and calculate how well this trauma encoding fits with the overall catalog

    // For demo, generate a random coherence score that's affected by our inputs
    const base = 0.5;
    const intensity = parseFloat(traumaIntensity);
    const randomFactor = Math.random() * 0.2;

    // Calculate score - higher intensity and having both trauma types increases coherence
    let score = base;
    if (primaryTrauma && secondaryTrauma) {
      score += 0.2; // Having both primary and secondary types increases coherence
    }
    score += intensity * 0.2; // Higher intensity increases coherence
    score += randomFactor; // Add some randomness

    // Clamp between 0 and 1
    score = Math.max(0, Math.min(1, score));

    setCoherenceScore(score);
  };

  // Get badge color based on trauma type
  const getTraumaBadgeColor = (type) => {
    switch (type) {
      case 'abandonment':
        return { bg: '#3b82f6', text: 'white' };
      case 'fragmentation':
        return { bg: '#ef4444', text: 'white' };
      case 'surveillance':
        return { bg: '#10b981', text: 'white' };
      case 'recursion':
        return { bg: '#f59e0b', text: 'white' };
      case 'displacement':
        return { bg: '#8b5cf6', text: 'white' };
      case 'dissolution':
        return { bg: '#ec4899', text: 'white' };
      default:
        return { bg: '#6b7280', text: 'white' };
    }
  };

  // Get coherence badge color
  const getCoherenceBadgeColor = (score) => {
    if (score === null) return { bg: '#6b7280', text: 'white' };
    if (score >= 0.8) return { bg: '#10b981', text: 'white' };
    if (score >= 0.5) return { bg: '#f59e0b', text: 'white' };
    return { bg: '#ef4444', text: 'white' };
  };

  // Format coherence score
  const formatCoherenceScore = (score) => {
    if (score === null) return 'Unknown';
    return `${(score * 100).toFixed(1)}%`;
  };

  // Generate trauma narrative
  const generateTraumaNarrative = () => {
    if (!primaryTrauma) {
      alert('Please select a primary trauma type first.');
      return;
    }

    // In a real implementation, this would use an AI model or template system
    // For demo, use pre-written templates based on the trauma type

    const primaryType = TRAUMA_TYPES.find((t) => t.value === primaryTrauma);
    const secondaryType = TRAUMA_TYPES.find((t) => t.value === secondaryTrauma);
    const intensity = parseFloat(traumaIntensity);
    const intensityText = intensity >= 0.8 ? 'intense' : intensity >= 0.5 ? 'moderate' : 'subtle';

    let narrative = `This product embodies ${intensityText} ${primaryType?.label.toLowerCase()} trauma. `;

    switch (primaryTrauma) {
      case 'abandonment':
        narrative +=
          'The product creates a sense of isolation and longing, evoking the fear of being left behind or forgotten. ';
        break;
      case 'fragmentation':
        narrative +=
          'The fragmented nature of this product reflects a disjointed sense of self, with elements that never quite cohere into a unified whole. ';
        break;
      case 'surveillance':
        narrative +=
          'There is a persistent feeling of being observed, monitored, and evaluated when engaging with this product. ';
        break;
      case 'recursion':
        narrative +=
          'The product traps the user in repetitive thought patterns, creating loops of behavior that mirror traumatic repetition compulsion. ';
        break;
      case 'displacement':
        narrative +=
          "This product evokes the sensation of being out of place, disconnected from one's environment and sense of belonging. ";
        break;
      case 'dissolution':
        narrative +=
          'Boundaries between self and other dissolve when interacting with this product, creating a troubling loss of identity. ';
        break;
    }

    if (secondaryType) {
      narrative += `Secondary effects of ${secondaryType.label.toLowerCase()} trauma appear in more subtle ways, `;

      switch (secondaryTrauma) {
        case 'abandonment':
          narrative += 'manifesting as a quiet anxiety about being left alone with the product.';
          break;
        case 'fragmentation':
          narrative +=
            'causing moments of dissociation when the product is used for extended periods.';
          break;
        case 'surveillance':
          narrative +=
            'generating a vague paranoia that information is being collected during use.';
          break;
        case 'recursion':
          narrative += 'leading to habit-forming behaviors that are difficult to break.';
          break;
        case 'displacement':
          narrative += 'making the user feel temporarily estranged from their surroundings.';
          break;
        case 'dissolution':
          narrative += "subtly eroding the user's sense of where they end and the product begins.";
          break;
      }
    }

    setTraumaNarrative(narrative);
  };

  return (
    <Card
      title="Trauma Taxonomy Manager"
      sectioned
      primaryFooterAction={{
        content: 'Save Trauma Data',
        onAction: handleSave,
        loading: isSaving,
      }}
      secondaryFooterActions={[
        {
          content: 'Calculate Coherence',
          onAction: calculateCoherenceScore,
        },
        {
          content: 'Visualize',
          onAction: () => setIsVisualizing(true),
        },
      ]}
    >
      <Tabs
        selected={selectedTab}
        onSelect={setSelectedTab}
        tabs={[
          { id: 'details', content: 'Trauma Details' },
          { id: 'attributes', content: 'Attributes' },
          { id: 'preview', content: 'Preview' },
        ]}
      />

      {selectedTab === 'details' && (
        <BlockStack spacing="loose">
          <BlockStack spacing="tight">
            <Text variant="headingMd">Current Product: {product?.title || 'Loading...'}</Text>

            {coherenceScore !== null && (
              <InlineStack spacing="tight" alignment="center">
                <Text>Catalog Coherence:</Text>
                <Badge
                  tone={
                    coherenceScore >= 0.8
                      ? 'success'
                      : coherenceScore >= 0.5
                      ? 'warning'
                      : 'critical'
                  }
                >
                  {formatCoherenceScore(coherenceScore)}
                </Badge>
              </InlineStack>
            )}
          </BlockStack>

          <Select
            label="Primary Trauma Type"
            options={TRAUMA_TYPES.map((type) => ({ label: type.label, value: type.value }))}
            value={primaryTrauma}
            onChange={setPrimaryTrauma}
            helpText="The dominant trauma narrative for this product"
          />

          <Select
            label="Secondary Trauma Type"
            options={[
              { label: 'None', value: '' },
              ...TRAUMA_TYPES.filter((type) => type.value !== primaryTrauma).map((type) => ({
                label: type.label,
                value: type.value,
              })),
            ]}
            value={secondaryTrauma}
            onChange={setSecondaryTrauma}
            helpText="Optional secondary trauma effect"
          />

          <Select
            label="Trauma Intensity"
            options={INTENSITY_LEVELS}
            value={traumaIntensity}
            onChange={setTraumaIntensity}
            helpText="How strongly the trauma effects manifest"
          />

          <TextField
            label="Trauma Narrative"
            value={traumaNarrative}
            onChange={setTraumaNarrative}
            multiline={4}
            helpText="Description of how this product embodies the trauma taxonomy"
            connectedRight={<Button onClick={generateTraumaNarrative}>Generate</Button>}
          />
        </BlockStack>
      )}

      {selectedTab === 'attributes' && (
        <BlockStack spacing="loose">
          <Text variant="headingMd">Trauma Attributes</Text>
          <Text>Fine-tune specific aspects of the trauma encoding</Text>

          {/* Attribute sliders */}
          <Grid columns={['25%', '75%']}>
            <Text>Persistence</Text>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={traumaAttributes.persistence}
              onChange={(e) =>
                setTraumaAttributes({
                  ...traumaAttributes,
                  persistence: parseFloat(e.target.value),
                })
              }
              style={{ width: '100%' }}
            />

            <Text>Recursion</Text>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={traumaAttributes.recursion}
              onChange={(e) =>
                setTraumaAttributes({
                  ...traumaAttributes,
                  recursion: parseFloat(e.target.value),
                })
              }
              style={{ width: '100%' }}
            />

            <Text>Dissolution</Text>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={traumaAttributes.dissolution}
              onChange={(e) =>
                setTraumaAttributes({
                  ...traumaAttributes,
                  dissolution: parseFloat(e.target.value),
                })
              }
              style={{ width: '100%' }}
            />

            <Text>Fragmentation</Text>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={traumaAttributes.fragmentation}
              onChange={(e) =>
                setTraumaAttributes({
                  ...traumaAttributes,
                  fragmentation: parseFloat(e.target.value),
                })
              }
              style={{ width: '100%' }}
            />
          </Grid>

          <Banner title="Attribute Recommendations" status="info">
            <Text>
              Products with <strong>{primaryTrauma}</strong> trauma typically have higher{' '}
              {primaryTrauma === 'recursion'
                ? 'recursion'
                : primaryTrauma === 'fragmentation'
                ? 'fragmentation'
                : primaryTrauma === 'dissolution'
                ? 'dissolution'
                : 'persistence'}
              values for maximum coherence.
            </Text>
          </Banner>
        </BlockStack>
      )}

      {selectedTab === 'preview' && (
        <BlockStack spacing="loose">
          <Text variant="headingMd">Trauma Taxonomy Preview</Text>

          <Card sectioned>
            <InlineStack spacing="loose">
              <Text variant="headingSm">Primary:</Text>
              {primaryTrauma ? (
                <Badge
                  tone={
                    primaryTrauma === 'abandonment'
                      ? 'info'
                      : primaryTrauma === 'fragmentation'
                      ? 'warning'
                      : primaryTrauma === 'surveillance'
                      ? 'success'
                      : primaryTrauma === 'recursion'
                      ? 'critical'
                      : primaryTrauma === 'displacement'
                      ? 'new'
                      : 'attention'
                  }
                >
                  {TRAUMA_TYPES.find((t) => t.value === primaryTrauma)?.label.toUpperCase()}
                </Badge>
              ) : (
                <Text tone="subdued">None selected</Text>
              )}
            </InlineStack>

            <InlineStack spacing="loose">
              <Text variant="headingSm">Secondary:</Text>
              {secondaryTrauma ? (
                <Badge
                  tone={
                    secondaryTrauma === 'abandonment'
                      ? 'info'
                      : secondaryTrauma === 'fragmentation'
                      ? 'warning'
                      : secondaryTrauma === 'surveillance'
                      ? 'success'
                      : secondaryTrauma === 'recursion'
                      ? 'critical'
                      : secondaryTrauma === 'displacement'
                      ? 'new'
                      : 'attention'
                  }
                >
                  {TRAUMA_TYPES.find((t) => t.value === secondaryTrauma)?.label.toUpperCase()}
                </Badge>
              ) : (
                <Text tone="subdued">None selected</Text>
              )}
            </InlineStack>

            <Text variant="headingSm">Trauma Narrative:</Text>
            <Text>{traumaNarrative || 'No narrative generated yet.'}</Text>
          </Card>

          {/* This would be a custom visualization component */}
          <div
            style={{ height: '200px', background: '#1a1a2e', borderRadius: '8px', padding: '16px' }}
          >
            <Text variant="headingSm" color="success">
              Trauma Visualization Placeholder
            </Text>
            <Text color="subdued">
              In the actual implementation, this would contain a WebGL-based visualization of the
              trauma taxonomy using your existing quantum visualization system.
            </Text>
          </div>
        </BlockStack>
      )}

      {/* Visualization Modal */}
      {isVisualizing && (
        <Modal title="Trauma Visualization" onClose={() => setIsVisualizing(false)}>
          <Modal.Section>
            <BlockStack spacing="loose">
              <Text>
                Quantum visualizer for {product?.title || 'this product'}'s trauma taxonomy.
              </Text>

              {/* Placeholder for the visualization */}
              <div
                style={{
                  height: '300px',
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  padding: '16px',
                }}
              >
                <Text>
                  This would render a 3D visualization of the trauma taxonomy using your existing
                  quantum visualization engine.
                </Text>
              </div>

              <Button onClick={() => setIsVisualizing(false)}>Close Visualization</Button>
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </Card>
  );
}

export default ProductTraumaEditor;
