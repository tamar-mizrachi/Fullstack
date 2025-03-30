import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Login';
import Register from './components/Register';
import GetVideos from './components/Admin/GetVideos';
import AdminHome from './components/Admin/AdminHome';
import AddVideo from './components/Admin/AddVideo';
import EditVideo from './components/Admin/EditVideo';
import DeleteVideo from './components/Admin/DeleteVideo';
import VideoDetails from './components/Admin/VideoDetailes';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-videos" element={<GetVideos />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/add-video" element={<AddVideo />} />
        <Route path="/edit/:videoId" element={<EditVideo/>} />
        <Route path="/delete/:videoId" element={<DeleteVideo/>} />
        <Route path="/details/:videoId" element={<VideoDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;
