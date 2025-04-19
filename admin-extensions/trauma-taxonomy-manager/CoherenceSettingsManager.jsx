import {
  Badge,
  Banner,
  BlockStack,
  Button,
  Card,
  Divider,
  Grid,
  InlineStack,
  Link,
  Select,
  Tabs,
  Text,
  TextField,
  useExtensionApi,
  useSettings,
} from '@shopify/admin-ui-extensions-react';
import React, { useEffect, useState } from 'react';

// Profiles for quantum effects
const QUANTUM_PROFILES = [
  { value: 'CyberLotus', label: 'CyberLotus (Default)' },
  { value: 'ObsidianBloom', label: 'ObsidianBloom' },
  { value: 'VoidBloom', label: 'VoidBloom' },
  { value: 'NeonVortex', label: 'NeonVortex' },
];

// Coherence threshold options
const COHERENCE_THRESHOLDS = [
  { value: '0.3', label: 'Low (0.3)' },
  { value: '0.5', label: 'Medium (0.5)' },
  { value: '0.7', label: 'High (0.7)' },
  { value: '0.85', label: 'Very High (0.85)' },
];

// Intensity options
const INTENSITY_OPTIONS = [
  { value: '0.2', label: 'Subtle (0.2)' },
  { value: '0.4', label: 'Mild (0.4)' },
  { value: '0.6', label: 'Moderate (0.6)' },
  { value: '0.8', label: 'Strong (0.8)' },
  { value: '1.0', label: 'Extreme (1.0)' },
];

