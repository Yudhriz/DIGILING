import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import GuruBKStudentPage from "./pages/gurubk/GuruBKStudentPage";
import DetailStudentPage from "./pages/students/DetailStudentPage";
import AttendanceReportPage from "./pages/reports/AttendanceReportPage";
import CaseJournalPage from "./pages/cases/CaseJournalPage";
import AspirationPage from "./pages/aspirations/AspirationPage";
import ConsultationPage from "./pages/consultation/ConsultationPage";
import ProfileSayaPage from "./pages/gurubk/ProfileSayaPage";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route
            path='/reset-password/:token?'
            element={<ResetPasswordPage />}
          />

          {/* Protected Routes */}
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE UNTUK HALAMAN ABSENSI --- */}
          <Route
            path='/siswa/absensi'
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE UNTUK HALAMAN PROFILE SISWA --- */}
          <Route
            path='/siswa/profile-saya'
            element={
              <ProtectedRoute>
                <DetailStudentPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE UNTUK HALAMAN USER MANAGEMENT (ADMIN) --- */}
          <Route
            path='/dashboard/user-management'
            element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE UNTUK HALAMAN DETAIL SISWA (ADMIN) --- */}
          <Route
            path='/dashboard/user-management/detail/:userId'
            element={
              <ProtectedRoute>
                <DetailStudentPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE UNTUK HALAMAN DETAIL SISWA (GURU BK) --- */}
          <Route
            path='/dashboard/guru/daftar-siswa/detail/:userId'
            element={
              <ProtectedRoute>
                <DetailStudentPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE UNTUK HALAMAN PROFILE (GURU BK & ADMIN) --- */}
          <Route
            path='/profile-saya/:userId'
            element={
              <ProtectedRoute>
                <ProfileSayaPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE UNTUK HALAMAN SISWA MANAGEMENT (GURU BK) --- */}
          <Route
            path='/dashboard/guru/daftar-siswa'
            element={
              <ProtectedRoute>
                <GuruBKStudentPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE BARU UNTUK LAPORAN ABSENSI (ADMIN & GURU BK) --- */}
          <Route
            path='/dashboard/attendance-report'
            element={
              <ProtectedRoute>
                <AttendanceReportPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE BARU UNTUK JURNAL KASUS (GURU BK) --- */}
          <Route
            path='/dashboard/jurnal-kasus'
            element={
              <ProtectedRoute>
                <CaseJournalPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE BARU UNTUK JURNAL KASUS (SISWA) --- */}
          <Route
            path='/siswa/jurnal-kasus'
            element={
              <ProtectedRoute>
                <CaseJournalPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE BARU UNTUK WADAH ASPIRASI (GURU BK) --- */}
          <Route
            path='/dashboard/aspirasi'
            element={
              <ProtectedRoute>
                <AspirationPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE BARU UNTUK WADAH ASPIRASI (SISWA) --- */}
          <Route
            path='/siswa/aspirasi'
            element={
              <ProtectedRoute>
                <AspirationPage />
              </ProtectedRoute>
            }
          />

          {/* --- ROUTE BARU UNTUK KONSULTASI --- */}
          <Route
            path='/konsultasi'
            element={
              <ProtectedRoute>
                <ConsultationPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
