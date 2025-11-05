"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

const SummarizeAI = ({ initialText = "" }) => {
  const [inputText, setInputText] = useState(initialText)
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const sendToAI = async () => {
    if (!inputText.trim()) {
      setError("⚠️ אין טקסט לתרגום — כנראה שלא דיברו בסרטון.")
      return
    }

    setLoading(true)
    setError("")
    setSummary("")

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/Analyze/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }) // ← שליחה נכונה
      })

      const data = await res.json()

      if (data?.summary) {
        setSummary(data.summary)
      } else if (data?.noSpeech === true) {
        setError("🎵 לא זוהו מילים — כנראה שיש רק מוזיקה בסרטון.")
      } else {
        setError("⚠️ לא התקבלה תוצאה מה-AI.")
      }
    } catch (err) {
      console.error("AI error:", err)
      setError("❌ שגיאה בחיבור לשרת ה-AI.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>סיכום באמצעות AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          placeholder="הכנס טקסט לתמלול או סיכום..."
        />

        <Button onClick={sendToAI} disabled={loading}>
          {loading ? "מעבד..." : "סכם עם AI"}
        </Button>

        {summary && (
          <div className="bg-purple-100 p-4 rounded-lg text-sm text-purple-800">
            <strong>סיכום:</strong> {summary}
          </div>
        )}

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
