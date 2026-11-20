import { Mail } from "lucide-react"
import { auth, provider, signIn } from "../firebase-config"
import { signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"

import Cookies from "universal-cookie"
import { FiLoader } from "react-icons/fi"
const cookies = new Cookies()

function Auth({ setIsAuth }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      const results = await signInWithPopup(auth, provider)
      cookies.set("auth-token", results.user)
      console.log('user logged in', results.user.refreshToken)
      setIsAuth(true)
    } catch (err) {
      console.log(console.error(err.message));
    }finally{
      setIsLoading(false)
    }
  }

  const signInWithEmail = async () => {
    try {
      setIsLoadingEmail(true)
      const results = await signIn(auth, email, password)
      cookies.set("auth-token", results.user)
      setIsAuth(true)
      setEmail("")
      setPassword("")
      console.log("user logged in", results.user.refreshToken)
    } catch (err) {
      console.error(err.message)
    }finally{
      setIsLoadingEmail(false)
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); signInWithEmail() }} className="header flex flex-col w-[100%] max-w-sm shadow-xl mx-auto mt-8 items-center text-center bg-white p-8 rounded-xl justify-center">
      <div className=" text-2xl mb-10 flex items-center">Sign In <Mail className="ml-1"/></div>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="loginInput" />
      <input
        type="password"
        placeholder="Enter paswword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="loginInput" />
      <button
        type="submit"
        disabled={isLoadingEmail}
        className="flex items-center justify-center mb-4 mt-5 cursor-pointer bg-blue-600  text-white p-2 rounded-3xl w-full  hover:bg-gray-950 hover:text-white ease-in duration-75"
        >
          {isLoadingEmail
          ? (<span className="flex items-center justify-center"><FiLoader className="animate-spin mr-1"/> Signing in...</span>)
          : 'Sign In'}</button>

      <div className="grid grid-cols-3 w-full align-middle justify-around  my-4">
        <span className="h-0.5 bg-gray-200 translate-y-3"></span>
        <p className="px-2"> Or </p>
        <span className="h-0.5 bg-gray-200 translate-y-3"></span>
      </div>


      <p>Sign in with Google to continue</p>
      <button
        type="button"
        onClick={signInWithGoogle}
        className=" border px-4 py-2 rounded-3xl m-2 hover:bg-gray-950 w-full hover:text-white ease-in duration-75 cursor-pointer"
        >
          {isLoading
          ? (<span className="flex items-center justify-center"><FiLoader className="animate-spin mr-1"/> Signing in...</span> )
          : (<span className="flex items-center justify-center">Sign in with Google <FcGoogle className="ml-2 size-5"/></span>)
          }
      </button>
    </form>
  )
}

export default Auth
