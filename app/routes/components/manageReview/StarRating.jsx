import React from 'react';
import style from "./RatingSummary.module.css";


const StarRating = ({ averageRating }) => {
  const roundedRating = Math.round(averageRating);

  return (
    <div className={style.star_rating}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            className={ratingValue <= roundedRating ? style.active  : ''}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
