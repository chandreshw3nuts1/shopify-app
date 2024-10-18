import {Tooltip, Text} from '@shopify/polaris';
import React from 'react';

export default function TooltipExample() {
  return (
    <div style={{padding: '75px 0'}}>
      <Tooltip active content="This order has shipping labels.">
        <Text fontWeight="bold" as="span">
          Order #1001
        </Text>
      </Tooltip>
    </div>
  );
}