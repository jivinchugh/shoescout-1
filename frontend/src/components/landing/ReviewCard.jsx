import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionAreaCard({ review }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
      <div className="mb-4 flex justify-center margin-top-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={i < review.rating ? "#EF4444" : "none"}
              stroke={i < review.rating ? "#EF4444" : "#D1D5DB"}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          ))}
      </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          {review.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          "{review.text}"
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
