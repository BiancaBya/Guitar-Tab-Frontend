import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { MetronomePage } from './pages/MetronomePage';
import { TunerPage } from "./pages/TunerPage.tsx";
import {ChordsPage} from "./pages/ChordsPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/upload" element={<UploadPage />} />

                <Route path="/metronome" element={<MetronomePage />} />
                <Route path="/tuner" element={<TunerPage />} />
                <Route path="/chords" element={<ChordsPage />} />

                <Route path="/login" element={<div className="text-white pt-20 text-center"></div>} />
                <Route path="/register" element={<div className="text-white pt-20 text-center"></div>} />
            </Routes>
        </Router>
    );
}

export default App;
