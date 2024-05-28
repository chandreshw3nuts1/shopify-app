import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for routing
import {Card, Breadcrumbs, Button,Layout, LegacyCard} from '@shopify/polaris';

const ReviewPageSidebar = (props) => {
  
  return (
    <Layout.Section>
        <ul>
            <li><Link to="./../review"> Collect Reviews</Link></li>
            <li><Link to="./../manage-review"> Manage Reviews</Link></li>
        </ul>
    </Layout.Section>
      
  );
};

export default ReviewPageSidebar;
