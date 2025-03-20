// function BrandsSection() {
//   const brands = ["Nike", "Adidas", "Puma", "New Balance", "Reebok", "Converse"]

//   return (
//     <section className="bg-white py-12 md:py-20">
//       <div className="container mx-auto px-4">
//         <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Top Brands We Compare</h2>
//         <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
//           {brands.map((brand, index) => (
//             <div key={index} className="flex items-center justify-center">
//               <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 p-4">
//                 <span className="text-lg font-bold text-gray-800">{brand}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

function BrandsSection() {
  const brands = [
    { name: "Nike", logo: "/api/placeholder/60/30" },
    { name: "Adidas", logo: "/api/placeholder/60/30" },
    { name: "Puma", logo: "/api/placeholder/60/30" },
    { name: "New Balance", logo: "/api/placeholder/60/30" },
    { name: "Reebok", logo: "/api/placeholder/60/30" },
    { name: "Converse", logo: "/api/placeholder/60/30" },
  ]

  return (
    <section style={{ backgroundColor: "#fef2f2" }} className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Top Brands We Compare</h2>

        {/* Force 3 columns at all supported screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#fee2e2",
                borderWidth: "2px",
              }}
              className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={`${brand.name} logo`}
                className="h-16 mb-4 object-contain"
              />
              <span className="text-lg font-bold text-gray-800">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandsSection

