'use client';

import { signOut } from "next-auth/react";
import { Button } from "./button";


const  UserAccountnav = ()=> {
 
    return (
        <Button variant="destructive" className="{buttonVariants()}" onClick={()=>signOut({
            redirect:true,
            callbackUrl:`${window.location.origin}/auth/sign-in`
        })} >
            Logout
        </Button>
    )
  }

  export default UserAccountnav;