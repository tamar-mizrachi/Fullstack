import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditVideo: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();  // מקבל את ה-Id של הסרטון מה-URL
    const [video, setVideo] = useState<any>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const navigate = useNavigate();  // שימוש ב-useNavigate במקום useHistory

    useEffect(() => {
        const fetchVideo = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch(`http://localhost:7087/api/Video/${videoId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setVideo(data);
                        setTitle(data.title);
                        setDescription(data.description);
                    } else {
                        console.error('Failed to fetch video');
                    }
                } catch (error) {
                    console.error('Error fetching video:', error);
                }
            }
        };

        fetchVideo();
    }, [videoId]);

    const handleSave = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetch(`http://localhost:7087/api/Video/${videoId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description,
                    }),
                });

                if (response.ok) {
                    navigate('/videos');  // לאחר שמירה, חזרה לעמוד הסרטונים
                } else {
                    console.error('Failed to update video');
                }
            } catch (error) {
                console.error('Error saving video:', error);
            }
        }
    };

    return (
        <div>
            <h2>עריכת סרטון</h2>
            {video ? (
                <div>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <p>Loading video...</p>
            )}
        </div>
    );
};

export default EditVideo;
