import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for routing
import {Card, Breadcrumbs, Button} from '@shopify/polaris';
import styles from "./breadcrumb.module.css";
import HomeImage from './home.png';

const Breadcrumb = (props) => {
  
  return (
    <Card title="Online store dashboard" >
      <ul className={styles.breadcrumbs}>
      <li key="home-li"><Link to="/app"><span><img src={HomeImage} className={styles.breadcrumbHome} alt="" /></span> Home </Link></li>
        {
          props.crumbs.map((crumb, index) => {
            if (props.crumbs.length -1 == index) {
              return(
                <li key={index}>{crumb.title}</li>
              );
            } else {
              return(
                <li key="selected-li"><Link to={crumb.link}> {crumb.title}</Link></li>
              );
            }

            
             
          })
        }
        </ul>
    </Card>

    
  );
};

export default Breadcrumb;