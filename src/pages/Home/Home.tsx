import React, {useState, useEffect} from "react";
import UserCard from "./components/UserCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get("username") || ""; 
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/user");
      return res.data;
    },
  });
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
      const fetchMessage = async () => {
        try {
         const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDYLzC81gjW1KJDW4vqSGxAFXVumWaRjtw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `따뜻한 한 줄 응원문구로 딱 한개만 줘` }] }]
          })
        });
        const data = await res.json();
        setMessage(data.candidates?.[0]?.content?.parts?.[0]?.text || "오늘도 파이팅 💪");

        } catch (err) {
          console.error(err);
          setMessage("응원문구를 불러오지 못했어요 😢");
        }
      };

      fetchMessage();
    }, [username]); 

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생!</div>;

  return (
    <div className="flex flex-col justify-center items-center pt-[50px] relative">
       <div className="fixed top-[39px] w-[500px] h-[120px] mx-auto text-center z-10 bg-red-100 flex flex-col justify-center items-center ">
            <p>오늘 {username}에게</p>
            <p className="text-[1.5rem]">{message}</p>
       </div>
      <div className="relative pt-[120px] w-full mx-auto flex flex-col gap-4 justify-center items-center">
            {data?.map((user: any,idx:number) => (
                <UserCard key={idx} name={user.name} userKey={user.userKey} />
        ))}
      </div>
    </div>
  );
};
export default Home;