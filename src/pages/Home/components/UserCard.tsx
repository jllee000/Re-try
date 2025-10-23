import React from "react";
interface UserCardProps {
    name: string;
    userKey: string;
}
const UserCard = ({name,userKey}:UserCardProps)=> {
    return (
         <div className="flex flex-row justify-between items-center p-2 border-b border-gray-200 h-[150px] w-[80%] rounded-[10px]" key={userKey}>
           <img className="w-[100px]" src="https://cdn-icons-png.flaticon.com/512/6862/6862931.png" alt="profile-img"/>
           <span>{name}</span>
           <button type="button" className="bg-red-300 rounded-[10px] border border-gray-200 p-2 cursor-pointer" aria-label="채팅입장">대화하기</button>
        </div>
    );
}   
export default UserCard;