export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token');
};

export const saveAuthData = (token: string, username: string): void => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);
    window.dispatchEvent(new Event('storage'));
};

export const clearAuthData = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storage'));
};