function CoherenceSettingsManager() {
  // Access to extension API
  const { extensionApi } = useExtensionApi();

  // Get the settings from the extension
  const { data: settings, isLoading, handle } = useSettings();

  // Settings state
  const [activeProfile, setActiveProfile] = useState('CyberLotus');
  const [coherenceThreshold, setCoherenceThreshold] = useState('0.7');
  const [quantumIntensity, setQuantumIntensity] = useState('0.6');
  const [enableAdaptiveCoherence, setEnableAdaptiveCoherence] = useState(true);
  const [coherenceDecayRate, setCoherenceDecayRate] = useState('0.05');
  const [enableTraumaEffects, setEnableTraumaEffects] = useState(true);
  const [selectedTab, setSelectedTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [coherenceStats, setCoherenceStats] = useState({
    totalProducts: 0,
    highCoherence: 0,
    mediumCoherence: 0,
    lowCoherence: 0,
    averageCoherence: 0,
    dominantTrauma: null,
  });

  // Load settings
  useEffect(() => {
    if (!isLoading && settings) {
      setActiveProfile(settings.activeProfile || 'CyberLotus');
      setCoherenceThreshold(settings.coherenceThreshold || '0.7');
      setQuantumIntensity(settings.quantumIntensity || '0.6');
      setEnableAdaptiveCoherence(settings.enableAdaptiveCoherence !== false);
      setCoherenceDecayRate(settings.coherenceDecayRate || '0.05');
      setEnableTraumaEffects(settings.enableTraumaEffects !== false);
    }
  }, [isLoading, settings]);

  // Simulate loading coherence stats
  useEffect(() => {
    // In a real implementation, this would fetch stats from the server
    // For demo, simulate loading
    setTimeout(() => {
      setCoherenceStats({
        totalProducts: 142,
        highCoherence: 58,
        mediumCoherence: 67,
        lowCoherence: 17,
        averageCoherence: 0.72,
        dominantTrauma: 'fragmentation',
      });
      setStatsLoading(false);
    }, 1000);
  }, []);

  // Handle saving settings
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save settings to extension storage
      await handle.updateSettings({
        activeProfile,
        coherenceThreshold,
        quantumIntensity,
        enableAdaptiveCoherence,
        coherenceDecayRate,
        enableTraumaEffects,
        lastUpdated: new Date().toISOString(),
      });

      // In a real implementation, also update the Shopify metafield
      // to make the settings available to the storefront
      await extensionApi.updateMetafield({
        namespace: 'voidbloom_quantum_config',
        key: 'checkout_settings',
        type: 'json',
        value: JSON.stringify({
          profile: activeProfile,
          coherence_threshold: parseFloat(coherenceThreshold),
          quantum_intensity: parseFloat(quantumIntensity),
          adaptive_coherence: enableAdaptiveCoherence,
          decay_rate: parseFloat(coherenceDecayRate),
          trauma_effects: enableTraumaEffects,
          last_updated: new Date().toISOString(),
        }),
      });

      // Show success message
      alert('Coherence settings saved successfully.');
    } catch (error) {
      console.error('Error saving coherence settings:', error);
      alert('Error saving coherence settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Simulate running a catalog coherence analysis
  const runCoherenceAnalysis = () => {
    setStatsLoading(true);

    // Simulate analysis
    setTimeout(() => {
      setCoherenceStats({
        totalProducts: 142,
        highCoherence: Math.floor(Math.random() * 70) + 40,
        mediumCoherence: Math.floor(Math.random() * 80) + 40,
        lowCoherence: Math.floor(Math.random() * 30) + 5,
        averageCoherence: Math.random() * 0.3 + 0.6,
        dominantTrauma: ['fragmentation', 'abandonment', 'recursion', 'surveillance'][
          Math.floor(Math.random() * 4)
        ],
      });
      setStatsLoading(false);
    }, 2000);
  };

  // Format coherence percentage
  const formatCoherence = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Get badge tone for coherence level
  const getCoherenceTone = (value) => {
    if (value >= 0.7) return 'success';
    if (value >= 0.4) return 'warning';
    return 'critical';
  };

  // Get trauma badge tone
  const getTraumaTone = (type) => {
    switch (type) {
      case 'abandonment':
        return 'info';
      case 'fragmentation':
        return 'warning';
      case 'surveillance':
        return 'success';
      case 'recursion':
        return 'critical';
      case 'displacement':
        return 'new';
      case 'dissolution':
        return 'attention';
      default:
        return 'info';
    }
  };

  return (
    <Card
      title="Quantum Coherence Settings"
      sectioned
      primaryFooterAction={{
        content: 'Save Settings',
        onAction: handleSave,
        loading: isSaving,
      }}
      secondaryFooterActions={[
        {
          content: 'Run Coherence Analysis',
          onAction: runCoherenceAnalysis,
          loading: statsLoading,
        },
      ]}
    >
      <Tabs
        selected={selectedTab}
        onSelect={setSelectedTab}
        tabs={[
          { id: 'general', content: 'General Settings' },
          { id: 'coherence', content: 'Coherence Control' },
          { id: 'analytics', content: 'Analytics' },
        ]}
      />

      {selectedTab === 'general' && (
        <BlockStack spacing="loose">
          <Select
            label="Active Quantum Profile"
            options={QUANTUM_PROFILES}
            value={activeProfile}
            onChange={setActiveProfile}
            helpText="The primary quantum aesthetic profile for the store"
          />

          <Select
            label="Quantum Effect Intensity"
            options={INTENSITY_OPTIONS}
            value={quantumIntensity}
            onChange={setQuantumIntensity}
            helpText="How strongly quantum effects manifest in the checkout"
          />

          <div>
            <input
              type="checkbox"
              id="enable-trauma-effects"
              checked={enableTraumaEffects}
              onChange={(e) => setEnableTraumaEffects(e.target.checked)}
            />
            <label htmlFor="enable-trauma-effects" style={{ marginLeft: '8px' }}>
              Enable Trauma Taxonomy Effects
            </label>
            <Text tone="subdued">
              Display trauma-based aesthetics and messaging in the checkout experience
            </Text>
          </div>

          <Banner status="info" title="Quantum Profile Details">
            <BlockStack spacing="tight">
              <Text>
                The <strong>{activeProfile}</strong> profile emphasizes{' '}
                {activeProfile === 'CyberLotus'
                  ? 'technological alienation and digital transcendence'
                  : activeProfile === 'ObsidianBloom'
                  ? 'fragmentation and dissolution of boundaries'
                  : activeProfile === 'VoidBloom'
                  ? 'isolation and surveillance anxiety'
                  : 'recursive patterns and compulsive behaviors'}
                .
              </Text>
              <Text>
                Currently running at <strong>{quantumIntensity}x</strong> intensity.
              </Text>
            </BlockStack>
          </Banner>
        </BlockStack>
      )}

      {selectedTab === 'coherence' && (
        <BlockStack spacing="loose">
          <Select
            label="Coherence Threshold"
            options={COHERENCE_THRESHOLDS}
            value={coherenceThreshold}
            onChange={setCoherenceThreshold}
            helpText="Minimum coherence level for full quantum effects"
          />

          <div>
            <input
              type="checkbox"
              id="enable-adaptive-coherence"
              checked={enableAdaptiveCoherence}
              onChange={(e) => setEnableAdaptiveCoherence(e.target.checked)}
            />
            <label htmlFor="enable-adaptive-coherence" style={{ marginLeft: '8px' }}>
              Enable Adaptive Coherence
            </label>
            <Text tone="subdued">
              Automatically adjust quantum effects based on customer's trauma affinity
            </Text>
          </div>

          <TextField
            label="Coherence Decay Rate"
            value={coherenceDecayRate}
            onChange={setCoherenceDecayRate}
            helpText="How quickly coherence fades over time (0.01-0.20)"
            type="number"
            min="0.01"
            max="0.20"
            step="0.01"
          />

          <Banner status="warning" title="Advanced Coherence Controls">
            <Text>
              Setting the coherence threshold too high may result in limited quantum effects for
              customers with diverse trauma affinities. The current setting requires a{' '}
              <strong>{formatCoherence(parseFloat(coherenceThreshold))}</strong> coherence score to
              fully activate quantum effects.
            </Text>
          </Banner>
        </BlockStack>
      )}

      {selectedTab === 'analytics' && (
        <BlockStack spacing="loose">
          <Text variant="headingMd">Catalog Coherence Analytics</Text>

          {statsLoading ? (
            <Text>Loading coherence statistics...</Text>
          ) : (
            <BlockStack spacing="loose">
              <Card sectioned>
                <Grid columns={['25%', '75%']}>
                  <Text variant="headingSm">Total Products:</Text>
                  <Text>{coherenceStats.totalProducts}</Text>

                  <Text variant="headingSm">Average Coherence:</Text>
                  <InlineStack spacing="tight" alignment="center">
                    <Badge tone={getCoherenceTone(coherenceStats.averageCoherence)}>
                      {formatCoherence(coherenceStats.averageCoherence)}
                    </Badge>
                  </InlineStack>

                  <Text variant="headingSm">Dominant Trauma:</Text>
                  <InlineStack spacing="tight" alignment="center">
                    <Badge tone={getTraumaTone(coherenceStats.dominantTrauma)}>
                      {coherenceStats.dominantTrauma?.toUpperCase() || 'NONE'}
                    </Badge>
                  </InlineStack>
                </Grid>
              </Card>

              <Text variant="headingSm">Coherence Distribution:</Text>
              <Grid columns={['33%', '33%', '33%']}>
                <div>
                  <Text>High Coherence</Text>
                  <div
                    style={{
                      height: '20px',
                      background: '#10b981',
                      width: `${
                        (coherenceStats.highCoherence / coherenceStats.totalProducts) * 100
                      }%`,
                      minWidth: '10px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    }}
                  />
                  <Text>{coherenceStats.highCoherence} products</Text>
                </div>

                <div>
                  <Text>Medium Coherence</Text>
                  <div
                    style={{
                      height: '20px',
                      background: '#f59e0b',
                      width: `${
                        (coherenceStats.mediumCoherence / coherenceStats.totalProducts) * 100
                      }%`,
                      minWidth: '10px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    }}
                  />
                  <Text>{coherenceStats.mediumCoherence} products</Text>
                </div>

                <div>
                  <Text>Low Coherence</Text>
                  <div
                    style={{
                      height: '20px',
                      background: '#ef4444',
                      width: `${
                        (coherenceStats.lowCoherence / coherenceStats.totalProducts) * 100
                      }%`,
                      minWidth: '10px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    }}
                  />
                  <Text>{coherenceStats.lowCoherence} products</Text>
                </div>
              </Grid>

              <Banner status="info">
                <Text>
                  Products with low coherence may benefit from trauma taxonomy adjustments to better
                  align with the dominant <strong>{coherenceStats.dominantTrauma}</strong> theme in
                  your catalog.
                </Text>
              </Banner>

              <Divider />

              <InlineStack distribution="equalSpacing">
                <Button onClick={runCoherenceAnalysis}>Refresh Analysis</Button>
                <Link url="/export-coherence-report">Export Full Report</Link>
              </InlineStack>
            </BlockStack>
          )}
        </BlockStack>
      )}
    </Card>
  );
}

export default CoherenceSettingsManager;
