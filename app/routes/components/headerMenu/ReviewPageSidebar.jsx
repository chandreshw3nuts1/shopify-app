import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Assuming you're using React Router for routing
import {Card, Breadcrumbs, Button,Layout, LegacyCard} from '@shopify/polaris';

const ReviewPageSidebar = (props) => {
  
  return (
    <div className='review_topline'>
      <Layout.Section>
          <ul>
              <li><NavLink  to="./../review"><i className='twenty-collectreviews'></i>Collect Reviews</NavLink></li>
              <li><NavLink  to="./../manage-review"><i className='twenty-managereviews'></i>Manage Reviews</NavLink></li>
          </ul>
      </Layout.Section>
    </div>
  );
};

export default ReviewPageSidebar;
