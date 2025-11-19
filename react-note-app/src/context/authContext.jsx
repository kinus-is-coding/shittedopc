import { createContext,useState,useEffect, Children } from "react"
import { jwtDecode } from "jwt-decode";

const AuthContext=createContext()
export default AuthContext;
export const AuthProvider=({children})=>{
    let [authToken,setAuthToken]=useState(null)
    let [user,setUser]=useState(null)
    let loginUser=async (e)=>{
        e.preventDefault()
       
        let response= await  fetch("http://127.0.0.1:8000/login/",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value,'password':e.target.password.value})

        })
        let data= await response.json()
        if (response.status===200){
            setAuthToken(data)
            setUser(jwtDecode(data.access))
        }else{
            alert("WRONG")
        }
    }
    let contextData={
        user:user,
        loginUser:loginUser
    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}