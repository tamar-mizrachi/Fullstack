"use client"

import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Eye, EyeOff } from "lucide-react"

const Register: React.FC = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ 
    name?: boolean
    password?: boolean
    email?: boolean
    role?: boolean 
  }>({})
  
//  const router = useRouter()
const navigate = useNavigate()
  const handleRegister = async () => {
    let newErrors = {
      name: !name,
      password: !password,
      email: !email,
      role: !role
    }
    setErrors(newErrors)

    if (Object.values(newErrors).includes(true)) return

    try {
      const res = await fetch('https://localhost:7087/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          password: password,
          email: email,
          role: role
        }),
      })

      const data = await res.json()
      console.log('Response:', data)

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      if (data.role == 'Admin') {
        console.log('Navigating to admin-home')
        navigate('/admin-home')
      } else if (data.role == 'Viewer') {
       navigate('/viewer-home')
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error during registration:', err.message)
        alert('Registration failed: ' + err.message)
      } else {
        console.error('Unknown error during registration:', err)
        alert('An unknown error occurred.')
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleRegister()
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
        <Label htmlFor="email">אימייל</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="הכנס את האימייל שלך"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-red-500 text-sm">אימייל נדרש</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="בחר סיסמה חזקה"
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">סיסמה נדרשת</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">תפקיד</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
            <SelectValue placeholder="בחר תפקיד" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">מנהל</SelectItem>
            <SelectItem value="Viewer">צופה</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-red-500 text-sm">בחירת תפקיד נדרשת</p>}
      </div>
      
      <Button type="submit" className="text-black w-full">
        <UserPlus className="mr-2 h-4 w-4" style={{color:"black"}} />
        הירשם
      </Button>
    </form>
  )
}

export default Register