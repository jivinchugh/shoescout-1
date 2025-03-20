// import LoginButton from "./auth/LoginButton"
// import LogoutButton from "./auth/LogoutButton"
// import "./LandingPage.css"
// import HeroSection from "../components/landing/HeroSection"
// import ReviewsSection from "../components/landing/ReviewsSection"
// import BrandsSection from "../components/landing/BrandsSection"
// import CtaSection from "../components/landing/CtaSection"

// function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen w-full">
//       <header className="border-b w-full sticky top-0 bg-white z-10">
//         <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
//           <a href="/" className="flex items-center gap-2 font-bold">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="h-6 w-6"
//             >
//               <path d="M6 2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
//               <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
//               <path d="M10 14v-3"></path>
//               <path d="M14 14v-3"></path>
//             </svg>
//             <span>Capstone Store</span>
//           </a>
//           <LoginButton />
//         </div>
//       </header>
      
//       <main className="flex-1">
//         {/* Hero Banner */}
//         <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
//           <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
//             <div className="space-y-6">
//               <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                 Your shoes at the best price
//               </h1>
//               <p className="max-w-[600px] text-gray-500 md:text-xl">
//                 Discover our curated collection of premium footwear at unbeatable prices. Quality meets affordability.
//               </p>
//               <div className="flex gap-4">
//                 <a href="#explore" className="inline-flex h-10 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-black/90">
//                   Shop Now
//                 </a>
//                 <a href="#collection" className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100">
//                   View Collection
//                 </a>
//               </div>
//             </div>
//             <div className="flex justify-center lg:justify-end">
//               <img
//                 src="https://placehold.co/600x600"
//                 alt="Featured shoes"
//                 width="600"
//                 height="600"
//                 className="rounded-xl object-cover shadow-lg"
//               />
//             </div>
//           </div>
//         </section>
        
//         {/* Main Hero Section Component */}
//         <HeroSection />
        
//         {/* Reviews Section with subtle divider */}
//         <div className="py-10 border-t border-gray-100">
//           <ReviewsSection />
//         </div>
        
//         {/* Brands Section with subtle divider */}
//         <div className="py-10 border-t border-gray-100 bg-gray-50">
//           <BrandsSection />
//         </div>
        
//         {/* CTA Section with subtle divider */}
//         <div className="py-10 border-t border-gray-100">
//           <CtaSection />
//         </div>
//       </main>
      
//       <footer className="border-t py-6 bg-gray-50">
//         <div className="px-4 md:px-6 max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-2 font-medium">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="h-5 w-5"
//               >
//                 <path d="M6 2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
//                 <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
//                 <path d="M10 14v-3"></path>
//                 <path d="M14 14v-3"></path>
//               </svg>
//               <span>Capstone Store</span>
//             </div>
//             <p className="text-xs text-gray-500">© 2025 Capstone Store. All rights reserved.</p>
//             <div className="flex gap-4">
//               <a href="#" className="text-gray-500 hover:text-gray-900">
//                 Terms
//               </a>
//               <a href="#" className="text-gray-500 hover:text-gray-900">
//                 Privacy
//               </a>
              
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// export default LandingPage

import LoginButton from "./auth/LoginButton"
import "./LandingPage.css"
import ReviewsSection from "../components/landing/ReviewsSection"
import BrandsSection from "../components/landing/BrandsSection"

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="border-b w-full sticky top-0 bg-white z-10 border-red-100">
        <div className="flex h-16 items-center justify-between px-4 md:px-6  mx-auto">
          <a href="/" className="flex items-center gap-2 font-bold text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-20 w-20"
            >
              <path d="M6 2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
              <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
              <path d="M10 14v-3"></path>
              <path d="M14 14v-3"></path>
            </svg>
            <span>Capstone Store</span>
          </a>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="py-16 md:py-24 px-4 md:px-6  mx-auto bg-red-50">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your shoes at the best price
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Discover our curated collection of premium footwear at unbeatable prices. Quality meets affordability.
              </p>
              
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="https://placehold.co/600x600"
                alt="Featured shoes"
                width="600"
                height="600"
                className="rounded-xl object-cover shadow-lg border-2 border-red-100"
              />
            </div>
          </div>
        </section>


        {/* Reviews Section with subtle divider */}
        <div className="py-10 border-t border-red-100">
          <ReviewsSection />
        </div>

        {/* Brands Section with subtle divider */}
        <div className="py-10 border-t border-red-100">
          <BrandsSection />
        </div>

      </main>

      <footer className="border-t py-6 bg-red-50">
        <div className="px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-medium text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M6 2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                <path d="M10 14v-3"></path>
                <path d="M14 14v-3"></path>
              </svg>
              <span>Capstone Store</span>
            </div>
            <p className="text-xs text-gray-500">© 2025 Capstone Store. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-red-600">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

