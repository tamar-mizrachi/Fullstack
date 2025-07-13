
"use client"


import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Tag, ArrowLeft, Loader2 } from "lucide-react"

interface Video {
  id: number
  title: string
  description: string
  videoUrl: string
  createdDate: string
  uploadDate: string
  nameTalk: string
  categoryId: number
  userId: number
}

interface VideoDetailsProps {
  video: Video
  onClose: () => void
}

interface Category {
  id: number
  name: string
}

const VideoDetails: React.FC<VideoDetailsProps> = ({ video, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  //const router = useRouter()
const navigate = useNavigate()
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://localhost:7087/api/Category")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        } else {
          console.error("Failed to fetch categories")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "לא ידוע"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">טוען פרטי סרטון...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">לא נמצאו פרטי סרטון.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 text-slate-800">{video.title}</CardTitle>
              <CardDescription className="text-base">{video.description}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Video Player */}
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video width="100%" height="400" controls className="w-full h-[400px] object-contain">
              <source src={video.videoUrl} type="video/mp4" />
              הדפדפן שלך לא תומך בניגון וידאו.
            </video>
          </div>

          <Separator />

          {/* Video Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">שם ההרצאה</p>
                  <p className="text-lg font-semibold text-slate-800">{video.nameTalk}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">קטגוריה</p>
                  <Badge variant="secondary" className="mt-1">
                    {getCategoryName(video.categoryId)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">תאריך יצירה</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {new Date(video.createdDate).toLocaleDateString("he-IL")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">תאריך העלאה</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {new Date(video.uploadDate).toLocaleDateString("he-IL")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              סגור
            </Button>
            <Button onClick={() => navigate("/admin-home/my-videos")} className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              חזרה לרשימת הסרטונים
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VideoDetails
