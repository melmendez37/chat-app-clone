import { supabaseServer } from "@/lib/supabase/server";
import { Suspense } from "react";
import ListMessages from "./ListMessages";

export default async function ChatMessages(){

    const supabase = await supabaseServer();

    const {data} = await supabase.from("messages").select("*,users(*)")

    console.log(data)
     
    return(
        <Suspense fallback = {"loading..."}>
            <ListMessages/>
        </Suspense>
    )
}