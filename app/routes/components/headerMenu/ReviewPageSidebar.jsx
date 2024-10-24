import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you're using React Router for routing
import {
  Layout,
  ButtonGroup, 
  Button,
  Icon,
	Page,
	Text,
	Collapsible,
	Card,
	Box,
	Grid, 
	Bleed,
	Divider,
	InlineStack,
	BlockStack,
	InlineGrid,
	Banner,
	Link,
} from '@shopify/polaris';
import {
  StarFilledIcon,
  AppsFilledIcon,
  SettingsFilledIcon,
  ImportIcon
} from '@shopify/polaris-icons';

const ReviewPageSidebar = (props) => {
  
  return (
    <InlineStack align='start'>
      <Box paddingBlock={200} paddingBlockEnd={500} width='100%'>
        <Box padding={300} borderColor='bg-surface-secondary-active' borderWidth='0165' borderRadius='300' shadow='100' background='bg-fill'>
          <ButtonGroup>
            <Button size="large" icon={StarFilledIcon} url='./../review'>Collect reviews</Button> 
            <Button size="large" icon={AppsFilledIcon} variant='tertiary' url='./../display-review-widget'>Reviews widgets</Button>
            <Button size="large" icon={SettingsFilledIcon} variant='tertiary' url='./../manage-review'>Manage reviews</Button>
            <Button size="large" icon={ImportIcon} variant='tertiary' url='./../import-review'>Import reviews</Button>
              {/* <ul>
                  <li><NavLink  to="./../review"><i className='twenty-collectreviews'></i>Collect reviews</NavLink></li>
                  <li><NavLink  to="./../display-review-widget"><i className='twenty-collectreviews'></i>Reviews widgets</NavLink></li>
                  <li><NavLink  to="./../manage-review"><i className='twenty-managereviews'></i>Manage reviews</NavLink></li>
                  <li><NavLink  to="./../import-review"><i className='twenty-importreviews'></i>Import reviews</NavLink></li>
              </ul> */}
          </ButtonGroup>
        </Box>
      </Box>
    </InlineStack>
  );
};

export default ReviewPageSidebar;
