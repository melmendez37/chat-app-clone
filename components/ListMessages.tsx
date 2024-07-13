"use client"

import { Imessage, useMessage } from "@/lib/store/messages"
import { supabaseBrowser } from "@/lib/supabase/browser"
import { MoveDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import Message from "./Message"
import { DeleteAlert, EditAlert } from "./MessageActions"

export default function ListMessages(){

    const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>

    const [userScroll, setUserScroll] = useState(false);

    const {messages, addMessage, optimisticIds, optimisticDeleteMessage, optimisticUpdateMessage
    } = useMessage((state)=>state);
    const supabase = supabaseBrowser()

    //
    useEffect(() => {
      const channel = supabase
        .channel('chat-room')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages' }, 
          
          async (payload) => {
            if(!optimisticIds.includes(payload.new.id)){
              console.log('Change received!', payload)
              const { error,data } = await supabase
                .from("users")
                .select("*")
                .eq("id", payload.new.send_by)
                .single();

              if(error){
                toast.error(error.message)
              }
              
              else{
                const newMessage = {
                  ...payload.new,
                  users:data
                };
                addMessage(newMessage as Imessage);
                
              }
            }
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, payload => {
          optimisticDeleteMessage(payload.old.id)
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, payload => {
          optimisticUpdateMessage(payload.new as Imessage)
        })
      .subscribe();

      return() => {
        channel.unsubscribe();
      }
    }, [messages]);

    useEffect(()=>{


      const scrollContainer = scrollRef.current;
      if(scrollContainer){
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, [messages])

    const handleOnScroll = () => {
      const scrollContainer = scrollRef.current;
      
      if(scrollContainer){
        const isScroll =
          scrollContainer.scrollTop <
          scrollContainer.scrollHeight -
            scrollContainer.clientHeight - 10;
        setUserScroll(isScroll);
      }
    };

    const scrollDown = () => {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    return(
        <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
            ref={scrollRef}
            onScroll={handleOnScroll}>
            

        <div className="flex-1"></div>
        <div className="space-y-7">

          {messages.map((value, index)=>{

            return <Message key={index} message={value}/>;
            
          })}

        </div>
          //the scroll down appears once you scroll up
        {userScroll && (<div className="absolute bottom-20 right-1/2">
          <div className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto 
          border cursor-pointer hover:scale-100 transition-all" onClick={scrollDown}>
            <MoveDown />
          </div>
        </div>)}

        <DeleteAlert/>
        <EditAlert/>

      </div>
    )
}