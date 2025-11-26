import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createUser = useMutation({
    mutationFn: async (name: string) => {
      const res = await axios.post("http://localhost:8080/api/user", null, {
        params: { name },
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("✅ 유저 생성 성공:", data);
      localStorage.setItem("userToken",data.token);
      navigate("/?name=" + username);
    },
    onError: (error) => {
      console.error("❌ 유저 생성 실패:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return alert("이름을 입력하세요!");
    createUser.mutate(username);
  };

  return (
     <div className='flex flex-col h-[100dvh] justify-center items-center pt-[50px]'>
        <img className="w-[70%]" src="https://cdn-icons-png.flaticon.com/512/6644/6644904.png" alt='main-login-img'/>
        <form  onSubmit={handleSubmit} className='flex flex-col justify-center items-center' >
            <div className='flex flex-col p-12 justify-center items-center gap-2'>
                <label htmlFor="username">이름을 입력해주세요</label>
                <input className='rounded-[10px] p-2 border-gray-300 border' type="text" id="username" name="username" onChange={(e)=>setUsername(e.target.value)}/>
            </div>
            <button className='bg-red-300 text-white w-[80%] rounded-[10px] p-2  border-gray-300 border' type="submit" >입장</button>
        </form>
     </div> 
  );
};

export default Login;
