import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VideoDetails: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();  // מקבל את ה-Id של הסרטון מה-URL
    const [video, setVideo] = useState<any | null>(null);
    const [transcript, setTranscript] = useState<string | null>(null);

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
                        const transcript = await fetchTranscript(data.url);  // כאן נשיג תמלול מה-AI
                        setTranscript(transcript);
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

    // פונקציה שמביאה תמלול מ-AI
    const fetchTranscript = async (videoUrl: string): Promise<string> => {
        // כאן אפשר לבצע קריאה לשירות תמלול AI
        return 'תמלול סרטון דינמי מ-AI כאן';
    };

    return (
        <div>
            {video ? (
                <div>
                    <h2>{video.title}</h2>
                    <video width="100%" height="auto" controls>
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <h3>תמלול סרטון:</h3>
                    <p>{transcript}</p>
                </div>
            ) : (
                <p>Loading video details...</p>
            )}
        </div>
    );
};

export default VideoDetails;
