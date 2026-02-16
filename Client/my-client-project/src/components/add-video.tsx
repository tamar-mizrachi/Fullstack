

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Video, Calendar, User, Tag, FileText, CheckCircle, Loader2, Plus } from "lucide-react"

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

type CategoryFormData = {
  name: string
}

const AddVideo: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<VideoFormData>()

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    formState: { errors: categoryErrors },
    reset: resetCategory,
  } = useForm<CategoryFormData>()

  const [categories, setCategories] = useState<Category[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categorySuccessMessage, setCategorySuccessMessage] = useState("")
  const [fileSize, setFileSize] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/Category`)
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

  const onSubmitCategory = async (data: CategoryFormData) => {
    setIsAddingCategory(true)
    setCategorySuccessMessage("")

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Category`, {
        name: data.name,
      })

      // הוספת הקטגוריה החדשה לרשימה המקומית
      const newCategory: Category = {
        id: response.data.id,
        name: response.data.name,
      }
      setCategories((prev) => [...prev, newCategory])

      // הצגת הודעת הצלחה
      setCategorySuccessMessage("הקטגוריה נוספה בהצלחה!")

      // איפוס הטופס
      resetCategory()

      // סגירת הדיאלוג לאחר 1.5 שניות
      setTimeout(() => {
        setCategoryDialogOpen(false)
        setCategorySuccessMessage("")
      }, 1500)
    } catch (error) {
      console.error("שגיאה בהוספת קטגוריה:", error)
      alert("שגיאה בהוספת הקטגוריה")
    } finally {
      setIsAddingCategory(false)
    }
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
  
      // שלב 1: קבלת presigned URL
      const presignRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload/presigned-url`,
        {
          fileName: uniqueFileName,
          fileType: videoFile.type,
        }
      )
  
      const presignedUrl = presignRes.data.url
      const fileUrl = `http://vidshare.aws-testpnoren.s3.eu-north-1.amazonaws.com/${presignRes.data.key}`
      if (!presignedUrl) {
        alert("כתובת העלאה ל-S3 לא התקבלה")
        clearInterval(progressInterval)
        setUploading(false)
        return
      }
  
      // שלב 2: העלאה ישירות ל-S3 (ללא headers!)
      await axios.put(presignedUrl, videoFile)
  
      // שלב 3: שמירת פרטי הסרטון בDB
      const videoData = {
        ...data,
        videoUrl: fileUrl,
        userId: userId,
        categoryId: Number.parseInt(selectedCategory),
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/Video`,
        videoData
      )
  
      // שלב 4: עדכון localStorage
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
      if (axios.isAxiosError(error)) {
        alert(`העלאה נכשלה: ${error.response?.data || error.message}`)
      } else {
        alert("העלאה נכשלה")
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }
/*
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

      const presignRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/presigned-url`, {
        fileName: uniqueFileName,
        fileType: videoFile.type,
      })

      const presignedUrl = presignRes.data.url
      const fileUrl = `https://s3.eu-north-1.amazonaws.com/vidshare.aws-testpnoren/${presignRes.data.key}`
     // const fileUrl = `https://${"vidshare.aws-testpnoren"}.s3.eu-north-1.amazonaws.com/${presignRes.data.key}`;
      if (!presignedUrl) {
        alert("כתובת העלאה ל-S3 לא התקבלה")
        setUploading(false)
        return
      }

      await axios.put(presignedUrl, videoFile, {
       // headers: { "Content-Type": videoFile.type },
        headers: { "Content-Type": "video/mp4"  },
      })
    
      const videoData = {
        ...data,
        videoUrl: fileUrl,
        userId: userId,
        categoryId: Number.parseInt(selectedCategory),
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Video`, videoData)

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
*/
/*
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

    const presignRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/presigned-url`, {
      fileName: uniqueFileName,
      fileType: videoFile.type,
    })

    const presignedUrl = presignRes.data.url    
    const fileUrl = `https://vidshare.aws-testpnoren.s3.eu-north-1.amazonaws.com/${presignRes.data.key}`

    if (!presignedUrl) {
      alert("כתובת העלאה ל-S3 לא התקבלה")
      setUploading(false)
      return
    }

    // העלאה עם progress bar אמיתי
    await axios.put(presignedUrl, videoFile, {
      headers: { "Content-Type": videoFile.type },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 600000, // 10 דקות
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percent)
        }
      }
    })

    const videoData = {
      ...data,
      videoUrl: fileUrl,
      userId: userId,
      categoryId: Number.parseInt(selectedCategory),
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Video`, videoData)

    const storedVideos = localStorage.getItem("myVideos")
    let videos: VideoFormData[] = storedVideos ? JSON.parse(storedVideos) : []
    videos = [response.data, ...videos]
    localStorage.setItem("myVideos", JSON.stringify(videos))

    setSuccessMessage("הסרטון נוסף בהצלחה!")

    setTimeout(() => {
      navigate("/admin-home")
      window.location.reload()
    }, 2000)

    setVideoFile(null)
    setPreviewUrl(null)
    setFileSize("")
    reset()
  } catch (error) {
    console.error("שגיאה:", error)
    alert("העלאה נכשלה")
  } finally {
    setUploading(false)
    setUploadProgress(0)
  }
}*/
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
                    <Calendar className="h-4 w-4"/>
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
                  <div className=" flex gap-2">
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

                    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon" className="shrink-0 bg-transparent">
                          <Plus className="h-4 w-4"/>+
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            הוספת קטגוריה חדשה
                          </DialogTitle>
                          <DialogDescription>הוסף קטגוריה חדשה לרשימת הקטגוריות</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmitCategory(onSubmitCategory)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">שם הקטגוריה</Label>
                            <Input
                              id="categoryName"
                              placeholder="הכנס שם קטגוריה..."
                              {...registerCategory("name", {
                                required: "חובה להזין שם קטגוריה",
                                minLength: { value: 2, message: "שם הקטגוריה חייב להכיל לפחות 2 תווים" },
                              })}
                              className={categoryErrors.name ? "border-red-500" : ""}
                            />
                            {categoryErrors.name && (
                              <p className="text-sm text-red-500">{categoryErrors.name.message}</p>
                            )}
                          </div>

                          {categorySuccessMessage && (
                            <Alert className=" border-green-200 bg-green-50">
                              <CheckCircle className=" h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-800">{categorySuccessMessage}</AlertDescription>
                            </Alert>
                          )}

                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCategoryDialogOpen(false)}
                              disabled={isAddingCategory}
                            >
                              ביטול
                            </Button>
                            <Button type="submit" disabled={isAddingCategory} className="text-black">
                              {isAddingCategory ? (
                                <>
                                  <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                                  מוסיף...
                                </>
                              ) : (
                                <>
                                  <Plus className=" mr-2 h-4 w-4" />
                                  הוסף קטגוריה
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
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
/*
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Video, Calendar, User, Tag, FileText, CheckCircle, Loader2, Plus, Film, AlertCircle } from "lucide-react"

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

type CategoryFormData = {
  name: string
}

const AddVideo: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VideoFormData>()

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    formState: { errors: categoryErrors },
    reset: resetCategory,
  } = useForm<CategoryFormData>()

  const [categories, setCategories] = useState<Category[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categorySuccessMessage, setCategorySuccessMessage] = useState("")
  const [fileSize, setFileSize] = useState<string>("")
  const [estimatedTime, setEstimatedTime] = useState<string>("")
  const [uploadSpeed, setUploadSpeed] = useState<string>("")
  
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/Category`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("שגיאה בטעינת קטגוריות:", err))
  }, [])

  const generateRandomString = () => Math.random().toString(36).substring(2, 8)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const estimateUploadTime = (fileSize: number): string => {
    const avgSpeedMbps = 10
    const seconds = (fileSize * 8) / (avgSpeedMbps * 1024 * 1024)
    const minutes = Math.ceil(seconds / 60)
    
    if (minutes < 1) return "פחות מדקה"
    if (minutes === 1) return "כדקה"
    return `כ-${minutes} דקות`
  }

  // פונקציה להעלאה ישירה עם XMLHttpRequest (יותר יציב מ-axios לקבצים גדולים)
  const uploadDirectly = async (
    url: string,
    file: File,
    onProgress: (percent: number, speed: string) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const startTime = Date.now()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total)
          
          // חישוב מהירות
          const elapsed = (Date.now() - startTime) / 1000
          const speedMBps = (e.loaded / 1024 / 1024) / elapsed
          
          onProgress(percent, `${speedMBps.toFixed(2)} MB/s`)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          console.log('העלאה הצליחה!')
          resolve()
        } else {
          reject(new Error(`שגיאת שרת: ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        reject(new Error('שגיאת רשת בהעלאה'))
      })
      
      xhr.addEventListener('abort', () => {
        reject(new Error('ההעלאה בוטלה'))
      })
      
      xhr.open('PUT', url)
      xhr.setRequestHeader('Content-Type', 'video/mp4')
      xhr.send(file)
    })
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "video/mp4") {
      alert("רק קבצי MP4 נתמכים")
      return
    }

    const sizeMB = formatFileSize(file.size)
    const timeEstimate = estimateUploadTime(file.size)
    
    setFileSize(sizeMB)
    setEstimatedTime(timeEstimate)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    const newUrl = URL.createObjectURL(file)
    setVideoFile(file)
    setPreviewUrl(newUrl)
    e.target.value = ""
  }

  const onSubmitCategory = async (data: CategoryFormData) => {
    setIsAddingCategory(true)
    setCategorySuccessMessage("")

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Category`, {
        name: data.name,
      })

      const newCategory: Category = {
        id: response.data.id,
        name: response.data.name,
      }
      setCategories((prev) => [...prev, newCategory])
      setCategorySuccessMessage("הקטגוריה נוספה בהצלחה!")
      resetCategory()

      setTimeout(() => {
        setCategoryDialogOpen(false)
        setCategorySuccessMessage("")
      }, 1500)
    } catch (error) {
      console.error("שגיאה בהוספת קטגוריה:", error)
      alert("שגיאה בהוספת הקטגוריה")
    } finally {
      setIsAddingCategory(false)
    }
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
    setUploadSpeed("")

    try {
      const randomStr = generateRandomString()
      const uniqueFileName = `video_${randomStr}.mp4`

      console.log(`מתחיל העלאה של: ${formatFileSize(videoFile.size)}`)

      // קבלת presigned URL
      const presignRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/presigned-url`, {
        fileName: uniqueFileName,
        fileType: videoFile.type,
      })

      const presignedUrl = presignRes.data.url
      const fileUrl = `https://vidshare.aws-testpnoren.s3.eu-north-1.amazonaws.com/${presignRes.data.key}`

      if (!presignedUrl) {
        alert("כתובת העלאה ל-S3 לא התקבלה")
        setUploading(false)
        return
      }

      const startTime = Date.now()

      // העלאה ישירה עם XMLHttpRequest (יותר יציב לקבצים גדולים)
      console.log('מתחיל העלאה ישירה...')
      
      await uploadDirectly(presignedUrl, videoFile, (percent, speed) => {
        setUploadProgress(percent)
        setUploadSpeed(speed)
      })

      const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
      console.log(`העלאה הושלמה בהצלחה! זמן כולל: ${totalTime} דקות`)

      // שמירת הנתונים בשרת
      const videoData = {
        ...data,
        videoUrl: fileUrl,
        userId: userId,
        categoryId: Number.parseInt(selectedCategory),
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Video`, videoData)

      // עדכון localStorage
      const storedVideos = localStorage.getItem("myVideos")
      let videos: VideoFormData[] = storedVideos ? JSON.parse(storedVideos) : []
      videos = [response.data, ...videos]
      localStorage.setItem("myVideos", JSON.stringify(videos))

      setSuccessMessage("הסרטון נוסף בהצלחה!")

      setTimeout(() => {
        navigate("/admin-home")
        window.location.reload()
      }, 2000)

      setVideoFile(null)
      setPreviewUrl(null)
      setFileSize("")
      setEstimatedTime("")
      setUploadSpeed("")
      reset()
    } catch (error) {
      console.error("שגיאה:", error)
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_RESET') {
          alert("החיבור לשרת התנתק. אנא בדוק את חיבור האינטרנט ונסה שוב.")
        } else if (error.code === 'ECONNABORTED') {
          alert("זמן ההעלאה פג. אנא נסה שוב.")
        } else if (error.response?.status === 413) {
          alert("הקובץ גדול מדי. אנא נסה קובץ קטן יותר.")
        } else {
          alert("העלאה נכשלה. אנא נסה שוב.")
        }
      } else {
        alert("העלאה נכשלה")
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
      setUploadSpeed("")
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
                    <Calendar className="h-4 w-4"/>
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
                  <div className="flex gap-2">
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

                    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon" className="shrink-0 bg-transparent">
                          <Plus className="h-4 w-4"/>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            הוספת קטגוריה חדשה
                          </DialogTitle>
                          <DialogDescription>הוסף קטגוריה חדשה לרשימת הקטגוריות</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmitCategory(onSubmitCategory)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">שם הקטגוריה</Label>
                            <Input
                              id="categoryName"
                              placeholder="הכנס שם קטגוריה..."
                              {...registerCategory("name", {
                                required: "חובה להזין שם קטגוריה",
                                minLength: { value: 2, message: "שם הקטגוריה חייב להכיל לפחות 2 תווים" },
                              })}
                              className={categoryErrors.name ? "border-red-500" : ""}
                            />
                            {categoryErrors.name && (
                              <p className="text-sm text-red-500">{categoryErrors.name.message}</p>
                            )}
                          </div>

                          {categorySuccessMessage && (
                            <Alert className="border-green-200 bg-green-50">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-800">{categorySuccessMessage}</AlertDescription>
                            </Alert>
                          )}

                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCategoryDialogOpen(false)}
                              disabled={isAddingCategory}
                            >
                              ביטול
                            </Button>
                            <Button type="submit" disabled={isAddingCategory} className="text-black">
                              {isAddingCategory ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  מוסיף...
                                </>
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  הוסף קטגוריה
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
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
                    disabled={uploading}
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

                {videoFile && fileSize && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Film className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="space-y-1">
                        <p><strong>גודל קובץ:</strong> {fileSize}</p>
                        <p><strong>זמן העלאה משוער:</strong> {estimatedTime}</p>
                        <p className="text-green-700"><strong>שיטה:</strong> העלאה ישירה מהירה</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

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
                    <div className="text-sm text-slate-500">
                      {uploadProgress}% {uploadSpeed && `(${uploadSpeed})`}
                    </div>
                  </div>
                  <Progress value={uploadProgress} className="h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </Progress>
                  <p className="text-xs text-slate-500 text-center">
                    העלאה ישירה - אנא המתן ואל תסגור את הדפדפן...
                  </p>
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
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    מעלה סרטון... {uploadProgress}%
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
*/ 