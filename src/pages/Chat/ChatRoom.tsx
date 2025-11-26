import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
const ChatPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const targetUserId = Number(params.get("userKey"));
  const targetName = params.get("name");

  const token = localStorage.getItem("userToken") || "";
  const currentUserId = JSON.parse(atob(token.split(".")[1])).sub;

  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 방 아이디 생성
  const roomId =
    currentUserId < targetUserId
      ? `${currentUserId}_${targetUserId}`
      : `${targetUserId}_${currentUserId}`;

  // WebSocket 연결 (추후 stomp로 대체)
  useEffect(() => {
    // 예시: 메시지 받아오기 (백엔드 붙으면 stomp로 교체)
    console.log("roomId:", roomId);
     axios
    .get(`http://localhost:8080/api/chat/messages?roomId=${roomId}`)
    .then((res) => {
      setMessages(res.data);
    })
  }, [roomId]);


const stompClientRef = useRef<any>(null);

useEffect(() => {
  const socket = new SockJS("http://localhost:8080/ws/chat");

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 500,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log("🔥 STOMP Connected!");

    
      client.subscribe(`/topic/chat/${roomId}`, (message) => {
            const received = JSON.parse(message.body);

            // 내가 보낸 메시지면 UI에 다시 추가 X
            if (received.senderId === currentUserId) return;

            setMessages((prev) => [...prev, received]);
            });

    },
    onStompError: (frame) => {
      console.error("STOMP Error:", frame);
    },
  });

  client.activate();
  stompClientRef.current = client;

  // 🔥 여기서는 async 쓰지 마!
  return () => {
    client.deactivate(); // ← 이건 Promise 반환하지만 React는 무시함 OK
  };
}, [roomId, token]);


  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
 const handleSend = () => {
    if (!inputValue.trim()) return;

    const msg = {
        roomId,
        content: inputValue,
    };
    const newMessage = {
        roomId,
        senderId: currentUserId, // 추가
        content: inputValue,
        timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    stompClientRef.current?.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(msg),
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setInputValue("");
    };


  return (
    <div className="flex flex-col h-[100dvh] bg-[#f5f5f5]">

      {/* 상단 바 */}
      <div className="p-4 bg-white shadow-md text-center border-b font-semibold">
        {targetName} 님과의 대화
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-scroll px-4 py-2 flex flex-col gap-3">

        {messages.map((msg, index) => {
        const text = msg.content ?? msg.message;
          const isMine = msg.senderId === currentUserId;

          return (
            <div
              key={index}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[60%] px-3 py-2 rounded-xl text-sm shadow 
                ${isMine ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
              >
                {text}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      {/* 입력창 */}
      <div className="p-3 bg-white flex gap-2 border-t">
        <input
          className="flex-1 border p-2 rounded-lg"
          placeholder="메시지를 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
            }
            }}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-red-400 text-white rounded-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
