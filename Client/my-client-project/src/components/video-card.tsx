/*

"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2, Info, Play, Calendar, User, AlertTriangle, RefreshCw } from "lucide-react"

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

type ModalType = "details" | "edit" | "delete" | null

interface VideoCardProps {
  video: Video
  openModal: (video: Video, type: ModalType) => void
}

const VideoCard: React.FC<VideoCardProps> = ({ video, openModal }) => {
  const [videoError, setVideoError] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("שגיאת טעינת וידאו:", e)
    console.error("כתובת URL של הוידאו שנכשל:", video.videoUrl)
    setVideoError(true)
  }

  const handleVideoSuccess = () => {
    setVideoError(false)
  }

  const handleRetry = () => {
    setVideoError(false)
    setRetryCount((prev) => prev + 1)
    // Force video reload
    const videoElement = document.querySelector(`video[data-video-id="${video.id}"]`) as HTMLVideoElement
    if (videoElement) {
      videoElement.load()
    }
  }

  const getVideoSources = () => {
    const baseUrl = video.videoUrl
    const sources = [
      { src: baseUrl, type: "video/mp4" },
      //{ src: baseUrl.replace(/\.[^/.]+$/, ".webm"), type: "video/webm" },
    ]
    // אם זה נתיב יחסי, נסה גם עם נתיבים מלאים
    if (!baseUrl.startsWith("http")) {
      sources.push({ src: `${window.location.origin}${baseUrl}`, type: "video/mp4" })
    }

    return sources
  }

  return (
    <Card
      className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-video bg-black relative overflow-hidden">
          {videoError ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm text-red-400 font-medium mb-2">שגיאה בטעינת הסרטון</p>
                <p className="text-xs text-slate-400 mb-3 break-all max-w-[200px]">{video.videoUrl}</p>
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  נסה שוב ({retryCount})
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                data-video-id={video.id}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleVideoError}
                onLoadedData={handleVideoSuccess}
                poster="/placeholder.svg?height=200&width=300"
                preload="metadata"
                crossOrigin="anonymous"
              >
                {getVideoSources().map((source, index) => (
                  <source key={index} src={source.src} type={source.type} />
                ))}
                הדפדפן שלך לא תומך בתג הווידאו
              </video>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="h-6 w-6 text-slate-800 ml-1" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 text-slate-800">{video.title}</CardTitle>
        <CardDescription className="line-clamp-2">{video.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {videoError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs">
              בעיה בטעינת הסרטון. ייתכן שהקובץ לא קיים או שהפורמט לא נתמך.
            </AlertDescription>
          </Alert>
        )}

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
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal(video, "details")}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Info className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal(video, "edit")}
              className="h-8 w-8 p-0 hover:bg-green-100"
            >
              <Pencil className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal(video, "delete")}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoCard
*/

"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2, Info, Play, Calendar, User, AlertTriangle, RefreshCw } from "lucide-react"
import { useEffect, useRef } from "react"

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

type ModalType = "details" | "edit" | "delete" | "watch" | null

interface VideoCardProps {
  video: Video
  openModal: (video: Video, type: ModalType) => void
  onWatchVideo?: (video: Video) => void // פונקציה חדשה לצפייה
}

const VideoCard: React.FC<VideoCardProps> = ({ video, openModal, onWatchVideo }) => {
  const [videoError, setVideoError] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("שגיאת טעינת וידאו:", e)
    console.error("כתובת URL של הוידאו שנכשל:", video.videoUrl)
    setVideoError(true)
  }

  const handleVideoSuccess = () => {
    setVideoError(false)
  }
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
  
    if (isHovered) {
      video.currentTime = 0
      video.play().catch(err => {
        console.warn("בעיה בהפעלת הסרטון:", err)
      })
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered])
  
  const handleRetry = () => {
    setVideoError(false)
    setRetryCount((prev) => prev + 1)
    // Force video reload
    const videoElement = document.querySelector(`video[data-video-id="${video.id}"]`) as HTMLVideoElement
    if (videoElement) {
      videoElement.load()
    }
  }

  const handleWatchClick = () => {
    if (onWatchVideo) {
      onWatchVideo(video)
    } else {
      openModal(video, "watch")
    }
  }

  const getVideoSources = () => {
    const baseUrl = video.videoUrl
    const sources = [
      { src: baseUrl, type: "video/mp4" },
      //{ src: baseUrl.replace(/\.[^/.]+$/, ".webm"), type: "video/webm" },
    ]
    // אם זה נתיב יחסי, נסה גם עם נתיבים מלאים
    if (!baseUrl.startsWith("http")) {
      sources.push({ src: `${window.location.origin}${baseUrl}`, type: "video/mp4" })
    }

    return sources
  }

  return (
    <Card
      className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-video bg-black relative overflow-hidden">
          {videoError ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm text-red-400 font-medium mb-2">שגיאה בטעינת הסרטון</p>
                <p className="text-xs text-slate-400 mb-3 break-all max-w-[200px]">{video.videoUrl}</p>
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  נסה שוב ({retryCount})
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* <video
                data-video-id={video.id}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleVideoError}
                onLoadedData={handleVideoSuccess}
                poster="/placeholder.svg?height=200&width=300"
                preload="metadata"
                crossOrigin="anonymous"
              >
                {getVideoSources().map((source, index) => (
                  <source key={index} src={source.src} type={source.type} />
                ))}
                הדפדפן שלך לא תומך בתג הווידאו
              </video> */}
<video
  ref={videoRef}
  data-video-id={video.id}
  className="w-full h-full object-cover transition-transform duration-300"
  onError={handleVideoError}
  onLoadedData={handleVideoSuccess}
  poster="/placeholder.svg?height=200&width=300"
  preload="metadata"
  muted
  playsInline
>
  {getVideoSources().map((source, index) => (
    <source key={index} src={source.src} type={source.type} />
  ))}
  הדפדפן שלך לא תומך בתג הווידאו
</video>


              <div 
                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={handleWatchClick}
              >
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Play className="h-6 w-6 text-slate-800 ml-1" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 text-slate-800">{video.title}</CardTitle>
        <CardDescription className="line-clamp-2">{video.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {videoError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs">
              בעיה בטעינת הסרטון. ייתכן שהקובץ לא קיים או שהפורמט לא נתמך.
            </AlertDescription>
          </Alert>
        )}

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
          <div className="flex gap-1">
            {/* כפתור צפייה חדש */}
            <Button
              variant="default"
              size="sm"
              onClick={handleWatchClick}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="h-4 w-4 mr-1" />
              צפה
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal(video, "details")}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Info className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal(video, "edit")}
              className="h-8 w-8 p-0 hover:bg-green-100"
            >
              <Pencil className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal(video, "delete")}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoCard