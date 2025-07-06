"use client"


import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Calendar,
  Video,
  Eye,
  Heart,
  Settings,
  Upload,
  Edit3,
  Save,
  Camera,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface UserData {
  id: number
  name: string
  email: string
  joinDate: string
  bio: string
  avatar?: string
  videosCount: number
  totalViews: number
  totalLikes: number
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    id: 1,
    name: "משתמש דוגמה",
    email: "user@example.com",
    joinDate: "2024-01-15",
    bio: "יוצר תוכן בתחום הטכנולוגיה והחינוך",
    videosCount: 12,
    totalViews: 1234,
    totalLikes: 89,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(userData)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUserData(editedData)
      setIsEditing(false)
      setSuccess(true)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("שגיאה בעדכון הפרופיל")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
    setError(null)
  }

  const stats = [
    {
      icon: Video,
      label: "סרטונים",
      value: userData.videosCount,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Eye,
      label: "צפיות",
      value: userData.totalViews.toLocaleString(),
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Heart,
      label: "לייקים",
      value: userData.totalLikes,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            הפרופיל שלי
          </h1>
          <p className="text-slate-600">נהל את הפרטים האישיים והגדרות החשבון</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">הפרופיל עודכן בהצלחה!</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              פרופיל
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              סטטיסטיקות
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              הגדרות
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      פרטים אישיים
                    </CardTitle>
                    <CardDescription>עדכן את הפרטים האישיים שלך</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      ערוך
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? (
                          "שומר..."
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            שמור
                          </>
                        )}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" disabled={loading}>
                        ביטול
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">{userData.name[0]}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        variant="outline"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{userData.name}</h3>
                    <p className="text-slate-600">{userData.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        הצטרף ב-{new Date(userData.joinDate).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם מלא</Label>
                    <Input
                      id="name"
                      value={isEditing ? editedData.name : userData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editedData.email : userData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">אודות</Label>
                  <Textarea
                    id="bio"
                    placeholder="ספר על עצמך..."
                    value={isEditing ? editedData.bio : userData.bio}
                    onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                      <div className="text-slate-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Activity Chart Placeholder */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>פעילות חודשית</CardTitle>
                  <CardDescription>צפיות ולייקים בחודש האחרון</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">גרף פעילות יוצג כאן</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>פעילות אחרונה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "העלה סרטון חדש", time: "לפני 2 שעות", icon: Upload },
                      { action: "קיבל 5 לייקים", time: "לפני 4 שעות", icon: Heart },
                      { action: "100 צפיות חדשות", time: "לפני יום", icon: Eye },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <activity.icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-slate-600">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    הגדרות חשבון
                  </CardTitle>
                  <CardDescription>נהל את הגדרות החשבון והפרטיות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">התראות אימייל</h4>
                        <p className="text-sm text-slate-600">קבל התראות על פעילות חדשה</p>
                      </div>
                      <Button variant="outline" size="sm">
                        הפעל
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">פרופיל ציבורי</h4>
                        <p className="text-sm text-slate-600">אפשר למשתמשים אחרים לראות את הפרופיל</p>
                      </div>
                      <Button variant="outline" size="sm">
                        הפעל
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">אימות דו-שלבי</h4>
                        <p className="text-sm text-slate-600">הוסף שכבת אבטחה נוספת לחשבון</p>
                      </div>
                      <Button variant="outline" size="sm">
                        הגדר
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="font-medium text-red-600 mb-4">אזור מסוכן</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                        שנה סיסמה
                      </Button>
                      <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                        מחק חשבון
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UserProfile
