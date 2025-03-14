import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const DraggableRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleMouseEnter = (starValue) => {
    setHover(starValue);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const handleClick = (starValue) => {
    setRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const starColor = star <= (hover || rating) ? "#ffc107" : "#e4e5e9";
        return (
          <FaStar
            key={star}
            size={19}
            color={starColor}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
          />
        );
      })}
    </div>
  );
};

export default DraggableRating;
