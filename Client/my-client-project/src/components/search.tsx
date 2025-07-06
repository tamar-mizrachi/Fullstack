

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, Filter, Calendar, User, Play, TrendingUp, Star } from "lucide-react"

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

const Search: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchResults, setSearchResults] = useState<VideoType[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState<boolean>(false)

  // Popular searches and trending topics
  const popularSearches = ["הרצאות", "טכנולוגיה", "חינוך", "בידור", "מדע"]
  const trendingTopics = ["AI", "פיתוח", "עיצוב", "שיווק", "יזמות"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, categoriesRes] = await Promise.all([
          axios.get("https://localhost:7087/api/Video"),
          axios.get("https://localhost:7087/api/Category"),
        ])

        setVideos(videosRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error("שגיאה בטעינת הנתונים:", err)
      }
    }

    fetchData()
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

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

    setSearchResults(filtered)
    setLoading(false)
  }

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term)
    setTimeout(() => handleSearch(), 100)
  }

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "לא ידוע"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
       
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            חיפוש סרטונים
          </h1>
          <p className="text-slate-600">מצא בדיוק את מה שאתה מחפש</p>
        </div>

      
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-purple-600" />
              חיפוש מתקדם
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="הקלד כדי לחפש סרטונים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="קטגוריה" />
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
              <Button onClick={handleSearch} disabled={loading} className="h-12 px-8" style={{color:"black"}}>
                {loading ? "מחפש..." : "חפש"}
              </Button>
            </div>

           
            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="popular" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  חיפושים פופולריים
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  נושאים חמים
                </TabsTrigger>
              </TabsList>
              <TabsContent value="popular" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(term)}
                      className="hover:bg-purple-50 hover:border-purple-300"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="trending" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(topic)}
                      className="hover:bg-pink-50 hover:border-pink-300"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {topic}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {hasSearched && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>תוצאות חיפוש</span>
                <Badge variant="secondary">{searchResults.length} תוצאות</Badge>
              </CardTitle>
              {searchTerm && (
                <CardDescription>
                  תוצאות עבור: <strong>"{searchTerm}"</strong>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">לא נמצאו תוצאות</h3>
                  <p className="text-slate-600 mb-4">נסה לחפש במילים אחרות או בקטגוריה אחרת</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setHasSearched(false)
                    }}
                  >
                    נקה חיפוש
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((video) => (
                    <Card
                      key={video.id}
                      className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-white/60"
                    >
                      <div className="relative">
                        <div className="aspect-video bg-black relative overflow-hidden">
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
                        </div>
                      </div>

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

                        <div className="flex items-center justify-between ">
                          <Badge variant="secondary">{getCategoryName(video.categoryId)}</Badge>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-black">
                            <Play className="h-4 w-4 mr-1" />
                            צפה
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      
        {!hasSearched && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-600" />
                טיפים לחיפוש
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SearchIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">חיפוש מדויק</h3>
                  <p className="text-sm text-slate-600">השתמש במילות מפתח ספציפיות לתוצאות טובות יותר</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Filter className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">סינון לפי קטגוריה</h3>
                  <p className="text-sm text-slate-600">בחר קטגוריה ספציפית כדי לצמצם את התוצאות</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">נושאים פופולריים</h3>
                  <p className="text-sm text-slate-600">נסה את החיפושים הפופולריים והנושאים החמים</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Search

