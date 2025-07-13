
/*
"use client"


import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Video,
  Search,
  Filter,
  Calendar,
  User,
  Play,
  Loader2,
  AlertTriangle,
  Grid,
  List,
  RefreshCw,
} from "lucide-react"

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

const AllVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [filteredVideos, setFilteredVideos] = useState<VideoType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [videoErrors, setVideoErrors] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, categoriesRes] = await Promise.all([
          axios.get("https://localhost:7087/api/Video"),
          axios.get("https://localhost:7087/api/Category"),
        ])

        setVideos(videosRes.data)
        setFilteredVideos(videosRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error("שגיאה בטעינת הנתונים:", err)
        setError("שגיאה בטעינת הסרטונים")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = videos

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.nameTalk.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.categoryId.toString() === selectedCategory)
    }

    // Sort videos
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        case "oldest":
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredVideos(filtered)
  }, [videos, searchTerm, selectedCategory, sortBy])

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "לא ידוע"
  }

  const handleVideoError = (videoId: number) => {
    setVideoErrors((prev) => ({ ...prev, [videoId]: true }))
  }

  const handleVideoSuccess = (videoId: number) => {
    setVideoErrors((prev) => ({ ...prev, [videoId]: false }))
  }

  const getVideoSources = (videoUrl: string) => {
    const sources = [
      { src: videoUrl, type: "video/mp4" },
     // { src: videoUrl.replace(/\.[^/.]+$/, ".webm"), type: "video/webm" },
    ]

    if (!videoUrl.startsWith("http")) {
      sources.push({ src: `${window.location.origin}${videoUrl}`, type: "video/mp4" })
    }

    return sources
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
     
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            כל הסרטונים
          </h1>
          <p className="text-slate-600">גלה תוכן מעניין מהקהילה שלנו</p>
        </div>

        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              חיפוש וסינון
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="חפש סרטונים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="מיין לפי" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">החדשים ביותר</SelectItem>
                  <SelectItem value="oldest">הישנים ביותר</SelectItem>
                  <SelectItem value="title">לפי כותרת</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>נמצאו {filteredVideos.length} סרטונים</span>
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                >
                  נקה סינונים
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

      
        {filteredVideos.length === 0 ? (
          <Card className="text-center shadow-xl">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">לא נמצאו סרטונים</h3>
              <p className="text-slate-600">נסה לשנות את הסינונים או החיפוש</p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}
          >
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className={`shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                  <div className="aspect-video bg-black relative overflow-hidden">
                    {videoErrors[video.id] ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <div className="text-center p-4">
                          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                          <p className="text-xs text-red-400">שגיאה בטעינת הסרטון</p>
                          <Button
                            onClick={() => handleVideoSuccess(video.id)}
                            size="sm"
                            variant="outline"
                            className="mt-2 text-white border-white hover:bg-white/10"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            נסה שוב
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          poster="/placeholder.svg?height=200&width=300"
                          preload="metadata"
                          onError={() => handleVideoError(video.id)}
                          onLoadedData={() => handleVideoSuccess(video.id)}
                        >
                          {getVideoSources(video.videoUrl).map((source, index) => (
                            <source key={index} src={source.src} type={source.type} />
                          ))}
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

                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="h-4 w-4" />
                        <span>{video.nameTalk}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(video.uploadDate).toLocaleDateString("he-IL")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{getCategoryName(video.categoryId)}</Badge>
                      <Button size="sm" className="text-black bg-purple-600 hover:bg-purple-700">
                        <Play className="text-black h-4 w-4 mr-1" />
                        צפה
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllVideos
*/

"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Video,
  Search,
  Filter,
  Calendar,
  User,
  Play,
  Pause,
  X,
  Loader2,
  AlertTriangle,
  Grid,
  List,
  RefreshCw,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Tag,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

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

interface Comment {
  id: number
  user: string
  content: string
  timestamp: string
  likes: number
}

