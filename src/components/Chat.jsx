import { useEffect, useRef, useState } from "react"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import { auth, db, logOut } from "../firebase-config"
import { ArrowLeft, Ghost, LogOut, Send, User, Users } from "lucide-react"
import Cookies from "universal-cookie"


function Chat({ room, setRoom, setIsAuth }) {

  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const latestMessage = useRef()
  

  const messagesRef = collection(db, 'messages')
  

  useEffect(() => {
    const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"))
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      })

      setMessages(messages)
    })

    return () => unsubscribe()
  }, [room])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newMessage === "") return

    setNewMessage("")

    try {
      setIsLoading(true)
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        //user: auth.currentUser.displayName,
        user: auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
        room: room.toLowerCase(),
      })

      
    } catch (error) {
      console.error("Could not send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    latestMessage.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  const leaveRoom = () => {
    setRoom(null)
    localStorage.removeItem("room-name")
  }

  return (
    <div className="flex flex-col w-screen h-screen">

      <form className="flex flex-1 bg-white my-10 flex-col mx-auto md:max-w-2xl w-full max-w-lg shadow-md rounded-xl max-h-160" onSubmit={handleSubmit}>
        <div className="flex flex-row text-start bg-gray-50 border-b border-gray-100 p-4 rounded-t-xl  hover:opacity-100 duration-150 items-center text-gray-800 ease-in justify-between">
          <div className="flex flex-row text-start items-center text-gray-500 ease-in">
            <button type="button" className="cursor-pointer" onClick={leaveRoom}><ArrowLeft className="pr-1" /> </button>
            <span className="shadow-xs rounded-[50%] p-1 bg-blue-200"><Users className="text-white" /></span>
            <span className="pl-2 text-lg font-bold ">{room[0].toUpperCase() + room.slice(1)}</span>
          </div>

            <button
              onClick={async () => {
                  try {
                    await logOut()
                    Cookies.remove("auth-token")
                    setIsAuth(false)
                  } catch (error) {
                    console.error("Could not log out:", error)
                  }
                }}
             type="button" className="flex gap-1 items-center text-gray-500 cursor-pointer hover:text-red-300 duration-100 ease-in"><LogOut/> Logout</button>
        </div>
        <main className="flex-1 flex flex-col m-2 overflow-scroll scrollbar-none">
          {
            !messages[0] &&
            (
              <div className="m-auto text-gray-500">
                <Ghost className="m-auto size-20 opacity-10"/>
                <p>No messages to display</p>
                <p className="text-center opacity-40">Kick start the chat</p>
              </div>
            )
          }

          {messages && (
            messages.map((message) =>{

              return (
              <div ref={latestMessage} key={message.id} className="flex flex-col gap-0">
                <h2 className="flex flex-col bg-gray-100 m-2 w-fit py-2 px-6 rounded-xl">
                  {message.text}
                  <span className="flex items-center text-xs text-gray-300 justify-end pl-2 mt-1">
                    <User className="scale-60 " /> {message.user}
                  </span>
                </h2>

              </div>
            )})
          )
          }
        </main>
        <div className="border-t border-gray-200">
          <div className="m-2 flex bg-white border border-gray-300 rounded-xl">
            <input
              autoFocus
              className="p-3 flex-1 outline-none"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              placeholder="Type your message here..."
            />
            <button disabled={isLoading} type="submit" className="flex items-center px-5 cursor-pointer bg-blue-400 rounded-xl text-white hover:bg-blue-300 duration-75 ease-in">
              <Send className="pr-2" /> Send
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default Chat
