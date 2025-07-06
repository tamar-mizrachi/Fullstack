"use client"

import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void
}

interface LoginResponse {
  token: string
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name: boolean; password: boolean }>({
    name: false,
    password: false,
  })

 // const router = useRouter()
const navigate= useNavigate()
  const handleLogin = async () => {
    // בדיקת שדות ריקים
    const newErrors = {
      name: !name.trim(),
      password: !password.trim(),
    }
    setErrors(newErrors)
    if (newErrors.name || newErrors.password) return

    setLoading(true)

    try {
      const res = await fetch('https://localhost:7087/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data: LoginResponse = await res.json()
      const token = data.token
      localStorage.setItem('authToken', token)

      // פענוח הטוקן
      const decodedToken = JSON.parse(atob(token.split('.')[1]))
      console.log('Decoded JWT payload:', decodedToken)

      // ניסיון לשלוף את userId ממספר מפתחות שונים ב-JWT
      const userId =
        decodedToken.userId || // אם השתמשת בשם כזה בשרת
        decodedToken.nameid || // ClaimTypes.NameIdentifier
        decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] // claim רגיל של .NET

      if (!userId) {
        throw new Error("User ID not found in token")
      }

      localStorage.setItem('userId', userId) // שמירת userId

      // קבלת תפקיד המשתמש מהטוקן והפניה לפי תפקיד
      const role =
        decodedToken.role ||
        decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

      if (role === 'Admin') {
        navigate('/admin-home')
      } else if (role === 'Viewer') {
        navigate('/viewer-home')
      } else {
       navigate('/')
      }

      setIsLoggedIn(true)
    } catch (error) {
      console.error('Login Error:', error)
      alert('Invalid login credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">שם משתמש</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="הכנס את שם המשתמש שלך"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-red-500 text-sm">שם משתמש נדרש</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="הכנס את הסיסמה שלך"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-red-500 text-sm">סיסמה נדרשת</p>}
      </div>
      <Button type="submit" className="text-black w-full" disabled={loading}>
        <LogIn className="text-black" />  
        {loading ? 'מתחבר...' : 'התחבר'}
      </Button>
    </form>
  )
}

export default Login