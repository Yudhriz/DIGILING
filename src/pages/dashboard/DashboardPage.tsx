import React, { useState, useEffect, useCallback } from "react"; // Tambahkan useCallback
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileClock,
  Clock,
  MessageSquare,
  FileText,
  ChevronRight,
  Bell,
  ListChecks,
  UserCog,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import * as userService from "../../services/userService";
import * as attendanceService from "../../services/attendanceService"; // Impor attendanceService

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // State untuk menyimpan data dinamis, termasuk total siswa
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    attendanceToday: 0, // Nilai awal 0
    activeCases: 15, // Masih statis
    unreadMessages: 7, // Masih statis
    pendingAssessments: 4, // Masih statis
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // --- FUNGSI PENGAMBILAN DATA DI-REFACTOR DENGAN useCallback ---
  const fetchDashboardData = useCallback(async () => {
    if (user && (user.role === "admin" || user.role === "guru_bk")) {
      setIsLoadingStats(true);
      try {
        // Ambil data secara paralel untuk efisiensi
        const todayDate = new Date().toISOString().split("T")[0];

        const [allUsers, dailyReport] = await Promise.all([
          userService.getUsers(),
          attendanceService.getDailyReport(todayDate),
        ]);

        // Hitung total siswa
        const studentCount = allUsers.filter((u) => u.role === "siswa").length;

        // Hitung yang hadir hari ini
        const presentTodayCount = dailyReport.filter(
          (record) => record.status === "HADIR"
        ).length;

        // Perbarui state dengan semua data dinamis
        setDashboardStats((prevStats) => ({
          ...prevStats,
          totalStudents: studentCount,
          attendanceToday: presentTodayCount,
        }));
      } catch (error) {
        console.error("Gagal mengambil data untuk dashboard:", error);
        // Bisa tambahkan toast error di sini jika perlu
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

  const recentCases = [
    {
      id: 1,
      student: "Ahmad Rahardi",
      issue: "Academic Performance",
      date: "2025-03-15",
      status: "Open",
    },
    {
      id: 2,
      student: "Siti Nuraini",
      issue: "Behavioral Concern",
      date: "2025-03-14",
      status: "Open",
    },
    {
      id: 3,
      student: "Budi Santoso",
      issue: "Attendance Issue",
      date: "2025-03-12",
      status: "Closed",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "New assessment results for Class 10A available",
      time: "15 minutes ago",
    },
    { id: 2, message: "Siti Nuraini sent you a message", time: "2 hours ago" },
    {
      id: 3,
      message: "Attendance report for March is ready for review",
      time: "1 day ago",
    },
  ];

  const quickAccessItems = [
    {
      title: "User Management",
      description: "Manage all user accounts",
      icon: UserCog,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
      link: "/dashboard/user-management",
      roles: ["admin"],
    },
    {
      title: "Student Management",
      description: "Manage all student accounts",
      icon: UserCog,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
      link: "/dashboard/guru/daftar-siswa",
      roles: ["guru_bk", "admin"],
    },
    {
      title: "Student Directory",
      description: "View student records",
      icon: Users,
      iconBgColor: "bg-primary-100",
      iconTextColor: "text-primary-600",
      link: "/students",
      roles: ["admin", "guru_bk"],
    },
    {
      title: "Attendance Report",
      description: "View and monitor attendance",
      icon: ListChecks,
      iconBgColor: "bg-success-100",
      iconTextColor: "text-success-600",
      link: "/dashboard/attendance-report",
      roles: ["guru_bk"],
    },
    {
      title: "New Case",
      description: "Create a new student case",
      icon: FileClock,
      iconBgColor: "bg-accent-100",
      iconTextColor: "text-accent-600",
      link: "/cases/new",
      roles: ["admin", "guru_bk"],
    },
    {
      title: "Messages",
      description: "Chat with students and staff",
      icon: MessageSquare,
      iconBgColor: "bg-secondary-100",
      iconTextColor: "text-secondary-600",
      link: "/messages",
      roles: ["admin", "guru_bk"],
    },
  ];

  const visibleQuickAccessItems = quickAccessItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  // Objek untuk mapping peran ke style Tailwind CSS
  const roleStyles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    guru_bk: "bg-blue-100 text-blue-700",
    siswa: "bg-green-100 text-green-700", // Sebagai contoh jika siswa bisa akses
    default: "bg-gray-100 text-gray-700",
  };

  // Fungsi untuk memformat nama peran agar lebih rapi
  const formatRoleName = (role: string) => {
    if (!role) return "";
    return role
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      <div className='md:flex md:items-center md:justify-between mb-6'>
        <div className='flex-1 min-w-0'>
          <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate'>
            Dashboard
          </h1>
          {/* --- PERUBAHAN DI SINI --- */}
          <div className='mt-1 text-sm text-gray-500 flex items-center'>
            <span>Welcome back, {user?.name}!</span>
            {user?.role && (
              <span
                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  roleStyles[user.role] || roleStyles.default
                }`}
              >
                {formatRoleName(user.role)}
              </span>
            )}
          </div>
          {/* --- AKHIR PERUBAHAN --- */}
        </div>
        <div className='mt-4 flex md:mt-0 md:ml-4'>
          <Button
            variant='outline'
            className='mr-2'
            leftIcon={<FileText className='h-4 w-4' />}
          >
            Reports
          </Button>
          <Button leftIcon={<Bell className='h-4 w-4' />}>Notifications</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        <Card className='bg-white shadow-sm hover:shadow-md transition-shadow'>
          <CardContent className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 rounded-md bg-primary-100 p-3'>
                <Users className='h-6 w-6 text-primary-600' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Total Students
                  </dt>
                  <dd>
                    {isLoadingStats ? (
                      <div className='h-7 w-12 bg-gray-200 rounded animate-pulse'></div>
                    ) : (
                      <div className='text-lg font-bold text-gray-900'>
                        {dashboardStats.totalStudents}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-white shadow-sm hover:shadow-md transition-shadow'>
          <CardContent className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 rounded-md bg-success-100 p-3'>
                <Clock className='h-6 w-6 text-success-600' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Today's Attendance
                  </dt>
                  <dd>
                    <div className='text-lg font-bold text-gray-900'>
                      {dashboardStats.attendanceToday}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-white shadow-sm hover:shadow-md transition-shadow'>
          <CardContent className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 rounded-md bg-accent-100 p-3'>
                <FileClock className='h-6 w-6 text-accent-600' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Active Cases
                  </dt>
                  <dd>
                    <div className='text-lg font-bold text-gray-900'>
                      {dashboardStats.activeCases}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-white shadow-sm hover:shadow-md transition-shadow'>
          <CardContent className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 rounded-md bg-secondary-100 p-3'>
                <MessageSquare className='h-6 w-6 text-secondary-600' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Unread Messages
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
        <Card className='bg-white shadow-sm hover:shadow-md transition-shadow'>
          <CardContent className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 rounded-md bg-warning-100 p-3'>
                <BarChart3 className='h-6 w-6 text-warning-600' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Pending Assessments
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
        <div className='mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader className='pb-0'>
              <div className='flex justify-between items-center'>
                <CardTitle>Recent Cases</CardTitle>
                <Link
                  to='/cases'
                  className='text-sm font-medium text-primary-600 hover:text-primary-500'
                >
                  View all
                </Link>
              </div>
              <CardDescription>
                Latest student cases requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Student
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Issue
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Date
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Status
                      </th>
                      <th scope='col' className='relative px-6 py-3'>
                        <span className='sr-only'>View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {recentCases.map((caseItem) => (
                      <tr key={caseItem.id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='font-medium text-gray-900'>
                            {caseItem.student}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>
                            {caseItem.issue}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>
                            {caseItem.date}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              caseItem.status === "Open"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {caseItem.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <Link
                            to={`/cases/${caseItem.id}`}
                            className='text-primary-600 hover:text-primary-900'
                          >
                            <ChevronRight className='h-5 w-5' />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-0'>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Recent updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flow-root'>
                <ul className='-my-5 divide-y divide-gray-200'>
                  {notifications.map((notification) => (
                    <li key={notification.id} className='py-4'>
                      <div className='flex items-start space-x-3'>
                        <div className='flex-shrink-0 pt-0.5'>
                          <Bell className='h-5 w-5 text-primary-500' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm text-gray-900'>
                            {notification.message}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-6'>
                <Button variant='outline' className='w-full justify-center'>
                  View all notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className='mt-6'>
        <h2 className='text-lg font-medium text-gray-900'>Quick Access</h2>
        <div className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {visibleQuickAccessItems.map((item) => (
            <Link to={item.link} key={item.title}>
              <Card className='hover:shadow-md transition-shadow cursor-pointer h-full'>
                <CardContent className='p-5 flex flex-col items-center text-center'>
                  <div className={`rounded-md ${item.iconBgColor} p-4 mb-3`}>
                    <item.icon className={`h-8 w-8 ${item.iconTextColor}`} />
                  </div>
                  <h3 className='text-md font-semibold text-gray-900'>
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
  );
};

export default DashboardPage;
