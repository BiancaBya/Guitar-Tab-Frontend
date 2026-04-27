import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { saveAuthData } from '../utils/auth';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface TokenResponse {
    access_token: string;
    token_type: string;
}

interface LocationState {
    from?: string;
}

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as LocationState | null;
    const redirectTo = state?.from || '/';

    const handleLogin = async (username: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post<TokenResponse>(`${API_BASE_URL}/token`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        saveAuthData(response.data.access_token, username);
        navigate(redirectTo, { replace: true });
    };

    return (
        <AuthLayout
            title="Log in"
            subtitle="Access your saved tablatures and generate new ones."
            buttonText="Log in"
            onSubmit={handleLogin}
            footerText="Don't have an account?"
            footerLinkText="Sign up"
            footerLinkTo="/register"
        />
    );
};

