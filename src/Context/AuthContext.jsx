import React, {  useEffect, useState } from 'react'
export const UserDataContext = React.createContext(null)
function AuthContext({children}) {
    let [data,setData] = useState([])

    useEffect(()=>{
      let user = localStorage.getItem('data')
      setData(JSON.parse(user))
    //   console.log(data)
    },[])
  return <UserDataContext.Provider value={{data,setData}}>
    {children}
  </UserDataContext.Provider>
}

export default AuthContext