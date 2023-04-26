import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
const inter = Inter({ subsets: ['latin'] })

const HR = (props) =>{
  return <hr className ={ `border-gray-600 my-3 -mx-${props.parentPadding?props.parentPadding:"5"} ${props.color?props.color:""}`}/>
}

function getHashType(hash){
  const isMD5 = /^[a-f0-9]{32}$/i.test(hash);
  const isSHA1 = /^[a-f0-9]{40}$/i.test(hash);
  const isSHA256 = /^[a-f0-9]{64}$/i.test(hash);
  const isSHA512 = /^[a-f0-9]{128}$/i.test(hash);

  if (!(isMD5 || isSHA1 || isSHA256 || isSHA512)){
    return ""
  }

  let url = ""
  url = isMD5?"md5":""
  url = isSHA1?"sha1":url||""
  url = isSHA256?"sha256":url||""
  url = isSHA512?"sha512":url||""

  return url
}

// Given by chat gpt
function flattenObject(obj, prefix = "") {
  let result = {};
  for (let key in obj) {
    let propName = prefix + key;
    if (typeof obj[key] === "object") {
      Object.assign(result, flattenObject(obj[key], propName + "."));
    } else {
      result[propName] = obj[key];
    }
  }
  return result;
}

const PropertyItem = (props) => {
  let [hovering, setHovering] = useState(false)
  return <div className = {`p-2 border-b border-gray-700 ${hovering?"text-center":""}`} onMouseEnter = {() => setHovering(true)} onMouseLeave = {() => setHovering(false)}>
  {!hovering?((props.name)?props.name:"???"):""} <span className = {`${!hovering?"float-right text-right w-80 truncate":""}`}> {props.value?props.value:"???"} </span>
</div>
}

export default function Home() {
  let [currentHash, setCurrentHash] = useState("")
  let [userHash, setUserHash] = useState("")

  const defaultHashStatus = "Enter hash: "
  let [hashStatus, setHashStatus] = useState(defaultHashStatus)
  
  let [properties, setProperties] = useState([])
  function hashChangeHandler(userHash){
    setUserHash(userHash)
    if(userHash === ""){
      setHashStatus(defaultHashStatus)
      return
    }

    let hashType = getHashType(userHash)
    if(hashType === ""){
      setHashStatus("Not a hash")
      return
    }else{
      setHashStatus(`Hash Type : ${hashType}`)
    }
    setCurrentHash(userHash)
  }

  useEffect(() => {
    if(currentHash === "")
      return
    console.log(currentHash)
    fetch(`/api/check/${currentHash}`)
    .then(response => response.json())
    .then(json => {
      json = flattenObject(json)
      let propertyItems = []

      for(let name in json){
        if(name.includes("Description"))
        propertyItems.unshift(<PropertyItem key = {name} name = {name} value = {json[name]}/>)
        else
        propertyItems.push(<PropertyItem key = {name} name = {name} value = {json[name]}/>)
      }

      setProperties(propertyItems)
    })
  }, [currentHash])

  return (
    <main
      className="bg-gray-900 p-5 px-20"
    >
        <div
          className="h-screen bg-black rounded-lg p-5 text-white text-xl font-mono border-white">
          <span className='text-4xl font-bold'> Hash Brown </span>
          <br />
          <br />
          CIRCL hash lookup is a public API to lookup hash values against known database of files.
          <br />
          Enter hash below to get all the data on that file's hash.
          <br />
          <HR />
          

          <div >
            {hashStatus}
            <input className="float-right text-black" type = "text" value = {userHash} onChange = {(e) => hashChangeHandler(e.target.value)}></input>
          </div>
          <HR />

          <div className="rounded-lg bg-gray-800 mt-5 text-justfy overflow-y-scroll h-80">
            <div className = "p-2 border-b border-gray-700">
              Property Name:<span className = "float-right"> Property Value</span> 
            </div>
            {properties}
            <div>
              &nbsp;
            </div>
          </div>

        </div>
    </main>
  )
}
