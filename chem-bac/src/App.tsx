import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
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
import {AdminTestsPage} from './pages/admin/AdminTestsPage';
import {AdminLessonsPage} from './pages/admin/AdminLessonsPage';

export default function App() {
    return (
        <BrowserRouter>
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
                            <Route path="/teme/:id" element={<TopicDetailPage/>}/>
                            <Route path="/teste" element={<TestsPage/>}/>
                            <Route path="/teste/:id" element={<TakeTestPage/>}/>
                            <Route path="/rezultate" element={<MyResultsPage/>}/>
                            <Route path="/rezultate/:id" element={<ResultDetailPage/>}/>
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
