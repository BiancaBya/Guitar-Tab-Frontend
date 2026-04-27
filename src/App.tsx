import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { MetronomePage } from './pages/MetronomePage';
import { TunerPage } from './pages/TunerPage';
import { ChordsPage } from './pages/ChordsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { isAuthenticated } from './utils/auth';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route
                    path="/upload"
                    element={
                        <ProtectedRoute>
                            <UploadPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/metronome" element={<MetronomePage />} />
                <Route path="/tuner" element={<TunerPage />} />
                <Route path="/chords" element={<ChordsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
}

export default App;

