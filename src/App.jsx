import { useState, useRef } from 'react'
import './App.css'
import Auth from './components/Auth'
import { LuMessageCircleMore } from "react-icons/lu";


import Cookies from "universal-cookie"
import Chat from './components/Chat'
import { LogOut } from 'lucide-react';
import { logOut } from './firebase-config';
const cookies = new Cookies()

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
  const [room, setRoom] = useState(() => {
    const savedRoom = localStorage.getItem("room-name")
    return savedRoom ? JSON.parse(savedRoom) : null
  })

  const roomInputRef = useRef(null)

  const enterRoom = (e) => {
    e.preventDefault()
    const roomName = roomInputRef.current.value.trim().toLowerCase()
    if(!roomName) return
    setRoom(roomName)
    localStorage.setItem("room-name", JSON.stringify(roomName))
  }

  const handleLogout = async () => {
    try {
      await logOut()
      cookies.remove("auth-token")
      setIsAuth(false)
    } catch (error) {
      console.error("Could not log out:", error)
    }
  }

  if (!isAuth) {
    return (
      <div className='bg-gray-100 flex flex-col h-screen'>
        <h1 className='header text-4xl text-center mt-8'>Welcome To ChatApp</h1>
        <Auth setIsAuth={setIsAuth} />
      </div>
    )
  }

  return(
    <div className='bg-gray-100 flex h-screen'>
      {room
      ? (
        <Chat room={room} setIsAuth={setIsAuth} setRoom={setRoom} />
      )
      : (
        <form className='mx-auto w-md my-auto flex flex-col bg-white p-5 shadow rounded-xl'>
          <div className='flex justify-between text-gray-500 border-b pb-3 border-gray-50'>
            <h1 onClick={()=> setRoom()} className='font-bold text-2xl'>ChatApp</h1>
            <button onClick={handleLogout} type="button" className="flex gap-1 items-center cursor-pointer hover:text-red-300 duration-100 ease-in"><LogOut/> Logout</button>
          </div>
          <LuMessageCircleMore className='size-20 items-center w-full opacity-15 my-4'/>
          <label className='text-gray-400 m-auto mb-5' htmlFor='roomInput'>Join A Chat Room </label>
          <input autoFocus ref={roomInputRef} className='border border-gray-300 m-2 mb-7 p-2 rounded-xl outline-none ' placeholder='Enter a chat room e.g. Soccer' id="roomInput"/>
          <button  onClick={enterRoom} className='bg-blue-400 cursor-pointer text-white rounded-xl p-2'>Enter Chat</button>
        </form>
      )}
    </div>
  )

}

export default App
