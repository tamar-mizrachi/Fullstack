
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Video, Calendar, User, Tag, FileText, CheckCircle, Loader2 } from "lucide-react"

type Category = {
  id: number
  name: string
}

type VideoFormData = {
  title: string
  description: string
  createdDate: string
  uploadDate?: string
  nameTalk: string
  categoryId: number
  userId: number
}

const AddVideo: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<VideoFormData>()
  const [categories, setCategories] = useState<Category[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("https://localhost:7087/api/Category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("שגיאה בטעינת קטגוריות:", err))
  }, [])

  const generateRandomString = () => Math.random().toString(36).substring(2, 8)

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "video/mp4") {
      alert("רק קבצי MP4 נתמכים")
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    const newUrl = URL.createObjectURL(file)
    setVideoFile(file)
    setPreviewUrl(newUrl)
    e.target.value = ""
  }

  const onSubmit = async (data: VideoFormData) => {
    const userIdStr = localStorage.getItem("userId")
    if (!userIdStr) {
      alert("משתמש לא מחובר")
      return
    }

    const userId = Number.parseInt(userIdStr)
    if (!videoFile) {
      alert("יש לבחור קובץ וידאו")
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const randomStr = generateRandomString()
      const uniqueFileName = `video_${randomStr}.mp4`

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const presignRes = await axios.post("https://localhost:7087/api/upload/presigned-url", {
        fileName: uniqueFileName,
        fileType: videoFile.type,
      })

      const presignedUrl = presignRes.data.url
      const fileUrl = `https://s3.eu-north-1.amazonaws.com/vidshare.aws-testpnoren/${presignRes.data.key}`

      if (!presignedUrl) {
        alert("כתובת העלאה ל-S3 לא התקבלה")
        setUploading(false)
        return
      }

      await axios.put(presignedUrl, videoFile, {
        headers: { "Content-Type": videoFile.type },
      })

      const videoData = {
        ...data,
        videoUrl: fileUrl,
        userId: userId,
        categoryId: Number.parseInt(selectedCategory),
      }

      const response = await axios.post("https://localhost:7087/api/Video", videoData)

      const storedVideos = localStorage.getItem("myVideos")
      let videos: VideoFormData[] = storedVideos ? JSON.parse(storedVideos) : []
      videos = [response.data, ...videos]
      localStorage.setItem("myVideos", JSON.stringify(videos))

      clearInterval(progressInterval)
      setUploadProgress(100)
      setSuccessMessage("הסרטון נוסף בהצלחה!")

      setTimeout(() => {
        navigate("/admin-home")
        window.location.reload()
      }, 2000)

      setVideoFile(null)
      setPreviewUrl(null)
      reset()
    } catch (error) {
      console.error("שגיאה:", error)
      alert("העלאה נכשלה")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            העלאת סרטון חדש
          </h1>
          <p className="text-slate-600">שתף את התוכן שלך עם הקהילה</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Video className="h-6 w-6 text-purple-600" />
              פרטי הסרטון
            </CardTitle>
            <CardDescription>מלא את הפרטים הבאים כדי להעלות את הסרטון שלך</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    כותרת הסרטון
                  </Label>
                  <Input
                    id="title"
                    placeholder="הכנס כותרת מעניינת..."
                    {...register("title", { required: "חובה להזין כותרת" })}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameTalk" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    שם ההרצאה
                  </Label>
                  <Input
                    id="nameTalk"
                    placeholder="שם המרצה או נושא ההרצאה..."
                    {...register("nameTalk", { required: "חובה להזין שם ההרצאה" })}
                    className={errors.nameTalk ? "border-red-500" : ""}
                  />
                  {errors.nameTalk && <p className="text-sm text-red-500">{errors.nameTalk.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  תיאור הסרטון
                </Label>
                <Textarea
                  id="description"
                  placeholder="תאר את תוכן הסרטון, מה הצופים ילמדו ועוד..."
                  className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                  {...register("description", { required: "חובה להזין תיאור" })}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="createdDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    תאריך יצירה
                  </Label>
                  <Input
                    id="createdDate"
                    type="date"
                    {...register("createdDate", { required: "חובה להזין תאריך יצירה" })}
                    className={errors.createdDate ? "border-red-500" : ""}
                  />
                  {errors.createdDate && <p className="text-sm text-red-500">{errors.createdDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    קטגוריה
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className={!selectedCategory ? "border-red-500" : ""}>
                      <SelectValue placeholder="בחר קטגוריה..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!selectedCategory && <p className="text-sm text-red-500">חובה לבחור קטגוריה</p>}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  העלאת קובץ וידאו
                </Label>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-purple-100 rounded-full">
                        <Upload className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">לחץ כדי להעלות קובץ וידאו</p>
                        <p className="text-sm text-slate-500">רק קבצי MP4 נתמכים</p>
                      </div>
                    </div>
                  </label>
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <Label className="mb-2 block">תצוגה מקדימה:</Label>
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video width="100%" height="300" controls className="w-full h-[300px] object-contain">
                        <source src={previewUrl} type="video/mp4" />
                        הדפדפן שלך לא תומך בניגון וידאו.
                      </video>
                    </div>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">מעלה סרטון...</span>
                    <span className="text-sm text-slate-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={uploading || !videoFile || !selectedCategory}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    מעלה סרטון...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    העלה סרטון
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddVideo
