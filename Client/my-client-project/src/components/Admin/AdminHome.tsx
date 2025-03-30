import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import logo from "../logo/לוגו גמור.png";
import GetVideos from './GetVideos';
import AddVideo from './AddVideo'; // ייבוא הקומפוננטה של הוספת הסרטון

function AdminHome() {
    const [showVideos, setShowVideos] = useState<boolean>(false); // למעקב אחרי הצגת הסרטונים
    const [open, setOpen] = useState<boolean>(false); // למעקב אחרי מצב ה-Dialog
    const [dialogType, setDialogType] = useState<string>(''); // כדי להגדיר איזה טופס להציג

    const handleShowVideos = () => {
        setShowVideos(true);
    };

    const handleAddVideo = () => {
        setDialogType('addVideo');
        setOpen(true); // פותחים את ה-Dialog
    };

    const handleClose = () => {
        setOpen(false); // סוגרים את ה-Dialog
    };

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <header style={headerStyle}>
                <h1 style={welcomeStyle}>
                    <img src={logo} alt="Logo" style={{ height: 110, position: "absolute", top: 4 }} />
                </h1>
                <nav style={navStyle}>
                    <button style={buttonStyle} onClick={handleShowVideos}>MyVideos</button>
                    <button style={buttonStyle} onClick={handleAddVideo}>AddVideo</button>
                    <button style={buttonStyle} >Search</button>

                </nav>
            </header>

            <div style={contentStyle}>
                {showVideos && <GetVideos />}
            </div>

            {/* Dialog שמציג את טופס הוספת סרטון */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{dialogType === 'addVideo' ? 'Add Video' : ''}</DialogTitle>
                <DialogContent>
                    {dialogType === 'addVideo' && <AddVideo />} {/* הצגת הטופס להוספת סרטון */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '150px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 20px',
    backgroundColor: 'rgb(228, 101, 130)',
    color: 'white',
    zIndex: 1,
};

const welcomeStyle: React.CSSProperties = {
    margin: 45,
    fontSize: '50px',
};

const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    marginRight: '100px',
};

const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
};

const contentStyle: React.CSSProperties = {
    marginTop: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

export default AdminHome;


