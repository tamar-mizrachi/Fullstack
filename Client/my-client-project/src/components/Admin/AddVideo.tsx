import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';

const AddVideo: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [nameTalk, setNameTalk] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [category, setCategory] = useState('');
    const [transcription, setTranscription] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            title: !title,
            description: !description,
            createdDate: !createdDate,
            nameTalk: !nameTalk,
            videoUrl: !videoUrl,
            category: !category,
            transcription: !transcription,
        };
        setErrors(newErrors);

        if (Object.values(newErrors).includes(true)) return;

        try {
            const response = await fetch('https://localhost:7087/api/Video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    createdDate,
                    nameTalk,
                    videoUrl,
                    category,
                    transcription,
                }),
            });

            if (!response.ok) throw new Error('Failed to add video');

            alert("סרטון נוסף בהצלחה");
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add video');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>הוספת סרטון</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="כותרת" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} helperText={errors.title ? 'נדרש' : ''} />
                    <TextField label="תיאור" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} helperText={errors.description ? 'נדרש' : ''} />
                    <TextField type="date" fullWidth margin="normal" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} error={errors.createdDate} helperText={errors.createdDate ? 'נדרש' : ''} />
                    <TextField label="שם הדובר" fullWidth margin="normal" value={nameTalk} onChange={(e) => setNameTalk(e.target.value)} error={errors.nameTalk} helperText={errors.nameTalk ? 'נדרש' : ''} />
                    <TextField label="כתובת וידאו" fullWidth margin="normal" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} error={errors.videoUrl} helperText={errors.videoUrl ? 'נדרש' : ''} />
                    <FormControl fullWidth margin="normal" error={errors.category}>
                        <InputLabel>קטגוריה</InputLabel>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <MenuItem value="education">חינוך</MenuItem>
                            <MenuItem value="entertainment">בידור</MenuItem>
                        </Select>
                        {errors.category && <FormHelperText>נדרש</FormHelperText>}
                    </FormControl>
                    <TextField label="תמלול" fullWidth margin="normal" value={transcription} onChange={(e) => setTranscription(e.target.value)} error={errors.transcription} helperText={errors.transcription ? 'נדרש' : ''} />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>הוסף סרטון</Button>
                </form>
            </Box>
        </Container>
    );
};

export default AddVideo;

