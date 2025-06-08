import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Edit3,
  Trash2,
  Loader,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import UserManagementForm from "../../components/admin/UserManagementForm";
import Breadcrumb from "../../components/ui/Breadcrumb";
import type { BreadcrumbItem } from "../../components/ui/Breadcrumb";
import Modal from "../../components/ui/Modal";
import * as userService from "../../services/userService";
import type {
  User,
  UserCreationData,
  UserUpdateData,
} from "../../services/userService";

const UserManagementPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [isDetailConfirmationModalOpen, setIsDetailConfirmationModalOpen] =
    useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null); // Menggunakan viewingUser secara konsisten
  const [isNavigatingToDetail, setIsNavigatingToDetail] = useState(false);

  const navigate = useNavigate();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "User Management" },
  ];

  const loadUsers = async () => {
    setIsLoadingTable(true);
    try {
      const fetchedUsers = await userService.getUsers();
      setAllUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(
        `Gagal memuat daftar pengguna: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers;
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsersOnPage = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleAddNewUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleViewDetail = (userToView: User) => {
    setViewingUser(userToView);
    setIsNavigatingToDetail(false);
    setIsDetailConfirmationModalOpen(true);
  };

  const handleConfirmNavigateToDetail = async () => {
    if (!viewingUser) return;

    setIsNavigatingToDetail(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    navigate(`/dashboard/user-management/detail/${viewingUser.id}`);

    setIsNavigatingToDetail(false);
    setIsDetailConfirmationModalOpen(false);
    setViewingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setIsSubmittingForm(true);
      try {
        await userService.deleteUser(userId);
        loadUsers();
        toast.success(`Pengguna berhasil dihapus.`);
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error(
          `Gagal menghapus pengguna: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setIsSubmittingForm(false);
      }
    }
  };

  const handleFormSubmit = async (data: UserCreationData | UserUpdateData) => {
    setIsSubmittingForm(true);
    try {
      if (editingUser) {
        const updatedUser = await userService.updateUser(
          editingUser.id,
          data as UserUpdateData
        );
        loadUsers();
        toast.success(`Pengguna ${updatedUser.name} berhasil diperbarui.`);
      } else {
        const newUser = await userService.createUser(data as UserCreationData);
        loadUsers();
        toast.success(`Pengguna ${newUser.name} berhasil ditambahkan.`);
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error(
        `Gagal memproses data pengguna: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleDownloadCSV = () => {
    if (filteredUsers.length === 0) {
      toast.error("Tidak ada data untuk diunduh.");
      return;
    }
    const headers = "ID,Nama,Username,Email,Peran\n";
    const csvContent = filteredUsers
      .map(
        (user) =>
          `${user.id},"${user.name}","${user.username}","${user.email}","${user.role}"`
      )
      .join("\n");

    const fullCsv = headers + csvContent;
    const blob = new Blob([fullCsv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "daftar_pengguna.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const roleStyles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    guru_bk: "bg-blue-100 text-blue-700",
    siswa: "bg-green-100 text-green-700",
    default: "bg-gray-100 text-gray-700",
  };
  const formatRoleName = (role: string) => {
    if (!role) return "";
    return role
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <Breadcrumb items={breadcrumbItems} />
      <div className='flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4'>
        <h1 className='text-2xl font-bold text-gray-900'>User Management</h1>
        <div className='flex items-center gap-2'>
          <Button
            onClick={handleDownloadCSV}
            variant='outline'
            leftIcon={<Download className='h-4 w-4' />}
          >
            {" "}
            Download CSV{" "}
          </Button>
          <Button
            onClick={handleAddNewUser}
            leftIcon={<PlusCircle className='h-5 w-5' />}
          >
            {" "}
            Add New User{" "}
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className='mb-8'>
          <UserManagementForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            initialData={
              editingUser
                ? {
                    name: editingUser.name,
                    username: editingUser.username,
                    email: editingUser.email,
                    role: editingUser.role,
                  }
                : undefined
            }
            isLoading={isSubmittingForm}
          />
        </div>
      )}

      <div className='mb-4'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Cari pengguna (nama, username, email, role)...'
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
            ) : currentUsersOnPage.length === 0 ? (
              <div className='p-10 text-center text-gray-500'>
                {searchTerm
                  ? "Tidak ada pengguna yang cocok dengan pencarian Anda."
                  : "Tidak ada data pengguna."}
              </div>
            ) : (
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Username
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Role
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {currentUsersOnPage.map((user) => (
                    <tr key={user.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {user.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {user.username}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {user.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <span
                          className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            roleStyles[user.role] || roleStyles.default
                          }`}
                        >
                          {formatRoleName(user.role)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1'>
                        <Button
                          variant='icon'
                          size='sm'
                          onClick={() => handleViewDetail(user)}
                          className='text-gray-500 hover:text-gray-700'
                          disabled={isSubmittingForm}
                          title='View Details'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='icon'
                          size='sm'
                          onClick={() => handleEditUser(user)}
                          className='text-blue-600 hover:text-blue-800'
                          disabled={isSubmittingForm}
                          title='Edit User'
                        >
                          <Edit3 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='icon'
                          size='sm'
                          onClick={() => handleDeleteUser(user.id)}
                          className='text-red-600 hover:text-red-800'
                          disabled={isSubmittingForm}
                          title='Delete User'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {totalPages > 0 &&
        !isLoadingTable && ( // Selalu tampilkan jika ada halaman, bahkan jika currentUsersOnPage kosong karena filter
          <div className='mt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <span className='text-sm text-gray-700'>
              Halaman {currentUsersOnPage.length > 0 ? currentPage : 0} dari{" "}
              {totalPages} (Total {filteredUsers.length} user)
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

      {/* Modal untuk Form Tambah/Edit Pengguna */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={handleFormCancel}
          title={editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        >
          <UserManagementForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            initialData={
              editingUser
                ? {
                    name: editingUser.name,
                    username: editingUser.username,
                    email: editingUser.email,
                    role: editingUser.role,
                  }
                : undefined
            }
            isLoading={isSubmittingForm}
          />
        </Modal>
      )}

      {/* Modal untuk Konfirmasi Lihat Detail Pengguna */}
      <Modal
        isOpen={isDetailConfirmationModalOpen}
        onClose={() => {
          setIsDetailConfirmationModalOpen(false);
          setViewingUser(null);
        }}
        title='Konfirmasi Detail Pengguna'
      >
        {viewingUser ? (
          <div className='space-y-4'>
            {isNavigatingToDetail ? (
              <div className='flex flex-col items-center justify-center p-4'>
                <Loader className='animate-spin h-8 w-8 text-primary-600' />
                <p className='mt-2 text-sm text-gray-500'>Mengarahkan...</p>
              </div>
            ) : (
              <>
                <p className='text-sm text-gray-700 mb-3'>
                  Anda akan diarahkan ke halaman detail untuk pengguna:
                </p>
                <div className='bg-gray-50 p-3 rounded-md border border-gray-200 space-y-1'>
                  <p className='text-sm'>
                    <span className='font-semibold text-gray-800'>Nama:</span>{" "}
                    {viewingUser.name}
                  </p>
                  <p className='text-sm'>
                    <span className='font-semibold text-gray-800'>
                      Username:
                    </span>{" "}
                    {viewingUser.username}
                  </p>
                  <p className='text-sm'>
                    <span className='font-semibold text-gray-800'>ID:</span>{" "}
                    {viewingUser.id}
                  </p>
                </div>
                <p className='text-sm text-gray-700 mt-4'>Lanjutkan?</p>
              </>
            )}
            <div className='pt-4 flex justify-end space-x-3'>
              <Button
                variant='ghost'
                onClick={() => {
                  setIsDetailConfirmationModalOpen(false);
                  setViewingUser(null);
                }}
                disabled={isNavigatingToDetail}
              >
                Batal
              </Button>
              <Button
                onClick={handleConfirmNavigateToDetail}
                disabled={isNavigatingToDetail}
                isLoading={isNavigatingToDetail}
              >
                Lanjutkan
              </Button>
            </div>
          </div>
        ) : (
          <p>Data pengguna tidak ditemukan.</p>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;
