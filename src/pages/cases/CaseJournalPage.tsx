import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Loader, Edit, Trash2, PlusCircle, Search } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb, { BreadcrumbItem } from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Card, CardContent } from "../../components/ui/Card";
import CaseJournalForm from "../../components/cases/CaseJournalForm";
import * as caseService from "../../services/studentCaseService";
import type {
  StudentCaseRecord,
  StudentCaseFormData,
  StudentCaseUpdateData,
} from "../../services/studentCaseService";
import * as userService from "../../services/userService";
import type { User } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";

const CaseJournalPage: React.FC = () => {
  const { user } = useAuthStore();
  const [cases, setCases] = useState<StudentCaseRecord[]>([]);
  const [studentList, setStudentList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<StudentCaseRecord | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacherOrAdmin = useMemo(
    () => user?.role === "guru_bk" || user?.role === "admin",
    [user]
  );

  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const caseData = await caseService.getCases(); // Menggunakan satu fungsi getCases
      setCases(caseData);

      if (isTeacherOrAdmin) {
        const allUsers = await userService.getUsers();
        // Beri tipe eksplisit pada parameter 'u'
        setStudentList(allUsers.filter((u: User) => u.role === "siswa"));
      }
    } catch (error: any) {
      toast.error(`Gagal memuat data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, isTeacherOrAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredCases = useMemo(() => {
    if (!searchTerm) return cases;
    return cases.filter(
      (c) =>
        (c.studentName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (c.topic || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.guruBkName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cases, searchTerm]);

  const handleOpenModal = (caseRecord: StudentCaseRecord | null = null) => {
    setEditingCase(caseRecord);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
  };

  const handleFormSubmit = async (
    data: StudentCaseFormData | StudentCaseUpdateData
  ) => {
    setIsSubmitting(true);
    try {
      if (editingCase) {
        const updateData: StudentCaseUpdateData = {
          topic: data.topic,
          follow_up: data.follow_up,
          case_date: data.case_date,
          notes: data.notes,
        };
        await caseService.updateCase(editingCase.id, updateData);
        toast.success("Jurnal kasus berhasil diperbarui.");
      } else {
        // Hapus argumen kedua, backend akan mengambil info guru dari token
        await caseService.createCase(data as StudentCaseFormData);
        toast.success("Jurnal kasus berhasil dibuat.");
      }
      handleCloseModal();
      await loadData();
    } catch (error: any) {
      toast.error(`Gagal: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (caseId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jurnal kasus ini?")) {
      try {
        await caseService.deleteCase(caseId);
        toast.success("Jurnal kasus berhasil dihapus.");
        await loadData();
      } catch (error: any) {
        toast.error(`Gagal menghapus: ${error.message}`);
      }
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: user?.role === "siswa" ? "Home" : "Dashboard",
      to: user?.role === "siswa" ? "/" : "/dashboard",
    },
    { label: "Jurnal Kasus Siswa" },
  ];

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "-";
    return new Date(
      dateString.includes("T") ? dateString : `${dateString}T00:00:00`
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <Breadcrumb items={breadcrumbItems} />
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Jurnal Kasus Siswa</h1>
        {isTeacherOrAdmin && (
          <Button
            onClick={() => handleOpenModal(null)}
            leftIcon={<PlusCircle className='h-5 w-5' />}
          >
            Tambah Kasus Baru
          </Button>
        )}
      </div>

      {isTeacherOrAdmin && (
        <div className='mb-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              placeholder='Cari nama siswa, topik, atau guru...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <Card className='shadow-sm'>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            {isLoading ? (
              <div className='p-10 flex justify-center'>
                <Loader className='h-8 w-8 animate-spin' />
              </div>
            ) : filteredCases.length === 0 ? (
              <p className='text-center text-gray-500 p-8'>
                Tidak ada data jurnal kasus.
              </p>
            ) : (
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    {isTeacherOrAdmin && (
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Nama Siswa
                      </th>
                    )}
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Topik/Masalah
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Tindak Lanjut
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Tanggal
                    </th>
                    {isTeacherOrAdmin && (
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Guru BK Pencatat
                      </th>
                    )}
                    {isTeacherOrAdmin && (
                      <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredCases.map((item) => (
                    <tr key={item.id}>
                      {isTeacherOrAdmin && (
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {item.studentName}
                        </td>
                      )}
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                        {item.topic}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.followUp}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(item.caseDate)}
                      </td>
                      {isTeacherOrAdmin && (
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {item.guruBkName}
                        </td>
                      )}
                      {isTeacherOrAdmin && (
                        <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2'>
                          <Button
                            variant='icon'
                            size='sm'
                            onClick={() => handleOpenModal(item)}
                            className='text-blue-600 hover:text-blue-800'
                            title='Edit'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='icon'
                            size='sm'
                            onClick={() => handleDelete(item.id)}
                            className='text-red-600 hover:text-red-800'
                            title='Hapus'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCase ? "Edit Jurnal Kasus" : "Tambah Jurnal Kasus Baru"}
      >
        <CaseJournalForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          initialData={
            editingCase
              ? {
                  student_user_id: editingCase.studentId,
                  topic: editingCase.topic,
                  follow_up: editingCase.followUp,
                  case_date: editingCase.caseDate,
                  notes: editingCase.notes,
                }
              : { case_date: new Date().toISOString().split("T")[0] }
          }
          isLoading={isSubmitting}
          isEditMode={!!editingCase}
          studentList={studentList}
        />
      </Modal>
    </div>
  );
};

export default CaseJournalPage;
