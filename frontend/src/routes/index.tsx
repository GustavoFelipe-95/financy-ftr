import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectRoute, RedirectAuthenticatedRoute } from './authorizations';
import { LoginScreen } from '@pages/LoginScreen';
import { SignupScreen } from '@pages/SignupScreen';
import { TransactionsScreen } from '@pages/TransactionsScreen';
import { ProfileScreen } from '@pages/ProfileScreen';
import { CategoriesScreen } from '@pages/CategoriesScreen';
import { DashboardScreen } from '@pages/DashboardScreen';

export function RoutesAplication() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <RedirectAuthenticatedRoute><LoginScreen /></RedirectAuthenticatedRoute>
                    } />
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedRoute><SignupScreen /></RedirectAuthenticatedRoute>
                    } />
                <Route
                    path="/"
                    element={
                        <ProtectRoute><DashboardScreen /></ProtectRoute>
                    } />
                <Route
                    path="/categories"
                    element={
                        <ProtectRoute><CategoriesScreen /></ProtectRoute>
                    } />
                <Route
                    path="/transactions"
                    element={
                        <ProtectRoute><TransactionsScreen /></ProtectRoute>
                    } />
                <Route
                    path="/profile"
                    element={
                        <ProtectRoute><ProfileScreen /></ProtectRoute>
                    } />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}