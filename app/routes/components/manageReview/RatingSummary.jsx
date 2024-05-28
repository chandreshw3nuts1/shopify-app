import { useEffect, useState, useCallback , useRef} from "react";
import { useLoaderData } from "@remix-run/react";
import style from "./RatingSummary.module.css";
// import StarRating from './StarRating';
import RatingIcons from './RatingIcons';

const RatingSummary = ({ ratingData}) => {
  const totalReviews = ratingData.reduce((acc, item) => acc + item.count, 0);
  const averageRating = (ratingData.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1); 
  
  return (
    <div className={style.rating_summary}>
      <div className={style.average_rating}>
          <h1>{ !isNaN( (ratingData.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1) ) ? (ratingData.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1) : "0.0" }</h1>
          <p>{totalReviews} Reviews</p>
          <RatingIcons rating={averageRating} />

      </div>
      <div className={style.stars}>
        {[1, 2, 3, 4, 5].reverse().map((star) => {
          const starData = ratingData.find((item) => item.stars === star) || { stars: star, count: 0 };
          if(!isNaN ( ((starData.count / totalReviews) * 100).toFixed(0))){
            var percentage =  ((starData.count / totalReviews) * 100).toFixed(0);
          } else {
            var percentage =  0;

          }

          return (
            <div key={star} className={style.star_row}>
              <span>{star} ★</span>
              <div className={style.bar}>
                <div className={style.filled_bar} style={{ width: `${percentage}%` }}> </div>
              </div>
              <span>{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSummary;
