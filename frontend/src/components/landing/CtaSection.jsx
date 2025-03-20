

// function CtaSection() {
//   return (
//     <section className="bg-red-600 py-12 md:py-20">
//       <div className="container mx-auto px-4 text-center">
//         <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to find the best shoe deals?</h2>
//         <p className="mb-8 text-lg text-white/90">Join thousands of smart shoppers who save money every day.</p>
        
//       </div>
//     </section>
//   )
// }

function CtaSection() {
  return (
    <section style={{ backgroundColor: "#dc2626" }} className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to find the best shoe deals?</h2>
        <p className="mb-8 text-lg text-white/90 max-w-2xl mx-auto">
          Join thousands of smart shoppers who save money every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            style={{ backgroundColor: "#ffffff", color: "#dc2626" }}
            className="rounded-md px-8 py-3 font-bold shadow-md hover:opacity-90 transition-all"
          >
            Sign Up Now
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: "#ffffff",
              borderColor: "#ffffff",
              borderWidth: "2px",
            }}
            className="rounded-md px-8 py-3 hover:bg-white/10 transition-all"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

export default CtaSection

