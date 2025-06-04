import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Search,
  Loader,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import Breadcrumb from "../../components/ui/Breadcrumb";
import type { BreadcrumbItem } from "../../components/ui/Breadcrumb";
import * as userService from "../../services/userService";
import type { User } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";

const GuruBKStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuthStore();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5; // Anda bisa sesuaikan atau buat ini bisa dikonfigurasi

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Daftar Siswa" },
  ];

  const loadUsersAndFilterStudents = async () => {
    setIsLoadingTable(true);
    try {
      const fetchedUsers = await userService.getUsers();
      setAllUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert(
        `Gagal memuat daftar pengguna: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.role === "guru_bk" || loggedInUser?.role === "admin") {
      loadUsersAndFilterStudents();
    } else {
      setIsLoadingTable(false);
      console.warn("Akses tidak diizinkan untuk peran ini.");
    }
  }, [loggedInUser]); // Tambahkan loggedInUser sebagai dependency

  const filteredStudents = useMemo(() => {
    const studentsOnly = allUsers.filter((u) => u.role === "siswa");
    if (!searchTerm) return studentsOnly;

    return studentsOnly.filter(
      (student) =>
        (student.name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (student.username?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (student.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudentsOnPage = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewDetail = (studentId: string) => {
    navigate(`/dashboard/guru/daftar-siswa/detail/${studentId}`);
  };

  const handleDownloadCSV = () => {
    if (filteredStudents.length === 0) {
      alert("Tidak ada data siswa untuk diunduh.");
      return;
    }
    const headers = "ID,Nama,Username,Email\n";
    const csvContent = filteredStudents
      .map(
        (student) =>
          `${student.id},"${student.name || ""}","${student.username || ""}","${
            student.email || ""
          }"`
      )
      .join("\n");

    const fullCsv = headers + csvContent;
    const blob = new Blob([fullCsv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "daftar_siswa.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!(loggedInUser?.role === "guru_bk" || loggedInUser?.role === "admin")) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center'>
        <p className='text-red-500'>
          Anda tidak memiliki hak akses untuk melihat halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <Breadcrumb items={breadcrumbItems} />
      <div className='flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4'>
        <h1 className='text-2xl font-bold text-gray-900'>Daftar Siswa</h1>
        <Button
          onClick={handleDownloadCSV}
          variant='outline'
          leftIcon={<Download className='h-4 w-4' />}
        >
          Download Data Siswa (CSV)
        </Button>
      </div>

      <div className='mb-4'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Cari siswa (nama, username, email)...'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <Card className='shadow-sm'>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            {isLoadingTable ? (
              <div className='p-10 flex justify-center items-center min-h-[200px]'>
                <Loader className='h-8 w-8 animate-spin text-gray-500' />
              </div>
            ) : currentStudentsOnPage.length === 0 ? (
              <div className='p-10 text-center text-gray-500'>
                {searchTerm
                  ? "Tidak ada siswa yang cocok dengan pencarian Anda."
                  : "Tidak ada data siswa terdaftar."}
              </div>
            ) : (
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Nama
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Username
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {currentStudentsOnPage.map((student) => (
                    <tr key={student.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {student.name || "-"}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {student.username || "-"}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {student.email || "-"}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1'>
                        <Button
                          variant='icon'
                          size='sm'
                          onClick={() => handleViewDetail(student.id)}
                          className='text-primary-600 hover:text-primary-800'
                          title='Lihat Detail Profil Siswa'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        {/* Tombol Tambah Catatan dan logika modalnya dihapus */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {totalPages > 0 && !isLoadingTable && (
        <div className='mt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <span className='text-sm text-gray-700'>
            Halaman {currentStudentsOnPage.length > 0 ? currentPage : 0} dari{" "}
            {totalPages} (Total {filteredStudents.length} siswa)
          </span>
          <div className='flex items-center space-x-2'>
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant='outline'
              size='sm'
              leftIcon={<ChevronLeft className='h-4 w-4' />}
            >
              Previous
            </Button>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              variant='outline'
              size='sm'
              rightIcon={<ChevronRight className='h-4 w-4' />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuruBKStudentPage;
