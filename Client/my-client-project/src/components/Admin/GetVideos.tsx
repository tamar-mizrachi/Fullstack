/*import React, { useEffect, useState } from 'react';

// Component to display the list of videos
const GetVideos: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);

    // כאן נבצע קריאה ל-API כדי להביא את הסרטונים
    useEffect(() => {
        const fetchVideos = async () => {
            const token = localStorage.getItem('authToken'); // קבלת הטוקן מאחסון מקומי
            if (token) {
                try {
                    const response = await fetch('http://localhost:7087/api/Video', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setVideos(data); // עדכון מצב הסרטונים
                    } else {
                        console.error('Failed to fetch videos');
                    }
                } catch (error) {
                    console.error('Error fetching videos:', error);
                }
            }
        };

        fetchVideos();
    }, []); // הפונקציה תרוץ פעם אחת כשהקומפוננטה נטענת

    return (
        <div>
            <h2>סרטונים שלי</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {videos.length > 0 ? (
                    videos.map((video: any) => (
                        <div key={video.id} style={videoStyle}>
                            <h3>{video.title}</h3>
                            <video width="320" height="240" controls>
                                <source src={video.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))
                ) : (
                    <p>No videos found.</p>
                )}
            </div>
        </div>
    );
};

const videoStyle: React.CSSProperties = {
    width: '320px',
    textAlign: 'center',
};

export default GetVideos;*/
//==========================================================
/*
import React, { useEffect, useState } from 'react';

const GetVideos: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [categorizedVideos, setCategorizedVideos] = useState<Record<string, any[]>>({});

    useEffect(() => {
        const fetchVideos = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch('http://localhost:7087/api/Video', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setVideos(data);
                        categorizeVideos(data);
                    } else {
                        console.error('Failed to fetch videos');
                    }
                } catch (error) {
                    console.error('Error fetching videos:', error);
                }
            }
        };

        fetchVideos();
    }, []);

    const categorizeVideos = (videos: any[]) => {
        const categorized: Record<string, any[]> = {};
        videos.forEach(video => {
            if (!categorized[video.category]) {
                categorized[video.category] = [];
            }
            categorized[video.category].push(video);
        });
        setCategorizedVideos(categorized);
    };

    return (
        <div>
            <h2>הסרטונים שלי </h2>
            {Object.keys(categorizedVideos).length > 0 ? (
                Object.keys(categorizedVideos).map(category => (
                    <div key={category} style={{ marginBottom: '20px' }}>
                        <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '5px' }}>{category}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            {categorizedVideos[category].map(video => (
                                <div key={video.id} style={videoStyle}>
                                    <h4>{video.title}</h4>
                                    <video width="320" height="240" controls>
                                        <source src={video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No videos found.</p>
            )}
        </div>
    );
};

const videoStyle: React.CSSProperties = {
    width: '320px',
    textAlign: 'center',
};

export default GetVideos;
*/import React, { useEffect, useState } from 'react';
import SpeechToText from './SpeechToText';

interface Video {
  id: number;
  title: string;
  url: string;
  category: string;
}

const GetVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categorizedVideos, setCategorizedVideos] = useState<Record<string, Video[]>>({});
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // וידאו נבחר לתצוגה

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:7087/api/Video', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data: Video[] = await response.json();
            setVideos(data);
            categorizeVideos(data);
          } else {
            console.error('Failed to fetch videos');
          }
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      }
    };

    fetchVideos();
  }, []);

  const categorizeVideos = (videos: Video[]) => {
    const categorized: Record<string, Video[]> = {};
    videos.forEach((video) => {
      if (!categorized[video.category]) {
        categorized[video.category] = [];
      }
      categorized[video.category].push(video);
    });
    setCategorizedVideos(categorized);
  };

  return (
    <div>
      <h2>הסרטונים שלי</h2>
      {Object.keys(categorizedVideos).length > 0 ? (
        Object.keys(categorizedVideos).map((category) => (
          <div key={category} style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '5px' }}>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {categorizedVideos[category].map((video) => (
                <div key={video.id} style={videoStyle}>
                  <h4>{video.title}</h4>
                  <video
                    width="320"
                    height="240"
                    controls
                    onClick={() => setSelectedVideo(video.url)}
                  >
                    <source src={video.url} type="video/mp4" />
                    הדפדפן שלך אינו תומך בתג הוידאו.
                  </video>
                  <div>
                    <button onClick={() => alert('מעבר לעריכת הסרטון')}>עריכה</button>
                    <button onClick={() => alert('מחיקת הסרטון')}>מחיקה</button>
                    <button onClick={() => alert('מעבר לדף פרטים')}>פרטים</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
         <p>לא נמצאו סרטונים</p>
      )}

      {/* הצגת וידאו במסך מלא עם תמלול */}
      {selectedVideo && (
        <div style={fullScreenStyle}>
          <video width="80%" controls autoPlay>
            <source src={selectedVideo} type="video/mp4" />
          </video>
          <SpeechToText />
          <button onClick={() => setSelectedVideo(null)}>סגור</button>
        </div>
      )}
    </div>
  );
};

const videoStyle: React.CSSProperties = {
  width: '320px',
  textAlign: 'center',
};

const fullScreenStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

export default GetVideos;
