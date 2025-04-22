/**
 * TaxonomyEditor Component
 * Allows administrators to edit trauma taxonomy for products
 */

import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';
import {
  Banner,
  Button,
  Card,
  FormLayout,
  Layout,
  Modal,
  ProgressBar,
  RangeSlider,
  Select,
  SkeletonBodyText,
  Stack,
  Tag,
  TextContainer,
  TextField,
} from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';

// Import the quantum API utilities
import { narrativeThemes, traumaTypes } from '../utils/constants';
import { calculateCoherence, fetchTaxonomyData, saveTaxonomyData } from '../utils/taxonomyApi';
import CoherenceVisualizer from './CoherenceVisualizer';

const TaxonomyEditor = ({ context }) => {
  const app = useAppBridge();
  const { productId } = context;

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [taxonomy, setTaxonomy] = useState({
    primaryTrauma: '',
    secondaryTraumas: [],
    intensity: 50,
    narrativeTheme: '',
    coherenceScore: 0,
    customAttributes: {},
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [coherenceHistory, setCoherenceHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load taxonomy data on mount
  useEffect(() => {
    const loadTaxonomyData = async () => {
      setLoading(true);
      try {
        const sessionToken = await getSessionToken(app);
        const data = await fetchTaxonomyData(sessionToken, productId);

        if (data) {
          setTaxonomy(data);
          setCoherenceHistory(data.coherenceHistory || []);
        }
      } catch (error) {
        console.error('Error loading taxonomy data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTaxonomyData();
  }, [app, productId]);

  // Handle saving taxonomy data
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const sessionToken = await getSessionToken(app);

      // Calculate new coherence score before saving
      const coherenceResult = await calculateCoherence(
        sessionToken,
        taxonomy.primaryTrauma,
        taxonomy.secondaryTraumas,
        taxonomy.narrativeTheme,
        taxonomy.intensity
      );

      const updatedTaxonomy = {
        ...taxonomy,
        coherenceScore: coherenceResult.score,
        coherenceFactors: coherenceResult.factors,
        lastUpdated: new Date().toISOString(),
      };

      // Add current coherence to history
      const newHistory = [
        ...coherenceHistory,
        {
          date: new Date().toISOString(),
          score: coherenceResult.score,
          primaryTrauma: taxonomy.primaryTrauma,
          intensity: taxonomy.intensity,
        },
      ].slice(-10); // Keep last 10 entries

      setCoherenceHistory(newHistory);
      updatedTaxonomy.coherenceHistory = newHistory;

      await saveTaxonomyData(sessionToken, productId, updatedTaxonomy);
      setTaxonomy(updatedTaxonomy);
    } catch (error) {
      console.error('Error saving taxonomy data:', error);
    } finally {
      setSaving(false);
    }
  }, [app, productId, taxonomy, coherenceHistory]);

  // Handle changes to taxonomy fields
  const handleChange = useCallback(
    (field) => (value) => {
      setTaxonomy((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle secondary trauma tag selection
  const handleSecondaryTraumaChange = useCallback(
    (selected) => {
      const current = [...taxonomy.secondaryTraumas];

      if (current.includes(selected)) {
        setTaxonomy((prev) => ({
          ...prev,
          secondaryTraumas: current.filter((item) => item !== selected),
        }));
      } else if (current.length < 3) {
        // Limit to 3 secondary traumas
        setTaxonomy((prev) => ({
          ...prev,
          secondaryTraumas: [...current, selected],
        }));
      }
    },
    [taxonomy.secondaryTraumas]
  );

  // Remove a secondary trauma tag
  const handleRemoveSecondaryTrauma = useCallback((tag) => {
    setTaxonomy((prev) => ({
      ...prev,
      secondaryTraumas: prev.secondaryTraumas.filter((item) => item !== tag),
    }));
  }, []);

  if (loading) {
    return (
      <Card sectioned>
        <SkeletonBodyText lines={8} />
      </Card>
    );
  }

  return (
    <Layout>
      <Layout.Section>
        <Card
          title="Trauma Taxonomy"
          sectioned
          primaryFooterAction={{
            content: 'Save Taxonomy',
            onAction: handleSave,
            loading: saving,
          }}
          secondaryFooterActions={[
            {
              content: 'View Coherence History',
              onAction: () => setShowHistoryModal(true),
            },
            {
              content: showAdvanced ? 'Hide Advanced' : 'Show Advanced',
              onAction: () => setShowAdvanced(!showAdvanced),
            },
          ]}
        >
          <FormLayout>
            <Select
              label="Primary Trauma Type"
              options={traumaTypes.map((type) => ({ label: type, value: type }))}
              value={taxonomy.primaryTrauma}
              onChange={handleChange('primaryTrauma')}
              helpText="The dominant trauma type associated with this product"
            />

            <RangeSlider
              label="Trauma Intensity"
              value={taxonomy.intensity}
              onChange={handleChange('intensity')}
              output
              min={0}
              max={100}
              helpText="The intensity level of the trauma response"
            />

            <Select
              label="Narrative Theme"
              options={narrativeThemes.map((theme) => ({ label: theme, value: theme }))}
              value={taxonomy.narrativeTheme}
              onChange={handleChange('narrativeTheme')}
              helpText="The associated narrative theme for coherence"
            />

            <TextContainer>
              <p>Secondary Trauma Types (max 3)</p>

              <Stack spacing="tight">
                {taxonomy.secondaryTraumas.map((trauma) => (
                  <Tag key={trauma} onRemove={() => handleRemoveSecondaryTrauma(trauma)}>
                    {trauma}
                  </Tag>
                ))}
              </Stack>

              <Stack vertical spacing="tight" distribution="fillEvenly">
                {traumaTypes
                  .filter((type) => type !== taxonomy.primaryTrauma)
                  .map((type) => (
                    <Button
                      key={type}
                      size="slim"
                      outline
                      disabled={
                        taxonomy.secondaryTraumas.includes(type) ||
                        (taxonomy.secondaryTraumas.length >= 3 &&
                          !taxonomy.secondaryTraumas.includes(type))
                      }
                      pressed={taxonomy.secondaryTraumas.includes(type)}
                      onClick={() => handleSecondaryTraumaChange(type)}
                    >
                      {type}
                    </Button>
                  ))}
              </Stack>
            </TextContainer>

            <Banner
              title={`Coherence Score: ${(taxonomy.coherenceScore * 100).toFixed(1)}%`}
              status={
                taxonomy.coherenceScore >= 0.75
                  ? 'success'
                  : taxonomy.coherenceScore >= 0.5
                    ? 'info'
                    : taxonomy.coherenceScore >= 0.25
                      ? 'warning'
                      : 'critical'
              }
            >
              <p>Current trauma coherence rating for this product</p>
              <ProgressBar
                progress={taxonomy.coherenceScore * 100}
                size="small"
                color={
                  taxonomy.coherenceScore >= 0.75
                    ? 'success'
                    : taxonomy.coherenceScore >= 0.5
                      ? 'highlight'
                      : taxonomy.coherenceScore >= 0.25
                        ? 'warning'
                        : 'critical'
                }
              />
            </Banner>

            {showAdvanced && (
              <>
                <CoherenceVisualizer
                  primaryTrauma={taxonomy.primaryTrauma}
                  secondaryTraumas={taxonomy.secondaryTraumas}
                  intensity={taxonomy.intensity}
                  narrativeTheme={taxonomy.narrativeTheme}
                  coherenceScore={taxonomy.coherenceScore}
                  coherenceFactors={taxonomy.coherenceFactors}
                />

                <TextField
                  label="Custom Attributes"
                  value={JSON.stringify(taxonomy.customAttributes || {}, null, 2)}
                  onChange={(value) => {
                    try {
                      const parsed = JSON.parse(value);
                      handleChange('customAttributes')(parsed);
                    } catch (e) {
                      // Ignore JSON parse errors while typing
                    }
                  }}
                  multiline={4}
                  monospaced
                />
              </>
            )}
          </FormLayout>
        </Card>
      </Layout.Section>

      <Modal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Coherence History"
        primaryAction={{
          content: 'Close',
          onAction: () => setShowHistoryModal(false),
        }}
      >
        <Modal.Section>
          {coherenceHistory.length === 0 ? (
            <p>No coherence history available</p>
          ) : (
            <div style={{ height: '300px', overflowY: 'auto' }}>
              {coherenceHistory.map((entry, index) => (
                <Card key={index} sectioned>
                  <Stack distribution="equalSpacing">
                    <Stack.Item>
                      <p>
                        <strong>Date:</strong> {new Date(entry.date).toLocaleString()}
                      </p>
                      <p>
                        <strong>Primary Trauma:</strong> {entry.primaryTrauma}
                      </p>
                    </Stack.Item>
                    <Stack.Item>
                      <p>
                        <strong>Score:</strong> {(entry.score * 100).toFixed(1)}%
                      </p>
                      <p>
                        <strong>Intensity:</strong> {entry.intensity}
                      </p>
                    </Stack.Item>
                  </Stack>
                </Card>
              ))}
            </div>
          )}
        </Modal.Section>
      </Modal>
    </Layout>
  );
};

export default TaxonomyEditor;
