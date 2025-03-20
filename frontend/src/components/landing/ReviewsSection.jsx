// // import ReviewCard from "./ReviewCard"

// // function ReviewsSection() {
// //   // Sample data
// //   const reviews = [
// //     {
// //       name: "Alex Johnson",
// //       text: "Saved over $50 on my new running shoes! This site is a game-changer for shoe shopping.",
// //       rating: 5,
// //     },
// //     {
// //       name: "Sarah Miller",
// //       text: "I love how easy it is to compare prices across different stores. Found a great deal on sneakers!",
// //       rating: 4,
// //     },
// //     {
// //       name: "Michael Chen",
// //       text: "The price comparison tool is incredibly accurate. Helped me find the best deal on limited edition shoes.",
// //       rating: 5,
// //     },
// //   ]

// //   return (
// //     <section className="bg-gray-50 py-12 md:py-20">
// //       <div className="container mx-auto px-4">
// //         <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">What Our Users Say</h2>
// //         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //           {reviews.map((review, index) => (
// //             <ReviewCard key={index} review={review} />
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default ReviewsSection

// import ReviewCard from "./ReviewCard"

// function ReviewsSection() {
//   // Sample data
//   const reviews = [
//     {
//       name: "Alex Johnson",
//       text: "Saved over $50 on my new running shoes! This site is a game-changer for shoe shopping.",
//       rating: 5,
//       avatar: "/api/placeholder/40/40"
//     },
//     {
//       name: "Sarah Miller",
//       text: "I love how easy it is to compare prices across different stores. Found a great deal on sneakers!",
//       rating: 4,
//       avatar: "/api/placeholder/40/40"
//     },
//     {
//       name: "Michael Chen",
//       text: "The price comparison tool is incredibly accurate. Helped me find the best deal on limited edition shoes.",
//       rating: 5,
//       avatar: "/api/placeholder/40/40"
//     },
//   ]

//   return (
//     <section className="bg-red-50 py-16 md:py-24">
//       <div className="container mx-auto px-4 max-w-7xl">
//         <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">What Our Users Say</h2>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {reviews.map((review, index) => (
//             <ReviewCard key={index} review={review} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

import ReviewCard from "./ReviewCard"

function ReviewsSection() {
  // Sample data
  const reviews = [
    {
      name: "Alex Johnson",
      text: "Saved over $50 on my new running shoes! This site is a game-changer for shoe shopping.",
      rating: 5,
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Sarah Miller",
      text: "I love how easy it is to compare prices across different stores. Found a great deal on sneakers!",
      rating: 4,
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Michael Chen",
      text: "The price comparison tool is incredibly accurate. Helped me find the best deal on limited edition shoes.",
      rating: 5,
      avatar: "/api/placeholder/40/40",
    },
    
  ]

  return (
    <section style={{ backgroundColor: "#ffffff" }} className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid2';
// import ReviewCard from "./ReviewCard"


// export default function ResponsiveGrid() {
//   const reviews = [
//     {
//       name: "Alex Johnson",
//       text: "Saved over $50 on my new running shoes! This site is a game-changer for shoe shopping.",
//       rating: 5,
//       avatar: "/api/placeholder/40/40",
//     },
//     {
//       name: "Sarah Miller",
//       text: "I love how easy it is to compare prices across different stores. Found a great deal on sneakers!",
//       rating: 4,
//       avatar: "/api/placeholder/40/40",
//     },
//     {
//       name: "Michael Chen",
//       text: "The price comparison tool is incredibly accurate. Helped me find the best deal on limited edition shoes.",
//       rating: 5,
//       avatar: "/api/placeholder/40/40",
//     },
//     {
//       name: "Michael Chen",
//       text: "The price comparison tool is incredibly accurate. Helped me find the best deal on limited edition shoes.",
//       rating: 5,
//       avatar: "/api/placeholder/40/40",
//     },
//     {
//       name: "Michael Chen",
//       text: "The price comparison tool is incredibly accurate. Helped me find the best deal on limited edition shoes.",
//       rating: 5,
//       avatar: "/api/placeholder/40/40",
//     },
//     {
//       name: "Michael Chen",
//       text: "The price comparison tool is incredibly accurate. Helped me find the best deal on limited edition shoes.",
//       rating: 5,
//       avatar: "/api/placeholder/40/40",
//     },
//   ]
//   return (
    
//     <Box sx={{ flexGrow: 1 }}>
//       <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">What others think about us</h2>
//       <br />
//       <br />
//       <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} size={{ xs: 2, sm: 4, md: 4 }}>
//       {reviews.map((review, index) => (
//             <ReviewCard key={index} review={review}  />
//           ))}
//       </Grid>
//     </Box>
//   );
// }


