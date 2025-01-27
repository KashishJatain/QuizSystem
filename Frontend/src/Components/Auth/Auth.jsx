import React, { useRef, useState } from 'react'
import style from "./Auth.module.css"
import Login from './Login';
import Signup from './Signup';
const Auth = () => {
    const [toggle,setToggle]=useState(false);
    
  return (
    <div id={style.authcont}>
    <div id={style.auth}>
    <div id={style.left}>
      <p>Don't have an account?</p>
       <button className={style.authbtn} onClick={()=>setToggle(!toggle)}>Signup</button>
    </div>    
    <div id={style.right}>
    <p>Have an account?</p>
    <button className={style.authbtn} onClick={()=>setToggle(!toggle)}>Login</button>  
    </div>    
    </div>
    <div id={toggle?style.signup:style.login}> 
    {
        toggle?<Signup setToggle={setToggle} />:<Login setToggle={setToggle} />
    }  
    </div>
   

    </div>
  )
}

export default Auth