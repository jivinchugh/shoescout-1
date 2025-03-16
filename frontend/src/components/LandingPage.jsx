import LoginButton from "./auth/LoginButton"
import LogoutButton from "./auth/LogoutButton"
import "./LandingPage.css"

function LandingPage() {
  return (
    <div className="flex h-screen flex-col  w-full">
        <header className="border-b w-full">
        <div className=" flex h-16 items-center justify-between px-4 md:px-6">
          <a href="/" className="flex items-center gap-2 font-bold">
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
              className="h-6 w-6"
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
      <main className="flex-1 flex items-center w-full">
        <div className=" px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center h-full">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your shoes at the best price
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Discover our curated collection of premium footwear at unbeatable prices. Quality meets affordability.
              </p>
             
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="https://placehold.co/400x400"
                alt="Featured shoes"
                width="400"
                height="400"
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </main>
     
    </div>
  )
}

export default LandingPage

