import React, { useState } from "react";
import { ImStarFull, ImStarHalf, ImStarEmpty } from "react-icons/im";
import "../styles/Main.css";

const StarRating = ({ stars = 0, onRate = null }) => {
  const [hoverRating, setHoverRating] = useState(null);
  const effectiveRating = hoverRating !== null ? hoverRating : stars;

  const handleMouseEnter = (value) => {
    if (onRate) setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (onRate) setHoverRating(null);
  };

  const handleClick = (value) => {
    if (onRate) onRate(value);
  };

  const renderStarIcon = (index) => {
    const value = index + 1;

    if (effectiveRating >= value) return <ImStarFull />;
    if (effectiveRating >= value - 0.5) return <ImStarHalf />;
    return <ImStarEmpty />;
  };

  const starElements = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;

    if (onRate) {
      return (
        <span
          key={value}
          className="star-wrapper"
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(value)}
        >
          {renderStarIcon(index)}
        </span>
      );
    }

    return (
      <span key={value} className="star-wrapper">
        {renderStarIcon(index)}
      </span>
    );
  });

  return <div className="rating-stars">{starElements}</div>;
};

export default StarRating;
