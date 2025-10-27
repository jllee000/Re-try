import React, { useEffect } from "react";
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

  const [message, setMessage] = React.useState<string>("불러오는 중...");

  const { data: messageData } = useQuery({
    queryKey: ["message", getTodayKey()], 
    queryFn: async () => {
      const res = await axios.post("http://localhost:8080/api/ai/ask", {
        question: `취준생인 나한테 10자 내의 응원의 한마디를 해줘. 취업생 고민에 맞으면서도 감성적이면서 명언같은 글귀 딱 하나만`,
      });
      return res.data;
    },
    enabled: shouldFetchMessage, // 오늘의 메시지가 없을 때만 
    staleTime: Infinity, 
  });

  useEffect(() => {
    const todayMessage = getTodayMessage();
    if (todayMessage) {
      setMessage(todayMessage);
      return;
    }
    if (messageData) {
      try {
        const aiMessage = messageData.candidates[0].content.parts[0].text;
        setMessage(aiMessage);
        
        localStorage.setItem('dailyMessage', JSON.stringify({
          date: getTodayKey(),
          message: aiMessage
        }));
      } catch (err) {
        console.error("메시지 파싱 오류:", err);
        setMessage("응원 메시지를 불러오지 못했습니다.");
      }
    }
  }, [messageData]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생!</div>;

  return (
    <div className="flex flex-col justify-center items-center pt-[50px] relative">
      <div className="fixed top-[39px] w-[500px] h-[120px] mx-auto text-center z-10 bg-red-100 flex flex-col justify-center items-center ">
        <p>오늘 {username}에게</p>
        <p className="text-[1.5rem]">{message}</p>
      </div>
      <div className="relative pt-[120px] w-full mx-auto flex flex-col gap-4 justify-center items-center">
        {data?.map((user: any, idx: number) => (
          <UserCard key={idx} name={user.name} userKey={user.userKey} />
        ))}
      </div>
    </div>
  );
};

export default Home;