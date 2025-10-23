import React, {useState} from "react";
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

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생!</div>;

  return (
    <div className="flex flex-col justify-center items-center pt-[50px] relative">
       <div className="fixed top-[39px] w-[500px] h-[120px] mx-auto text-center z-10 bg-red-100 flex flex-col justify-center items-center ">
            <p>오늘 {username}에게</p>
            <p className="text-[2rem]">화이팅!</p>
       </div>
      <div className="relative pt-[120px] w-full mx-auto flex flex-col gap-4 justify-center items-center">
            {data?.map((user: any) => (
                <UserCard key={user.userKey} name={user.name} userKey={user.userKey} />
        ))}
      </div>
    </div>
  );
};
export default Home;