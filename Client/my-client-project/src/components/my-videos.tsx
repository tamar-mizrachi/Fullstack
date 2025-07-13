
"use client"


import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Video, Trash2, Calendar, User, Loader2, AlertTriangle, Play, Edit } from "lucide-react"
import EditVideo from "./edit-video"
import VideoPlayer from "./video-player"
import Modal from "./modal"

type VideoType = {
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

type Category = {
  id: number
  name: string
}

const MyVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null)
  const [playingVideo, setPlayingVideo] = useState<VideoType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdStr = localStorage.getItem("userId")
        if (!userIdStr) {
          setError("משתמש לא מחובר")
          setLoading(false)
          return
        }

        const userId = Number.parseInt(userIdStr)

        // טען סרטונים וקטגוריות במקביל
        const [videosRes, categoriesRes] = await Promise.all([
          axios.get(`https://localhost:7087/api/Video/user/${userId}`),
          axios.get("https://localhost:7087/api/Category"),
        ])

        setVideos(videosRes.data)
        setCategories(categoriesRes.data)
        setLoading(false)
      } catch (err) {
        console.error("שגיאה בטעינת הנתונים:", err)
        setError("שגיאה בטעינת הסרטונים")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "כללי"
  }

  const handleDelete = async (videoId: number) => {
    if (!window.confirm("אתה בטוח שברצונך למחוק את הסרטון?")) return

    setDeletingId(videoId)
    try {
      await axios.delete(`https://localhost:7087/api/Video/${videoId}`)
      setVideos((prev) => prev.filter((video) => video.id !== videoId))
    } catch (error) {
      console.error("שגיאה במחיקת הסרטון:", error)
      alert("מחיקת הסרטון נכשלה")
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (video: VideoType) => {
    setEditingVideo(video)
  }

  const handleCloseEdit = () => {
    setEditingVideo(null)
    // רענן את רשימת הסרטונים אחרי עריכה
    const userIdStr = localStorage.getItem("userId")
    if (userIdStr) {
      const userId = Number.parseInt(userIdStr)
      axios
        .get(`https://localhost:7087/api/Video/user/${userId}`)
        .then((res) => {
          setVideos(res.data)
        })
        .catch((err) => {
          console.error("שגיאה בטעינת הסרטונים:", err)
        })
    }
  }

  const handlePlayVideo = (video: VideoType) => {
    setPlayingVideo(video)
  }

  const handleCloseVideo = () => {
    setPlayingVideo(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">טוען סרטונים...</h3>
          <p className="text-slate-600">אנא המתן בזמן שהסרטונים נטענים</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Alert className="border-red-200 bg-red-50 max-w-md">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // אם יש סרטון בעריכה, הצג את קומפוננטת העריכה
  if (editingVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <EditVideo video={editingVideo} onClose={handleCloseEdit} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            הסרטונים שלי
          </h1>
          <p className="text-slate-600">נהל את הסרטונים שהעלתי לפלטפורמה</p>
        </div>

        {videos.length === 0 ? (
          <Card className="max-w-md mx-auto text-center shadow-xl">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">אין סרטונים להצגה</h3>
              <p className="text-slate-600 mb-4">עדיין לא העלתי סרטונים לפלטפורמה</p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                העלה סרטון ראשון
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative">
                  <div
                    className="aspect-video bg-black relative overflow-hidden cursor-pointer"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <video
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      poster="/placeholder.svg?height=200&width=300"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-slate-800 ml-1" />
                      </div>
                    </div>
                    {/* הוספת אינדיקטור נוסף לצפייה */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      לחץ לצפייה
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="h-4 w-4" />
                      <span>{video.nameTalk}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(video.createdDate).toLocaleDateString("he-IL")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary">סרטון #{video.id}</Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayVideo(video)}
                        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                       
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(video)
                        }}
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                    
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(video.id)
                        }}
                        disabled={deletingId === video.id}
                        className="bg-red-50 hover:bg-red-100 border-blue-200 text-red-700"
                      >
                        {deletingId === video.id ? (
                          <Loader2 className=" h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className=" h-4 w-4 mr-1" />
                    
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* מודל לצפייה בסרטון */}
      {playingVideo && (
        <Modal onClose={handleCloseVideo} title={playingVideo.title}>
          <VideoPlayer video={playingVideo} categoryName={getCategoryName(playingVideo.categoryId)} />
        </Modal>
      )}
    </div>
  )
}

export default MyVideos
