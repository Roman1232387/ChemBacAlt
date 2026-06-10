import React, { useEffect } from 'react';
import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import { ProtectedLayout, PublicLayout } from './layouts/layouts';
import {ProtectedRoute, AdminRoute} from './routes/guards';

// Pages
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {Page401, Page403, Page404, Page500} from './pages/errors/ErrorPages';
import {DashboardPage} from './pages/DashboardPage';
import {LessonsPage} from './pages/LessonsPage';
import {LessonDetailPage} from './pages/LessonDetailPage';
import {TopicsPage} from './pages/TopicsPage';
import {TopicDetailPage} from './pages/TopicDetailPage';
import {TestsPage} from './pages/TestsPage';
import {TakeTestPage} from './pages/TakeTestPage';
import {MyResultsPage} from './pages/MyResultsPage';
import {ResultDetailPage} from './pages/ResultDetailPage';
import {ProfilePage} from './pages/ProfilePage';
import {SettingsPage} from './pages/SettingsPage';
import {AdminTestsPage} from './pages/admin/AdminTestsPage';
import {AdminLessonsPage} from './pages/admin/AdminLessonsPage';
import {ResourcesPage} from './pages/ResourcesPage';

function PageTitleUpdater() {
    const location = useLocation();

    useEffect(() => {
        const titleMap: Record<string, string> = {
            '/dashboard': 'Acasă | ChemBAC',
            '/lectii': 'Lecții | ChemBAC',
            '/teme': 'Teme BAC | ChemBAC',
            '/teste': 'Teste | ChemBAC',
            '/rezultate': 'Rezultatele mele | ChemBAC',
            '/profil': 'Profil | ChemBAC',
            '/setari': 'Setări | ChemBAC',
            '/resurse': 'Resurse | ChemBAC',
            '/admin/lectii': 'Admin — Lecții | ChemBAC',
            '/admin/teste': 'Admin — Teste | ChemBAC',
            '/login': 'Autentificare | ChemBAC',
            '/register': 'Înregistrare | ChemBAC',
        };

        const path = location.pathname;
        let title = titleMap[path];

        if (!title) {
            if (path.startsWith('/lectii/')) title = 'Lecție | ChemBAC';
            else if (path.startsWith('/teme/')) title = 'Temă | ChemBAC';
            else if (path.startsWith('/teste/')) title = 'Susține test | ChemBAC';
            else if (path.startsWith('/rezultate/')) title = 'Detalii rezultat | ChemBAC';
            else title = 'ChemBAC';
        }

        document.title = title;
    }, [location.pathname]);

    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <PageTitleUpdater />
            <AuthProvider>
                <Routes>

                    {/* ── Public routes ── */}
                    <Route element={<PublicLayout/>}>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/401" element={<Page401/>}/>
                        <Route path="/403" element={<Page403/>}/>
                        <Route path="/500" element={<Page500/>}/>
                    </Route>

                    {/* ── Protected routes (user + admin) ── */}
                    <Route element={<ProtectedRoute/>}>
                        <Route element={<ProtectedLayout/>}>
                            <Route path="/dashboard" element={<DashboardPage/>}/>
                            <Route path="/lectii" element={<LessonsPage/>}/>
                            <Route path="/lectii/:id" element={<LessonDetailPage/>}/>
                            <Route path="/teme" element={<TopicsPage/>}/>
                            <Route path="/resurse" element={<ResourcesPage/>}/>
                            <Route path="/teme/:id" element={<TopicDetailPage/>}/>
                            <Route path="/teste" element={<TestsPage/>}/>
                            <Route path="/teste/:id" element={<TakeTestPage/>}/>
                            <Route path="/rezultate" element={<MyResultsPage/>}/>
                            <Route path="/rezultate/:id" element={<ResultDetailPage/>}/>
                            <Route path="/profil" element={<ProfilePage/>}/>
                            <Route path="/setari" element={<SettingsPage/>}/>
                        </Route>
                    </Route>

                    {/* ── Admin-only routes ── */}
                    <Route element={<AdminRoute/>}>
                        <Route element={<ProtectedLayout/>}>
                            <Route path="/admin/lectii" element={<AdminLessonsPage/>}/>
                            <Route path="/admin/teste" element={<AdminTestsPage/>}/>
                        </Route>
                    </Route>

                    {/* ── Fallback ── */}
                    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                    <Route path="*" element={<Page404/>}/>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
