import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { ExportPage } from './pages/ExportPage';
import { MetronomePage } from './pages/MetronomePage';
import { TunerPage } from './pages/TunerPage';
import { ChordsPage } from './pages/ChordsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { isAuthenticated } from './utils/auth';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
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

                <Route
                    path="/export"
                    element={
                        <ProtectedRoute>
                            <ExportPage />
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
