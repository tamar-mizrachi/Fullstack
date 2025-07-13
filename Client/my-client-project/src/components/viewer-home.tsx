
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, Search, ArrowLeft, Menu, X, Play, Users, Eye } from "lucide-react"

function ViewerHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const navigate = useNavigate()

  const navigationItems = [
    {
      icon: Video,
      label: "כל הסרטונים",
      action: () => navigate("/viewer-home/all-videos"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Search,
      label: "חיפוש",
      action: () => navigate("/viewer-home/search"),
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">VidShare</h1>
                <p className="text-sm text-purple-200">צפייה בסרטונים</p>
              </div>
            </div>

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
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

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                גלה
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  סרטונים{" "}
                </span>
                מדהימים
              </h1>
              <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto">
                צפה בסרטונים איכותיים, למד דברים חדשים וגלה תוכן מעניין מהקהילה שלנו
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">מה תרצה לעשות?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
                      {index === 0 && "צפה בכל הסרטונים הזמינים"}
                      {index === 1 && "חפש סרטונים לפי נושא"}
                      {index === 2 && "חזור לעמוד הראשי"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">למה לצפות אצלנו?</h2>
              <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                אנחנו מציעים חוויית צפייה מעולה עם תוכן איכותי
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Video,
                  title: "תוכן איכותי",
                  description: "סרטונים באיכות גבוהה מיוצרי תוכן מובילים",
                },
                {
                  icon: Users,
                  title: "קהילה פעילה",
                  description: "הצטרף לקהילה של אלפי צופים ויוצרי תוכן",
                },
                {
                  icon: Eye,
                  title: "חוויית צפייה מעולה",
                  description: "נגן וידאו מתקדם עם תכונות חכמות",
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
    </div>
  )
}

export default ViewerHome
