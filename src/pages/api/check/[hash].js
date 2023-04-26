// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



async function getHashData(hash){
  const isMD5 = /^[a-f0-9]{32}$/i.test(hash)
  const isSHA1 = /^[a-f0-9]{40}$/i.test(hash)
  const isSHA256 = /^[a-f0-9]{64}$/i.test(hash)
  const isSHA512 = /^[a-f0-9]{128}$/i.test(hash)

  if (!(isMD5 || isSHA1 || isSHA256 || isSHA512)){
    return {"error":"Not a hash"}
  }

  let url = "https://hashlookup.circl.lu/lookup/"
  url += isMD5?"md5/":""
  url += isSHA1?"sha1/":""
  url += isSHA256?"sha256/":""
  url += isSHA512?"sha512/":""


  url += hash
  let res = await fetch(url, {headers:{accept: "application/json"}})
  return res.json()
}

export default async function handler(req, res) {
  const { query, method } = req
  const hash = query.hash


  switch (method) {
    case 'GET':
      // Get data from your database
      const data = await getHashData(hash)
      if(data["error"])
        res.status(406).json(data["error"])
      res.status(200).json(data)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
