"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Users, Video, Star, LogIn, UserPlus, Info, Menu, X } from "lucide-react"
import Login from "./login"
import Register from "./register"

function Home() {
  const [formType, setFormType] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()
  const handleButtonClick = (type: string) => {
    setFormType(type)
    setOpen(true)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const renderForm = () => {
    if (formType === "login") {
      return <Login setIsLoggedIn={setIsLoggedIn} />
    } else if (formType === "register") {
      return <Register />
    }
    return null
  }

  const stats = [
    { icon: Video, label: "סרטונים", value: "10,000+" },
    { icon: Users, label: "משתמשים", value: "50,000+" },
    { icon: Play, label: "צפיות", value: "1M+" },
    { icon: Star, label: "דירוג", value: "4.9" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">VidShare</h1>
                <p className="text-sm text-purple-200">פלטפורמת שיתוף וידאו</p>
              </div>
            </div>


            <nav className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("login")}
                className="text-black hover:bg-white/20"
              >
                <LogIn className="mr-2 h-4 w-4" />
                התחברות
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("register")}
                className="text-black hover:bg-black/20"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                הרשמה
              </Button>
              <Button
                variant="ghost"
                onClick={() => alert("Sorry, the site is currently under construction, please try again later.")}
                className="text-black hover:bg-white/20"
              >
                <Info className="mr-2 h-4 w-4" />
                אודותינו
              </Button>
            </nav>


            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleButtonClick("login")
                    setMobileMenuOpen(false)
                  }}
                  className="text-black hover:bg-white/20 justify-start"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  התחברות
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleButtonClick("register")
                    setMobileMenuOpen(false)
                  }}
                  className="text-black hover:bg-black/20 justify-start"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  הרשמה
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    alert("Sorry, the site is currently under construction, please try again later.")
                    setMobileMenuOpen(false)
                  }}
                  className="text-black hover:bg-white/20 justify-start"
                >
                  <Info className="mr-2 h-4 w-4" />
                  אודותינו
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="pt-16">

        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                שתף את
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  הסרטונים{" "}
                </span>
                שלך
              </h1>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                פלטפורמה מתקדמת לשיתוף וצפייה בסרטונים איכותיים. הצטרף לקהילה שלנו והתחל לשתף את התוכן שלך היום
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => handleButtonClick("register")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  הצטרף עכשיו
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleButtonClick("login")}
                  className="border-black/30 text-black hover:bg-white/10 px-8 py-3 text-lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  התחבר
                </Button>
              </div>
            </div>
          </div>


          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-purple-200 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">למה לבחור בנו?</h2>
              <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                אנחנו מציעים את הכלים הטובים ביותר לשיתוף וצפייה בסרטונים
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Video,
                  title: "איכות גבוהה",
                  description: "העלה וצפה בסרטונים באיכות HD ו-4K",
                },
                {
                  icon: Users,
                  title: "קהילה פעילה",
                  description: "הצטרף לקהילה של יוצרי תוכן ומעריצים",
                },
                {
                  icon: Star,
                  title: "חוויית משתמש מעולה",
                  description: "ממשק פשוט ונוח לשימוש עם תכונות מתקדמות",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-purple-200">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div> 
        </section>

      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{formType === "login" ? "התחברות" : "הרשמה"}</DialogTitle>
            <DialogDescription className="text-center">
              {formType === "login" ? "התחבר לחשבון שלך כדי להמשיך" : "צור חשבון חדש והצטרף אלינו"}
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home


