import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you're using React Router for routing
import {Layout} from '@shopify/polaris';

const SettingPageSidebar = (props) => {
  
  return (
    <div className='review_topline'>
      <Layout.Section>
          <ul>
              <li><NavLink  to="./../branding"><i className='twenty-collectreviews'></i>Branding</NavLink></li>
              <li><NavLink  to="./../manage-review"><i className='twenty-managereviews'></i>Manage Reviews</NavLink></li>
          </ul>
      </Layout.Section>
    </div>
  );
};

export default SettingPageSidebar;
