
"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"

const SummarizeAI = ({ videoUrl = "" }) => {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // ✅ תמלול מקובץ
  const transcribeFile = async () => {
    if (!selectedFile) {
      setError("⚠️ בחר קובץ וידאו/אודיו")
      return
    }

    setLoading(true)
    setError("")
    setInputText("")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Analyze/transcribe`, {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "שגיאה בתמלול")
      }

      if (data?.transcript) {
        setInputText(data.transcript)
      } else if (data?.noSpeech) {
        setError("🎵 לא זוהו מילים בסרטון")
      } else {
        setError("⚠️ לא התקבלה תוצאה")
      }
    } catch (err: any) {
      console.error("Transcription error:", err)
      setError(`❌ שגיאה: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // ✅ סיכום טקסט
  const summarizeText = async () => {
    if (!inputText.trim()) {
      setError("⚠️ אין טקסט לסיכום")
      return
    }

    setLoading(true)
    setError("")
    setSummary("")

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Analyze/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "שגיאה בסיכום")
      }

      if (data?.summary) {
        setSummary(data.summary)
      } else {
        setError("⚠️ לא התקבל סיכום")
      }
    } catch (err: any) {
      console.error("Summary error:", err)
      setError(`❌ שגיאה: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>תמלול וסיכום באמצעות AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ✅ בחירת קובץ */}
        <div className="space-y-2">
          <label className="text-sm font-medium">העלה קובץ וידאו/אודיו</label>
          <Input
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={loading}
          />
          <Button 
            onClick={transcribeFile} 
            disabled={loading || !selectedFile}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "מתמלל..." : "תמלל קובץ"}
          </Button>
        </div>

        {/* ✅ תיבת טקסט */}
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="הטקסט המתומלל יופיע כאן, או הדבק טקסט ידנית..."
          disabled={loading}
        />

        <Button 
          onClick={summarizeText} 
          disabled={loading || !inputText.trim()}
          className="w-full"
          variant="secondary"
        >
          {loading ? "מסכם..." : "סכם טקסט"}
        </Button>

        {/* ✅ תוצאה */}
        {summary && (
          <div className="bg-purple-100 p-4 rounded-lg text-sm text-purple-800 border-r-4 border-purple-500">
            <strong>סיכום AI:</strong>
            <p className="mt-2 whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {/* ✅ שגיאות */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default SummarizeAI
