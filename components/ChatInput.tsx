"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { Input } from "./ui/input";

export default function ChatInput(){
    
    const supabase = supabaseBrowser()

    const handleSendMessage = async (text:string) => {
        const {error} = await supabase.from("messages").insert({text});

        if(error){
            toast.error(error.message);
        }
    };

    return(

    <div className="p-5">

        <Input placeholder="Send message" onKeyDown={(e)=>{
            if(e.key === "Enter"){
                handleSendMessage(e.currentTarget.value);
                e.currentTarget.value = "";
            }
        }}/>

    </div>
    )
}