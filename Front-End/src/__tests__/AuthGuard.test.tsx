import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthGuard } from '../components/AuthGuard';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('AuthGuard', () => {
    it('Redirects to /login when unauthenticated', () => {
        // Clear local storage to simulate unauthenticated state
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const { container } = render(
            <MemoryRouter initialEntries={['/protected']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
                        <Route path="/protected" element={<AuthGuard><div data-testid="protected-content">Secret</div></AuthGuard>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        // The hook inside AuthProvider might trigger an effect, but since token is null,
        // it should redirect us immediately to login.
        expect(container.innerHTML).toContain('Login Page');
        expect(container.innerHTML).not.toContain('Secret');
    });
});
