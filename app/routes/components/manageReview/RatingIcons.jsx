import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

import style from "./RatingSummary.module.css";


const StarRating = ({ rating }) => {
    // Function to render stars
    const renderStars = () => {
      const stars = [];
      // Full stars
      for (let i = 1; i <= Math.floor(rating); i++) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} />);
      }
      // Half star
      if (rating % 1 !== 0) {
        stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} />);
      }
      // Empty stars
      for (let i = Math.ceil(rating) + 1; i <= 5; i++) {
        stars.push(<FontAwesomeIcon key={i} icon={farStar} />);
      }
      return stars;
    };
  
    return (
      <div className={style.star_rating_gold}>
        {renderStars()}
      </div>
    );
  };
  
export default StarRating;
  