import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteVideo: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();  // מקבל את ה-Id של הסרטון מה-URL
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const navigate = useNavigate();  // שימוש ב-useNavigate במקום useHistory

    const handleDelete = async () => {
        setIsDeleting(true);
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetch(`http://localhost:7087/api/Video/${videoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    navigate('/videos');  // אחרי מחיקה, חזרה לעמוד הסרטונים
                } else {
                    console.error('Failed to delete video');
                }
            } catch (error) {
                console.error('Error deleting video:', error);
            }
        }
    };

    return (
        <div>
            <h2>האם אתה בטוח שברצונך למחוק את הסרטון?</h2>
            <button onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
};

export default DeleteVideo;