// Advanced Video Player Component
const VideoPlayerComponent: React.FC<{ video: VideoType; categoryName: string }> = ({ 
  video, 
  categoryName 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "משתמש 1",
      content: "סרטון מעולה! למדתי הרבה",
      timestamp: "לפני 2 שעות",
      likes: 5,
    },
    {
      id: 2,
      user: "משתמש 2",
      content: "תודה על השיתוף, מאוד מועיל",
      timestamp: "לפני יום",
      likes: 3,
    },
  ])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const updateTime = () => setCurrentTime(videoElement.currentTime)
    const updateDuration = () => {
      setDuration(videoElement.duration)
      setIsLoading(false)
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = (e: Event) => {
      console.error("Video error:", e)
      setVideoError("שגיאה בטעינת הסרטון. אנא בדוק את חיבור האינטרנט ונסה שוב.")
      setIsLoading(false)
    }
    const handleLoadedData = () => {
      setVideoError(null)
      setIsLoading(false)
    }

    videoElement.addEventListener("timeupdate", updateTime)
    videoElement.addEventListener("loadedmetadata", updateDuration)
    videoElement.addEventListener("loadstart", handleLoadStart)
    videoElement.addEventListener("canplay", handleCanPlay)
    videoElement.addEventListener("error", handleError)
    videoElement.addEventListener("loadeddata", handleLoadedData)

    return () => {
      videoElement.removeEventListener("timeupdate", updateTime)
      videoElement.removeEventListener("loadedmetadata", updateDuration)
      videoElement.removeEventListener("loadstart", handleLoadStart)
      videoElement.removeEventListener("canplay", handleCanPlay)
      videoElement.removeEventListener("error", handleError)
      videoElement.removeEventListener("loadeddata", handleLoadedData)
    }
  }, [])

  const togglePlay = () => {
    const videoElement = videoRef.current
    if (!videoElement || videoError) return

    if (isPlaying) {
      videoElement.pause()
    } else {
      videoElement.play().catch((error) => {
        console.error("Play error:", error)
        setVideoError("לא ניתן להפעיל את הסרטון. נסה שוב.")
      })
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const newTime = Number.parseFloat(e.target.value)
    videoElement.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const newVolume = Number.parseFloat(e.target.value)
    videoElement.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: comments.length + 1,
      user: "אתה",
      content: newComment,
      timestamp: "עכשיו",
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleRetry = () => {
    setVideoError(null)
    setIsLoading(true)
    setRetryCount((prev) => prev + 1)

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.load()
    }
  }

  const getVideoSources = () => {
    const baseUrl = video.videoUrl
    const sources = [
      { src: baseUrl, type: "video/mp4" },
    ]

    if (!baseUrl.startsWith("http")) {
      sources.push(
        { src: `${baseUrl}`, type: "video/mp4" },
      )
    }

    return sources
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="relative bg-black">
              {videoError ? (
                <div className="aspect-video flex items-center justify-center bg-slate-900">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">שגיאה בטעינת הסרטון</h3>
                    <p className="text-red-400 mb-4 max-w-md">{videoError}</p>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">נתיב הסרטון: {video.videoUrl}</p>
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        className="text-white border-white hover:bg-white/10"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        נסה שוב ({retryCount})
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full aspect-video object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.error("Video element error:", e)
                      setVideoError("הסרטון לא נמצא או שהפורמט לא נתמך")
                    }}
                    preload="metadata"
                  >
                    {getVideoSources().map((source, index) => (
                      <source key={index} src={source.src} type={source.type} />
                    ))}
                    הדפדפן שלך לא תומך בתג הווידאו.
                  </video>

                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white">טוען סרטון...</p>
                      </div>
                    </div>
                  )}

                  {/* Custom Controls */}
                  {!videoError && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="space-y-2">
                        {/* Progress Bar */}
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`,
                          }}
                        />

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={togglePlay}
                              className="text-white hover:bg-white/20"
                            >
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>

                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                              <SkipBack className="h-4 w-4" />
                            </Button>

                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                              <SkipForward className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMute}
                                className="text-white hover:bg-white/20"
                              >
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                              </Button>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <span className="text-white text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>

                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Maximize className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Video Info */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{video.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(video.uploadDate).toLocaleDateString("he-IL")}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {video.nameTalk}
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {categoryName}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {videoError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="space-y-2">
                      <p>
                        <strong>שגיאה בטעינת הסרטון:</strong>
                      </p>
                      <p>{videoError}</p>
                      <p className="text-sm">
                        נתיב הקובץ: <code className="bg-red-100 px-1 rounded">{video.videoUrl}</code>
                      </p>
                      <div className="mt-3">
                        <Button onClick={handleRetry} size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          נסה שוב
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {isLiked ? "אהבתי" : "לייק"}
                  </Button>

                  <Button
                    variant={isDisliked ? "default" : "outline"}
                    size="sm"
                    onClick={handleDislike}
                    className={isDisliked ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {isDisliked ? "לא אהבתי" : "דיסלייק"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    שתף
                  </Button>

                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    שמור
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">תיאור</h3>
                <p className="text-slate-700 leading-relaxed">{video.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                תגובות ({comments.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="כתוב תגובה..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="w-full">
                  הוסף תגובה
                </Button>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user}</span>
                        <span className="text-xs text-slate-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          השב
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Videos */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>סרטונים קשורים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="w-24 h-16 bg-slate-200 rounded flex items-center justify-center">
                    <Play className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">סרטון קשור מספר {i}</h4>
                    <p className="text-xs text-slate-500 mt-1">מרצה • לפני יום</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

type Category = {
  id: number
  name: string
}

const AllVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [filteredVideos, setFilteredVideos] = useState<VideoType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [videoErrors, setVideoErrors] = useState<{ [key: number]: boolean }>({})
  
  // הוספת מצב לנגן וידאו
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, categoriesRes] = await Promise.all([
          axios.get("https://localhost:7087/api/Video"),
          axios.get("https://localhost:7087/api/Category"),
        ])

        setVideos(videosRes.data)
        setFilteredVideos(videosRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error("שגיאה בטעינת הנתונים:", err)
        setError("שגיאה בטעינת הסרטונים")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = videos

    if (searchTerm) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.nameTalk.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.categoryId.toString() === selectedCategory)
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        case "oldest":
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredVideos(filtered)
  }, [videos, searchTerm, selectedCategory, sortBy])

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "לא ידוע"
  }

  const handleVideoError = (videoId: number) => {
    setVideoErrors((prev) => ({ ...prev, [videoId]: true }))
  }

  const handleVideoSuccess = (videoId: number) => {
    setVideoErrors((prev) => ({ ...prev, [videoId]: false }))
  }

  const getVideoSources = (videoUrl: string) => {
    const sources = [
      { src: videoUrl, type: "video/mp4" },
    ]

    if (!videoUrl.startsWith("http")) {
      sources.push({ src: `${window.location.origin}${videoUrl}`, type: "video/mp4" })
    }

    return sources
  }

  // פונקציה לפתיחת נגן הוידאו
  const handleWatchVideo = (video: VideoType) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  // פונקציה לסגירת נגן הוידאו
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  // פונקציה להפעלה ישירה בתוך הכרטיס
  const handlePlayInCard = (video: VideoType, event: React.MouseEvent) => {
    event.preventDefault()
    const videoElement = event.currentTarget.closest('.video-card')?.querySelector('video') as HTMLVideoElement
    if (videoElement) {
      if (videoElement.paused) {
        // עצור את כל הסרטונים האחרים
        document.querySelectorAll('video').forEach(v => {
          if (v !== videoElement) v.pause()
        })
        videoElement.play()
      } else {
        videoElement.pause()
      }
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            כל הסרטונים
          </h1>
          <p className="text-slate-600">גלה תוכן מעניין מהקהילה שלנו</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              חיפוש וסינון
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="חפש סרטונים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="מיין לפי" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">החדשים ביותר</SelectItem>
                  <SelectItem value="oldest">הישנים ביותר</SelectItem>
                  <SelectItem value="title">לפי כותרת</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>נמצאו {filteredVideos.length} סרטונים</span>
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                >
                  נקה סינונים
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid/List */}
        {filteredVideos.length === 0 ? (
          <Card className="text-center shadow-xl">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">לא נמצאו סרטונים</h3>
              <p className="text-slate-600">נסה לשנות את הסינונים או החיפוש</p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}
          >
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className={`video-card shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                  <div className="aspect-video bg-black relative overflow-hidden">
                    {videoErrors[video.id] ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <div className="text-center p-4">
                          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                          <p className="text-xs text-red-400">שגיאה בטעינת הסרטון</p>
                          <Button
                            onClick={() => handleVideoSuccess(video.id)}
                            size="sm"
                            variant="outline"
                            className="mt-2 text-white border-white hover:bg-white/10"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            נסה שוב
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          poster="/placeholder.svg?height=200&width=300"
                          preload="metadata"
                          controls={false}
                          onError={() => handleVideoError(video.id)}
                          onLoadedData={() => handleVideoSuccess(video.id)}
                          onClick={(e) => handlePlayInCard(video, e)}
                        >
                          {getVideoSources(video.videoUrl).map((source, index) => (
                            <source key={index} src={source.src} type={source.type} />
                          ))}
                        </video>
                        <div 
                          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          onClick={(e) => handlePlayInCard(video, e)}
                        >
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-slate-800 ml-1" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="h-4 w-4" />
                        <span>{video.nameTalk}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(video.uploadDate).toLocaleDateString("he-IL")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{getCategoryName(video.categoryId)}</Badge>
                      <Button 
                        size="sm" 
                        className="text-black bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleWatchVideo(video)}
                      >
                        <Play className="text-black h-4 w-4 mr-1" />
                        צפה
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Advanced Video Modal */}
        {isModalOpen && selectedVideo && (
          <div className=" fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                >
                  <X className="text-black h-4 w-4" />
                </Button>
              </div>
              
              <div className="max-h-[calc(95vh-120px)] overflow-y-auto">
                <VideoPlayerComponent 
                  video={selectedVideo} 
                  categoryName={getCategoryName(selectedVideo.categoryId)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllVideos