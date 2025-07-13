"use client"


import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, X, Loader2, CheckCircle, AlertTriangle } from "lucide-react"

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

interface EditVideoProps {
  video: Video
  onClose: () => void
}

const API_BASE = "https://localhost:7087"

const EditVideo: React.FC<EditVideoProps> = ({ video, onClose }) => {
  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description)
  const [nameTalk, setNameTalk] = useState(video.nameTalk)
  const [createdDate, setCreatedDate] = useState(video.createdDate)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    const token = localStorage.getItem("authToken")
    try {
      await axios.put(
        `${API_BASE}/api/Video/${video.id}`,
        { title, description, createdDate, nameTalk },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error saving video:", error)
      setError("עדכון הסרטון נכשל. אנא נסה שוב.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-green-800">הסרטון עודכן בהצלחה!</h3>
          <p className="text-slate-600">הפרטים נשמרו במערכת</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Save className="h-6 w-6 text-purple-600" />
              עריכת סרטון
            </CardTitle>
            <CardDescription>עדכן את פרטי הסרטון</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">כותרת הסרטון</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="הכנס כותרת..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameTalk">שם ההרצאה</Label>
            <Input
              id="nameTalk"
              value={nameTalk}
              onChange={(e) => setNameTalk(e.target.value)}
              placeholder="שם המרצה או נושא ההרצאה..."
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">תיאור הסרטון</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="תאר את תוכן הסרטון..."
            className="min-h-[100px] w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdDate">תאריך יצירה</Label>
          <Input
            id="createdDate"
            type="date"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 pt-6">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                שומר...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                שמור שינויים
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            ביטול
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EditVideo
