import React, { useState } from "react";
import { ImStarFull, ImStarHalf, ImStarEmpty } from "react-icons/im";
import "../styles/Main.css"; // optional if needed

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

  const renderStar = (value) => {
    if (effectiveRating >= value) return <ImStarFull key={value} className="star" />;
    if (effectiveRating >= value - 0.5) return <ImStarHalf key={value} className="star" />;
    return <ImStarEmpty key={value} className="star" />;
  };

  // For clickable stars, we use half-step values (1, 1.5, 2, ..., 5)
  const starElements = [];
  for (let i = 1; i <= 5; i++) {
    const fullValue = i;
    const halfValue = i - 0.5;

    if (onRate) {
      starElements.push(
        <span
          key={halfValue}
          className="star-wrapper"
          onMouseEnter={() => handleMouseEnter(halfValue)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(halfValue)}
        >
          {renderStar(halfValue)}
        </span>
      );
      starElements.push(
        <span
          key={fullValue}
          className="star-wrapper"
          onMouseEnter={() => handleMouseEnter(fullValue)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(fullValue)}
        >
          {renderStar(fullValue)}
        </span>
      );
    } else {
      // Non-interactive display
      starElements.push(renderStar(fullValue));
    }
  }

  return <div className="rating-stars">{starElements}</div>;
};

export default StarRating;
