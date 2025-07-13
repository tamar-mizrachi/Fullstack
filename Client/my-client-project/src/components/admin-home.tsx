"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Video, Plus, Search, ArrowLeft, Menu, X, LayoutDashboard, Upload } from "lucide-react"
import AddVideo from "./add-video"
import { ClassNames } from "@emotion/react"

function AdminHome() {
  const [open, setOpen] = useState<boolean>(false)
  const [dialogType, setDialogType] = useState<string>("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleAddVideo = () => {
    setDialogType("addVideo")
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const navigationItems  = [
    {
      icon: Video,
      label: "הסרטונים שלי",
      action: () => navigate("/admin-home/my-videos"),
      gradient: "from-blue-500 to-cyan-500",
   
    },
    {
      icon: Plus,
      label: "הוסף סרטון",
      action: handleAddVideo,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Search,
      label: "חיפוש",
      action: () => navigate("/admin-home/search"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: ArrowLeft,
      label: "חזרה",
      action: () => navigate("/"),
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
     
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
    
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">לוח בקרה</h1>
                <p className="text-sm text-purple-200">ניהול סרטונים</p>
              </div>
            </div>

        
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={item.action}
                  className="text-black hover:bg-black/20 flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
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
                {navigationItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => {
                      item.action()
                      setMobileMenuOpen(false)
                    }}
                    className="text-white hover:bg-white/20 justify-start flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="pt-16 min-h-screen">

        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                ברוך הבא
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  למרכז הניהול
                </span>
              </h1>
              <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto">
                נהל את הסרטונים שלך, העלה תוכן חדש וצפה בסטטיסטיקות
              </p>
            </div>
          </div>
        </section>

      
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">פעולות מהירות</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {navigationItems.map((item, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  onClick={item.action}
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div
                        className={`p-4 bg-gradient-to-r ${item.gradient} rounded-full group-hover:scale-110 transition-transform duration-300`}
                      >
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.label}</h3>
                    <p className="text-purple-200 text-sm">
                      {index === 0 && "צפה ונהל את הסרטונים שלך"}
                      {index === 1 && "העלה סרטון חדש לפלטפורמה"}
                      {index === 2 && "חפש סרטונים ותוכן"}
                      {index === 3 && "חזור לעמוד הראשי"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "סרטונים שהעלתי", value: "12", icon: Video },
                { label: "צפיות כולל", value: "1,234", icon: Search },
                { label: "העלאות השבוע", value: "3", icon: Upload },
              ].map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-purple-200 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

 
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">הוספת סרטון חדש</DialogTitle>
            <DialogDescription className="text-center">מלא את הפרטים כדי להעלות סרטון חדש לפלטפורמה</DialogDescription>
          </DialogHeader>
          {dialogType === "addVideo" && <AddVideo />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminHome


