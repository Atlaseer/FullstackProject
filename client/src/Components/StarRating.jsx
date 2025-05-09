import { ImStarFull, ImStarHalf, ImStarEmpty } from "react-icons/im";

const StarRating = ({stars}) =>
{
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starElements = [];

    for (let i = 0; i < fullStars; i++)
    {
        starElements.push(<ImStarFull key={`full-${i}`} className="star"/>);
    }

    if(hasHalfStar)
    {
        starElements.push(<ImStarHalf key="half" className="star" />);
    }

    for (let i = 0; i < emptyStars; i++) 
    {
        starElements.push(<ImStarEmpty key={`empty-${i}`} className="star" />);
    }

    return <div className="rating-stars">{starElements}</div>;
};

export default StarRating;