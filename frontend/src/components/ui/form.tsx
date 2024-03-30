// import React from 'react'

import { useState } from "react"
import Skelton from "./skelton"

const Form = () => {
    const [alertVisible,setalertVisible]=useState(false)
    const [repoInput,setrepoInput]=useState("")
    const [responseId,setresponseId]=useState("")
    const [uploadCall,setuploadCall]=useState(false)

const convertToApi=()=>
{
  const matches = repoInput.match(/github.com\/([^\/]+)\/([^\/]+)$/);
    if (!matches || matches.length < 3) {
      console.log("Invalid Url")
        return null; 
    }
    
    const username = matches[1];
    const reponame = matches[2];
    
    
    const apiUrl = `https://api.github.com/repos/${username}/${reponame}`;
    return apiUrl;
}

const checkRepo=async(api:string)=>{
try {
  const response=await fetch(api);
  const data=await response.json()
  console.log(data)
  if(data && data.id){
    return true
  }else return false;
  
} catch (error) {
  
  console.log(error);
  return false;
}
}

const uploadCode=async()=>{
  setTimeout(() => {
    let id= Math.random()*1000000
    setresponseId(id.toString())
    setuploadCall(false)
  }, 3000);
}

const handleSubmit=async()=>{
setresponseId("");
setuploadCall(true);
  if(repoInput){
    let apiUrl=convertToApi();
    if(apiUrl)
   {
     const apiResponse=await checkRepo(apiUrl);
     console.log(apiResponse)

     if(apiResponse){
      setuploadCall(true)
      await uploadCode();

     }else{
     
     }
    
    }



  }
}

  return (
    <div className="flex justify-center items-center flex-col">
<form className="max-w-md mx-auto">
  <label htmlFor="email-address-icon" className="block mb-2 text-sm font-medium text-gray-700 ">Your Github Repositry</label>
  <div className="relative flex items-center">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-github text-gray-500" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
    </div>
    <input type="text" id="email-address-icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="https://github.com/ps/abc" value={repoInput} onChange={(e)=>{setrepoInput(e.target.value)}}/>
 
    <button onClick={handleSubmit} type="button" className={`text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2 mx-2 ${uploadCall && "disabled"}`} >Submit</button>
   </div>
   <p className={`${alertVisible ?"":"hidden"} mt-2 text-sm text-red-400`}><span className="font-medium">Alright!</span> Username available!</p>
 


</form>

<div className={` ${!(uploadCall || responseId) && "hidden"} my-16`}>
<Skelton show={!uploadCall} id={responseId}/>
</div>

</div >
  )
}

export default Form