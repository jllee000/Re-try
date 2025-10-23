import React from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function App() {
  const navigate = useNavigate();
  return (
    <div className="App w-[500px] mx-auto  flex flex-col bg-red-50 relative">
      <header className="fixed z-10 top w-[500px] p-2 bg-white border-b border-gray-200 flex items-center justify-center cursor-pointer" onClick={()=>navigate('/login')}> 
        <p className='text-black font-bold text-xl'>
          Re:try
        </p>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
