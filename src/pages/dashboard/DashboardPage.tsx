import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileClock,
  Clock,
  MessageSquare,
  ChevronRight,
  ListChecks,
  UserCog,
  TrendingUp, // Mengganti beberapa ikon untuk variasi
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
// import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import * as userService from "../../services/userService";
import * as attendanceService from "../../services/attendanceService";
import * as studentCaseService from "../../services/studentCaseService";
import type { StudentCaseRecord } from "../../services/studentCaseService";

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    attendanceToday: 0,
    activeCases: 0,
    unreadMessages: 7,
    pendingAssessments: 4,
  });
  const [recentCases, setRecentCases] = useState<StudentCaseRecord[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (user && (user.role === "admin" || user.role === "guru_bk")) {
      setIsLoadingStats(true);
      try {
        // Helper untuk mendapatkan format YYYY-MM-DD dari tanggal lokal
        const getLocalDateString = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 0-indexed, jadi +1
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const todayDate = getLocalDateString(new Date()); // Gunakan tanggal lokal
        const [allUsers, dailyReport, allCases] = await Promise.all([
          userService.getUsers(),
          attendanceService.getDailyReport(todayDate),
          studentCaseService.getCases(),
        ]);
        const studentCount = allUsers.filter((u) => u.role === "siswa").length;
        const presentTodayCount = dailyReport.filter(
          (r) => r.status === "HADIR"
        ).length;
        const totalCaseCount = allCases.length;

        setRecentCases(allCases.slice(0, 5)); // Menampilkan 5 kasus terbaru
        setDashboardStats((prevStats) => ({
          ...prevStats,
          totalStudents: studentCount,
          attendanceToday: presentTodayCount,
          activeCases: totalCaseCount,
        }));
      } catch (error) {
        console.error("Gagal mengambil data untuk dashboard:", error);
      } finally {
        setIsLoadingStats(false);
      }
    } else {
      setIsLoadingStats(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const quickAccessItems = [
    {
      title: "Manajemen User",
      description: "Kelola akun pengguna",
      icon: UserCog,
      link: "/dashboard/user-management",
      roles: ["admin"],
    },
    {
      title: "Manajemen Siswa",
      description: "Lihat daftar siswa",
      icon: Users,
      link: "/dashboard/guru/daftar-siswa",
      roles: ["guru_bk", "admin"],
    },
    {
      title: "Laporan Absensi",
      description: "Pantau absensi",
      icon: ListChecks,
      link: "/dashboard/attendance-report",
      roles: ["guru_bk", "admin"],
    },
    {
      title: "Jurnal Kasus",
      description: "Catat & lihat kasus",
      icon: FileClock,
      link: "/dashboard/jurnal-kasus",
      roles: ["guru_bk", "admin"],
    },
    {
      title: "Wadah Aspirasi",
      description: "Lihat aspirasi masuk",
      icon: MessageSquare,
      link: "/dashboard/aspirasi",
      roles: ["guru_bk", "admin"],
    },
  ];

  const visibleQuickAccessItems = quickAccessItems.filter(
    (item) => user && item.roles.includes(user.role)
  );
  const roleStyles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800 border border-purple-200",
    guru_bk: "bg-blue-100 text-blue-800 border border-blue-200",
    siswa: "bg-green-100 text-green-800 border border-green-200",
    default: "bg-gray-100 text-gray-800",
  };
  const formatRoleName = (role: string) =>
    role.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className='bg-gray-50/50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
              Dashboard
            </h1>
            <div className='mt-2 text-sm text-gray-500 flex items-center gap-x-2'>
              <span>Welcome back, {user?.name}!</span>
              {user?.role && (
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                    roleStyles[user.role] || roleStyles.default
                  }`}
                >
                  {formatRoleName(user.role)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          <Card className='bg-gradient-to-br from-blue-500 to-primary-600 text-white shadow-lg'>
            <CardContent className='p-5'>
              <div className='flex items-center'>
                <div className='p-3'>
                  <Users className='h-7 w-7' />
                </div>
                <div className='ml-4 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-blue-200 truncate'>
                      Total Siswa
                    </dt>
                    <dd>
                      {isLoadingStats ? (
                        <div className='h-8 w-16 bg-white/30 rounded animate-pulse'></div>
                      ) : (
                        <div className='text-2xl font-bold'>
                          {dashboardStats.totalStudents}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white shadow-sm'>
            <CardContent className='p-5'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-green-100'>
                  <Clock className='h-6 w-6 text-green-600' />
                </div>
                <div className='ml-4 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Hadir Hari Ini
                    </dt>
                    <dd>
                      {isLoadingStats ? (
                        <div className='h-7 w-12 bg-gray-200 rounded animate-pulse'></div>
                      ) : (
                        <div className='text-lg font-bold text-gray-900'>
                          {dashboardStats.attendanceToday}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white shadow-sm'>
            <CardContent className='p-5'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-yellow-100'>
                  <FileClock className='h-6 w-6 text-yellow-600' />
                </div>
                <div className='ml-4 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Total Kasus
                    </dt>
                    <dd>
                      {isLoadingStats ? (
                        <div className='h-7 w-12 bg-gray-200 rounded animate-pulse'></div>
                      ) : (
                        <div className='text-lg font-bold text-gray-900'>
                          {dashboardStats.activeCases}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white shadow-sm'>
            <CardContent className='p-5'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-indigo-100'>
                  <MessageSquare className='h-6 w-6 text-indigo-600' />
                </div>
                <div className='ml-4 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Pesan Belum Dibaca
                    </dt>
                    <dd>
                      <div className='text-lg font-bold text-gray-900'>
                        {dashboardStats.unreadMessages}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white shadow-sm'>
            <CardContent className='p-5'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-pink-100'>
                  <TrendingUp className='h-6 w-6 text-pink-600' />
                </div>
                <div className='ml-4 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Asesmen Tertunda
                    </dt>
                    <dd>
                      <div className='text-lg font-bold text-gray-900'>
                        {dashboardStats.pendingAssessments}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {(user?.role === "admin" || user?.role === "guru_bk") && (
          <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <Card className='shadow-sm'>
                <CardHeader>
                  <div className='flex justify-between items-center'>
                    <CardTitle>Kasus Terbaru</CardTitle>
                    <Link
                      to='/dashboard/jurnal-kasus'
                      className='text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center'
                    >
                      Lihat semua <ChevronRight className='h-4 w-4 ml-1' />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Siswa
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Topik Kasus
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Tanggal
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {isLoadingStats ? (
                          [...Array(3)].map((_, i) => (
                            <tr key={i}>
                              <td colSpan={3} className='px-6 py-5'>
                                <div className='h-5 bg-gray-200 rounded animate-pulse'></div>
                              </td>
                            </tr>
                          ))
                        ) : recentCases.length > 0 ? (
                          recentCases.map((caseItem) => (
                            <tr key={caseItem.id} className='hover:bg-gray-50'>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                  <div className='h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center'>
                                    <Users className='h-6 w-6 text-gray-400' />
                                  </div>
                                  <div className='ml-4'>
                                    <div className='font-medium text-gray-900'>
                                      {caseItem.studentName}
                                    </div>
                                    <div className='text-xs text-gray-500'>
                                      ID: {caseItem.studentId}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-700'>
                                  {caseItem.topic}
                                </div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-500'>
                                  {new Date(
                                    caseItem.caseDate
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className='text-center py-10 text-gray-500'
                            >
                              Tidak ada kasus terbaru.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='lg:col-span-1'>
              <Card className='shadow-sm'>
                <CardHeader>
                  <CardTitle>Notifikasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-center text-gray-500 py-8'>
                    Tidak ada notifikasi baru.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-gray-900'>Akses Cepat</h2>
          <div className='mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {visibleQuickAccessItems.map((item) => (
              <Link to={item.link} key={item.title} className='group'>
                <Card className='h-full hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1'>
                  <CardContent className='p-5 flex flex-col items-center text-center'>
                    <div
                      className={`rounded-full bg-gray-100 group-hover:bg-primary-100 p-4 mb-3 transition-colors`}
                    >
                      <item.icon className='h-8 w-8 text-gray-600 group-hover:text-primary-600 transition-colors' />
                    </div>
                    <h3 className='text-sm font-semibold text-gray-900'>
                      {item.title}
                    </h3>
                    <p className='text-xs text-gray-500 mt-1'>
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
