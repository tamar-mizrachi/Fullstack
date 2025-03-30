/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, IconButton, InputAdornment, MenuItem, InputLabel, Select, FormControl, FormHelperText } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Register() {
    const [Name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ fullName?: boolean; Name?: boolean; password?: boolean; email?: boolean; role?: boolean }>({});
    const navigate = useNavigate();

    const handleRegister = async () => {
        let newErrors = {
            Name: !Name,
            password: !password,
            email: !email,
            role: !role
        };
        setErrors(newErrors);

        if (Object.values(newErrors).includes(true)) return;

        try {
            const res = await fetch('http://localhost:7087/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: Name,
                    Password: password,
                    Email: email,
                    role: role
                }),
            });

            const responseText = await res.text();
            console.log('Response:', responseText);

            // if (!res.ok) {
            //     throw new Error(responseText);
            // }
            // if (!res.ok) {
            //     const errorData = await res.json();
            //     throw new Error(errorData.message || 'Registration failed');
            // }
            const data = await res.json(); // קריאה אחת ל-json()

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            //console.log('User registered successfully!');
            navigate('/Admin'); // ניתוב לעמוד ההצלחה

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Error during registration:', err.message);
                alert('Registration failed: ' + err.message);
            } else {
                console.error('Unknown error during registration:', err);
                alert('An unknown error occurred.');
            }
        }
        // } catch (error) {
        //     console.error('Error during registration:', error.message);
        //     alert('Registration failed: ' + error.message);
        // }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>Register</Typography>

                <TextField
                    label="Username *"
                    variant="outlined"
                    value={Name}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.Name}
                    helperText={errors.Name ? 'Username is required' : ''}
                />
                <TextField
                    label="Password *"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.password}
                    helperText={errors.password ? 'Password is required' : ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Email *"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.email}
                    helperText={errors.email ? 'Email is required' : ''}
                />
                <FormControl fullWidth sx={{ mb: 2 }} error={errors.role}>
                    <InputLabel>Role *</InputLabel>
                    <Select
                        value={role}
                        label="Role *"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="option1">Admin</MenuItem>
                        <MenuItem value="option2">Viewer</MenuItem>
                    </Select>
                    {errors.role && <FormHelperText error>Selection is required</FormHelperText>}
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
                    Register
                </Button>
            </Box>
        </Container>
    );
}

export default Register;*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, IconButton, InputAdornment, MenuItem, InputLabel, Select, FormControl, FormHelperText } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Register() {
    const [Name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ fullName?: boolean; Name?: boolean; password?: boolean; email?: boolean; role?: boolean }>({});
    const navigate = useNavigate();

    const handleRegister = async () => {
        let newErrors = {
            Name: !Name,
            password: !password,
            email: !email,
            role: !role
        };
        setErrors(newErrors);

        if (Object.values(newErrors).includes(true)) return;

        try {
            const res = await fetch('http://localhost:7087/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: Name,
                    Password: password,
                    Email: email,
                    role: role
                }),
            });

            const responseText = await res.text();
            console.log('Response:', responseText);

            const data = await res.json(); // קריאה אחת ל-json()

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // אם הרישום הצליח, נווט את המשתמש בהתאם לתפקיד שלו
            if (data.role === 'Admin') {
                navigate('/admin-home'); // ניווט לעמוד הבית של מנהל
            } else if (data.role === 'Viewer') {
                navigate('/viewer-home'); // ניווט לעמוד הבית של הצופה
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Error during registration:', err.message);
                alert('Registration failed: ' + err.message);
            } else {
                console.error('Unknown error during registration:', err);
                alert('An unknown error occurred.');
            }
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>Register</Typography>

                <TextField
                    label="Username *"
                    variant="outlined"
                    value={Name}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.Name}
                    helperText={errors.Name ? 'Username is required' : ''}
                />
                <TextField
                    label="Password *"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.password}
                    helperText={errors.password ? 'Password is required' : ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Email *"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={errors.email}
                    helperText={errors.email ? 'Email is required' : ''}
                />
                <FormControl fullWidth sx={{ mb: 2 }} error={errors.role}>
                    <InputLabel>Role *</InputLabel>
                    <Select
                        value={role}
                        label="Role *"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Viewer">Viewer</MenuItem>
                    </Select>
                    {errors.role && <FormHelperText error>Selection is required</FormHelperText>}
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
                    Register
                </Button>
            </Box>
        </Container>
    );
}

export default Register;




