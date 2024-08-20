import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you're using React Router for routing
import {Layout} from '@shopify/polaris';

const ReviewPageSidebar = (props) => {
  
  return (
    <div className='review_topline'>
      <Layout.Section>
          <ul>
              <li><NavLink  to="./../review"><i className='twenty-collectreviews'></i>Collect Reviews</NavLink></li>
              <li><NavLink  to="./../display-review-widget"><i className='twenty-collectreviews'></i>Reviews widgets</NavLink></li>
              <li><NavLink  to="./../manage-review"><i className='twenty-managereviews'></i>Manage Reviews</NavLink></li>
              <li><NavLink  to="./../import-review"><i className='twenty-importreviews'></i>Import reviews</NavLink></li>
          </ul>
      </Layout.Section>
    </div>
  );
};

export default ReviewPageSidebar;
