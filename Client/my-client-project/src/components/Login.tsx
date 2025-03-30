/*import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
    const [Name, setUserName] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{ Name: boolean; Password: boolean }>({
        Name: false,
        Password: false,
    });

    const handleLogin = async () => {
        let newErrors = { Name: !Name, Password: !Password };
        setErrors(newErrors);

        if (newErrors.Name || newErrors.Password) return; // אם יש שגיאות, עצור

        try {
            const res = await fetch('https://localhost:7087/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Name, Password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await res.json();
            console.log('Login successful:', data);
            localStorage.setItem('authToken', data.token);

            navigate('/'); 
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Invalid login credentials');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Email *"
                    variant="outlined"
                    value={Name}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.Name}
                    helperText={errors.Name ? 'Email is required' : ''}
                />
                <TextField
                    label="Password *"
                    type="password"
                    variant="outlined"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.Password}
                    helperText={errors.Password ? 'Password is required' : ''}
                />
                <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;*/
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
    const [Name, setUserName] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{ Name: boolean; Password: boolean }>({
        Name: false,
        Password: false,
    });

    const handleLogin = async () => {
        let newErrors = { Name: !Name, Password: !Password };
        setErrors(newErrors);

        if (newErrors.Name || newErrors.Password) return; // אם יש שגיאות, עצור

        try {
            const res = await fetch('https://localhost:7087/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Name, Password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await res.json();
            console.log('Login successful:', data);
            localStorage.setItem('authToken', data.token);

            // נווט על פי התפקיד
            // אפשר לבדוק את ה-token דרך חבילה כמו jwt-decode ולשלוף ממנו את התפקיד
            const token = data.token;
            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // פענוח ה-JWT
                const role = decodedToken.role;

                if (role === 'Admin') {
                    navigate('/admin-home'); // ניווט לעמוד הבית של מנהל
                } else if (role === 'Viewer') {
                    navigate('/viewer-home'); // ניווט לעמוד הבית של הצופה
                }
            }

            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Invalid login credentials');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Email *"
                    variant="outlined"
                    value={Name}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.Name}
                    helperText={errors.Name ? 'Email is required' : ''}
                />
                <TextField
                    label="Password *"
                    type="password"
                    variant="outlined"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.Password}
                    helperText={errors.Password ? 'Password is required' : ''}
                />
                <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
