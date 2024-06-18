import ChatHeader from "@/components/ChatHeader";
import { supabaseServer } from "@/lib/sufabase/server";

export default async function Page(){
  const supabase = supabaseServer();

  const { data } = await supabase.auth.getSession();

  console.log(data);

  return <div className="max-w-3xl mx-auto md:py-10 h-screen">
    <div className="h-full border rounded-md">
      <ChatHeader/>
    </div>
  </div>
}