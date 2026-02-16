
"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Calendar,
  User,
  Tag,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"

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

interface VideoPlayerProps {
  video: Video
  categoryName?: string
}

interface Comment {
  id: number
  user: string
  content: string
  timestamp: string
  likes: number
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, categoryName = "כללי" }) => {
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
  const [showAI, setShowAI] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [transcribing, setTranscribing] = useState(false)

  // ✅ פונקציה מתוקנת - שולחת URL בלבד, השרת מוריד מ-S3
  const handleTranscriptionAI = async () => {
    if (!video?.videoUrl) {
      setTranscript("❌ אין URL לסרטון")
      return
    }

    setTranscribing(true)
    setTranscript("⏳ מתמלל את הסרטון...")

    try {
      console.log("🎬 מתחיל תמלול:", video.videoUrl)

      const transcribeResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/Analyze/transcribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: video.videoUrl }),
        }
      )

      console.log("📥 Response status:", transcribeResponse.status)

      if (!transcribeResponse.ok) {
        const errorText = await transcribeResponse.text()
        console.error("❌ Server error:", errorText)
        throw new Error(`Server error ${transcribeResponse.status}: ${errorText}`)
      }

      const data = await transcribeResponse.json()
      console.log("✅ תוצאה:", data)

      if (data?.transcript) {
        setTranscript(data.transcript)
      } else if (data?.noSpeech) {
        setTranscript("🎵 לא זוהו מילים בסרטון - ייתכן שיש רק מוזיקה או שקט")
      } else {
        setTranscript("⚠️ לא התקבלה תוצאה מה-AI")
      }
    } catch (error: any) {
      console.error("❌ שגיאה בתמלול:", error)
      setTranscript(`❌ שגיאה: ${error.message}`)
    } finally {
      setTranscribing(false)
    }
  }

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
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => {
      setDuration(video.duration)
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

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)
    video.addEventListener("loadeddata", handleLoadedData)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
      video.removeEventListener("loadeddata", handleLoadedData)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || videoError) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch((error) => {
        console.error("Play error:", error)
        setVideoError("לא ניתן להפעיל את הסרטון. נסה שוב.")
      })
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Number.parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Number.parseFloat(e.target.value)
    video.volume = newVolume
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

    const video = videoRef.current
    if (video) {
      video.load()
    }
  }

  const getVideoSources = () => {
    const baseUrl = video.videoUrl
    const sources = [
      { src: baseUrl, type: "video/mp4" },
    ]

    if (!baseUrl.startsWith("http")) {
      sources.push({ src: `${baseUrl}`, type: "video/mp4" })
    }

    return sources
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                        className="text-black border-black hover:bg-black/10"
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

                  {!videoError && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-black/30 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`,
                          }}
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={togglePlay}
                              className="text-black hover:bg-black/20"
                            >
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>

                            <Button variant="ghost" size="sm" className="text-black hover:bg-black/20">
                              <SkipBack className="h-4 w-4" />
                            </Button>

                            <Button variant="ghost" size="sm" className="text-black hover:bg-black/20">
                              <SkipForward className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMute}
                                className="text-black hover:bg-black/20"
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
                                className="w-20 h-1 bg-black/30 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <span className="text-black text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>

                          <Button variant="ghost" size="sm" className="text-black hover:bg-black/20">
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

              {/* ✅ כפתור תמלול */}
              <Button
                onClick={handleTranscriptionAI}
                variant="outline"
                className="w-full mt-4"
                disabled={transcribing}
              >
                {transcribing ? "מתמלל..." : "תמלל את הסרטון עם AI"}
              </Button>

              {/* ✅ תצוגת תמלול */}
              {transcript && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm mt-2">
                  <strong className="text-purple-900">תמלול AI:</strong>
                  <p className="text-purple-800 mt-2 whitespace-pre-wrap">{transcript}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                תגובות ({comments.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="כתוב תגובה..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="text-black w-full">
                  הוסף תגובה
                </Button>
              </div>

              <Separator />

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
                        <Button variant="ghost" size="sm" className="text-black h-6 px-2 text-xs">
                          <ThumbsUp className="text-black h-3 w-3 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-black h-6 px-2 text-xs">
                          השב
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

export default VideoPlayer