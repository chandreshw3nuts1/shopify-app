import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you're using React Router for routing
import {Layout} from '@shopify/polaris';

const SettingPageSidebar = (props) => {
  
  return (
    <div className='review_topline'>
      <Layout.Section>
          <ul>
              <li><NavLink  to="./../branding"><i className='twenty-collectreviews'></i>Branding</NavLink></li>
              <li><NavLink  to="./../integrations"><i className='twenty-managereviews'></i>Integrations</NavLink></li>
              <li><NavLink  to="./../orders"><i className='twenty-managereviews'></i>Orders</NavLink></li>
              <li><NavLink  to="./../general"><i className='twenty-managereviews'></i>General</NavLink></li>
          </ul>
      </Layout.Section>
    </div>
  );
};

export default SettingPageSidebar;
