
"use client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"

import Home from "./components/home"
import AdminHome from "./components/admin-home"
import ViewerHome from "./components/viewer-home"
import AddVideo from "./components/add-video"
import MyVideos from "./components/my-videos"
import AllVideos from "./components/all-videos"
import Search from "./components/search"
import DeleteVideo from "./components/delete-video"
import EditVideo from "./components/edit-video"
import VideoDetails from "./components/video-detailes"
import VideoPlayer from "./components/video-player"
import UserProfile from "./components/user-profile"
import Login from "./components/login"
import Register from "./components/register"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={() => {}} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Admin Routes */}
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-home/add-video" element={<AddVideo />} />
          <Route path="/admin-home/my-videos" element={<MyVideos />} />
          <Route path="/admin-home/search" element={<Search />} />
          <Route
            path="/admin-home/my-videos/edit/:id"
            element={
              <EditVideo
                video={{
                  id: 1,
                  title: "סרטון לדוגמה",
                  description: "תיאור הסרטון",
                  videoUrl: "/placeholder-video.mp4",
                  createdDate: "2024-01-15",
                  uploadDate: "2024-01-16",
                  nameTalk: "מרצה לדוגמה",
                  categoryId: 1,
                  userId: 1,
                }}
                onClose={() => window.history.back()}
              />
            }
          />
          <Route path="/admin-home/my-videos/delete/:videoId" element={<DeleteVideo />} />
          <Route
            path="/admin-home/my-videos/details/:id"
            element={
              <VideoDetails
                video={{
                  id: 1,
                  title: "סרטון לדוגמה",
                  description: "תיאור מפורט של הסרטון",
                  videoUrl: "/placeholder-video.mp4",
                  createdDate: "2024-01-15",
                  uploadDate: "2024-01-16",
                  nameTalk: "מרצה לדוגמה",
                  categoryId: 1,
                  userId: 1,
                }}
                onClose={() => window.history.back()}
              />
            }
          />

          {/* Viewer Routes */}
          <Route path="/viewer-home" element={<ViewerHome />} />
          <Route path="/viewer-home/all-videos" element={<AllVideos />} />
          <Route path="/viewer-home/search" element={<Search />} />

          {/* Video Routes */}
          <Route
            path="/video/:id"
            element={
              <VideoPlayer
                video={{
                  id: 1,
                  title: "הרצאה מעניינת על טכנולוגיה",
                  description: "בהרצאה זו נלמד על הטכנולוגיות החדשות ביותר בתחום הפיתוח",
                  videoUrl: "/placeholder-video.mp4",
                  createdDate: "2024-01-15",
                  uploadDate: "2024-01-16",
                  nameTalk: 'ד"ר יוסי כהן',
                  categoryId: 1,
                  userId: 1,
                }}
                categoryName="טכנולוגיה"
              />
            }
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-xl">העמוד לא נמצא</p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
