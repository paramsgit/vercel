
const Header = () => {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-white antialiased bg-grid-white/[0.02] relative overflow-hidden">
     
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-[black] to-neutral-400 bg-opacity-50">
           <br /> Deploy React WebApps
        </h1>
        <p className="mt-4 font-normal text-lg text-gray-400 md:max-w-md lg:max-w-2xl text-center mx-auto">
        Experience seamless deployment for your React web apps with our Vercel-inspired service. Say goodbye to complex setups and hello to effortless deployment in minutes. Trust our platform's reliability and scalability to keep your apps running smoothly.
        </p>
      </div>
    </div>
  )
}

export default Header