
"use client"


import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Trash2, AlertTriangle, CheckCircle } from "lucide-react"

const DeleteVideo: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(true)

  const handleDelete = async () => {
    if (!videoId) {
      setError("לא נמצא מזהה סרטון למחיקה")
      return
    }

    setLoading(true)
    try {
      await axios.delete(`https://localhost:7087/api/Video/${videoId}`)

      // Show success message briefly before redirecting
      setShowConfirm(false)
      setTimeout(() => {
        navigate("/admin-home/my-videos")
      }, 2000)
    } catch (err) {
      console.error("שגיאה במחיקת הסרטון:", err)
      setError("מחיקת הסרטון נכשלה")
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/admin-home/my-videos")
  }

  if (!videoId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Alert className="border-red-200 bg-red-50 max-w-md">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">לא נמצא מזהה סרטון למחיקה</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">מוחק סרטון...</h3>
            <p className="text-slate-600">אנא המתן בזמן שהסרטון נמחק</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!showConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-800">הסרטון נמחק בהצלחה!</h3>
            <p className="text-slate-600">מעביר אותך חזרה לרשימת הסרטונים...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-800">מחיקת סרטון</CardTitle>
          <CardDescription>פעולה זו לא ניתנת לביטול. הסרטון יימחק לצמיתות מהמערכת.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">אזהרה</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  אתה עומד למחוק את הסרטון לצמיתות. פעולה זו לא ניתנת לביטול.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleDelete} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מוחק...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  מחק סרטון
                </>
              )}
            </Button>
            <Button onClick={handleCancel} variant="outline" disabled={loading} className="flex-1">
              ביטול
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeleteVideo
