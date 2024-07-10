import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you're using React Router for routing
import {Layout} from '@shopify/polaris';

const SettingPageSidebar = (props) => {
  
  return (
    <div className='review_topline'>
      <Layout.Section>
          <ul>
              <li><NavLink  to="./../branding"><i className='twenty-brandingicon'></i>Branding</NavLink></li>
              <li><NavLink  to="./../integrations"><i className='twenty-integrationicon'></i>Integrations</NavLink></li>
              <li><NavLink  to="./../orders"><i className='twenty-ordericon'></i>Orders</NavLink></li>
              <li><NavLink  to="./../general"><i className='twenty-genesettingsicon'></i>General Setting</NavLink></li>
          </ul>
      </Layout.Section>
    </div>
  );
};

export default SettingPageSidebar;
