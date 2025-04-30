import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, totalStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;
  const emptyStars = totalStars - fullStars - (decimalPart > 0 ? 1 : 0);
  const fillPercentage = decimalPart * 100;

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={index} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      ))}
      {decimalPart > 0 && (
        <div className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <div 
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={index} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );
};

export default StarRating;
