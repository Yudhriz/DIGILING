import React, { useState, useEffect, useCallback } from "react";
import { Loader, Trash2, User, UserX } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb, { BreadcrumbItem } from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import AspirationForm from "../../components/aspirations/AspirationForm";
import * as aspirationService from "../../services/aspirationService";
import type {
  AspirationRecord,
  AspirationFormData,
} from "../../services/aspirationService";
import { useAuthStore } from "../../store/authStore";

const AspirationPage: React.FC = () => {
  const { user } = useAuthStore();
  const [aspirations, setAspirations] = useState<AspirationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacherOrAdmin = user?.role === "guru_bk" || user?.role === "admin";

  // Fungsi ini sekarang hanya relevan untuk Guru BK/Admin
  const loadAspirations = useCallback(async () => {
    if (!isTeacherOrAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await aspirationService.getAspirations();
      setAspirations(data);
    } catch (error: any) {
      toast.error(`Gagal memuat aspirasi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isTeacherOrAdmin]);

  useEffect(() => {
    loadAspirations();
  }, [loadAspirations]);

  // Handler untuk siswa mengirim aspirasi
  const handleFormSubmit = async (data: AspirationFormData) => {
    setIsSubmitting(true);
    try {
      await aspirationService.submitAspiration(data);
      toast.success(
        "Aspirasi Anda berhasil dikirim! Terima kasih atas masukannya."
      );
      // Tidak perlu loadAspirations lagi di sini untuk siswa
    } catch (error: any) {
      toast.error(`Gagal mengirim: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler untuk Guru BK/Admin menghapus aspirasi
  const handleDelete = async (aspirationId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus aspirasi ini?")) {
      try {
        await aspirationService.deleteAspiration(aspirationId);
        toast.success("Aspirasi berhasil dihapus.");
        setAspirations((prev) => prev.filter((a) => a.id !== aspirationId));
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
    { label: "Wadah Aspirasi" },
  ];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

  // Tampilan untuk Guru BK dan Admin
  const renderTeacherView = () => (
    <div className='space-y-4'>
      {isLoading ? (
        <div className='p-10 flex justify-center'>
          <Loader className='h-8 w-8 animate-spin' />
        </div>
      ) : aspirations.length === 0 ? (
        <p className='text-center text-gray-500 p-8'>
          Belum ada aspirasi yang masuk.
        </p>
      ) : (
        aspirations.map((item) => (
          <Card key={item.id} className='shadow-sm'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    {item.name === "Siswa Anonim" ? (
                      <UserX className='h-5 w-5 text-gray-500' />
                    ) : (
                      <User className='h-5 w-5 text-primary-600' />
                    )}
                    {item.name}
                  </CardTitle>
                  <CardDescription>
                    {item.name !== "Siswa Anonim" &&
                      `Username: ${item.username} | `}
                    Dikirim pada: {formatDate(item.createdAt)}
                  </CardDescription>
                </div>
                <Button
                  variant='icon'
                  size='sm'
                  onClick={() => handleDelete(item.id)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700'>{item.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  // --- REVISI TAMPILAN SISWA ---
  // Tampilan untuk Siswa sekarang hanya form
  const renderStudentView = () => (
    <div>
      <p className='mb-6 text-gray-600'>
        Sampaikan aspirasi, kritik, atau saran Anda untuk kemajuan sekolah.
        Identitas Anda akan dijaga kerahasiaannya jika Anda memilih opsi anonim.
      </p>
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle>Kirim Aspirasi Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <AspirationForm
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Wadah Aspirasi</h1>

      {/* Tampilkan view yang sesuai berdasarkan peran */}
      {isTeacherOrAdmin ? renderTeacherView() : renderStudentView()}
    </div>
  );
};

export default AspirationPage;
