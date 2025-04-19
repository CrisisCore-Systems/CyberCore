import {
  BlockStack,
  Card,
  Link,
  NavigationMenu,
  Text,
  useExtensionApi,
} from '@shopify/admin-ui-extensions-react';
import React from 'react';

function NavigationLinks() {
  const { extensionApi } = useExtensionApi();

  return (
    <NavigationMenu>
      <NavigationMenu.Section
        title="Trauma Taxonomy Tools"
        action={{
          content: 'Manage All',
          onAction: () => extensionApi.navigate('/admin/settings/quantum/trauma-taxonomy'),
        }}
      >
        <NavigationMenu.Item
          label="Trauma Manager"
          onClick={() => extensionApi.navigate('/admin/settings/quantum/trauma-taxonomy')}
        />
        <NavigationMenu.Item
          label="Coherence Dashboard"
          onClick={() => extensionApi.navigate('/admin/settings/quantum/coherence-dashboard')}
        />
        <NavigationMenu.Item
          label="Visualizer"
          onClick={() => extensionApi.navigate('/admin/settings/quantum/trauma-visualizer')}
        />
        <NavigationMenu.Item
          label="Narrative Generator"
          onClick={() => extensionApi.navigate('/admin/settings/quantum/narrative-generator')}
        />
      </NavigationMenu.Section>

      <Card title="Coherence Status" sectioned>
        <BlockStack spacing="tight">
          <Text variant="bodyMd">
            <Text fontWeight="bold">Store Coherence:</Text> 72% (High)
          </Text>
          <Text variant="bodyMd">
            <Text fontWeight="bold">Dominant Trauma:</Text> Fragmentation
          </Text>
          <Text variant="bodyMd">
            <Text fontWeight="bold">Active Profile:</Text> VoidBloom
          </Text>
          <Link url="/admin/settings/quantum/coherence-dashboard" external={false}>
            View detailed analytics
          </Link>
        </BlockStack>
      </Card>
    </NavigationMenu>
  );
}

export default NavigationLinks;
