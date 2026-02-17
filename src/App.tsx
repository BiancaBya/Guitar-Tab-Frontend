import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/upload" element={<UploadPage />} />
                <Route path="/login" element={<div className="text-white pt-20 text-center">Login Page Coming Soon</div>} />
                <Route path="/register" element={<div className="text-white pt-20 text-center">Register Page Coming Soon</div>} />
            </Routes>
        </Router>
    );
}

export default App;

