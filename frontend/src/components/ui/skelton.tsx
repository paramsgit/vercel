import React from "react"
interface MyComponentProps {
    show: boolean;
    id:string;
  }
const Skelton :React.FC<MyComponentProps>= ({show,id}) => {
  return (
    <>
    
<div role="status" className={`w-[20rem] md:w-[36rem] p-4  border border-gray-200 divide-y divide-gray-200 rounded-xl  ${!id && "animate-pulse shadow"} `}>
    <div className="flex items-center justify-between">
        <div className={`${show && "hidden"}`}>
            <div className=" bg-gray-300 rounded-full h-3  w-[8rem] md:w-24 mb-1.5  text-[transparent]">Link</div>
            <div className="w-[18rem] md:w-[32rem]  h-3.5  bg-gray-200 rounded-full  text-[transparent]">https://vercelrequesthandler.onrender.com/index.html?id=xxxxxxx</div>
        </div>
        <div className={`${!show && "hidden"}`}>
            <div className="  rounded-full w-[8rem] md:w-24 mb-1.5 text-gray-500"> Link</div>
            <div className="w-[18rem] md:w-[32rem]  rounded-full text-gray-700">https://vercelrequesthandler.onrender.com/index.html?id=55026591</div>
        </div>
        
    </div>
    
    <span className="sr-only">Loading...</span>
</div>

    </>
  )
}

export default Skelton