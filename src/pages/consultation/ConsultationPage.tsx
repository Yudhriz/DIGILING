import React, { useState, useEffect, useCallback } from "react";
import { Loader, MessageCircle, User } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent, CardFooter } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import * as consultationService from "../../services/consultationService";
import type { GuruBkInfo } from "../../services/consultationService";
import { useAuthStore } from "../../store/authStore";

const ConsultationPage: React.FC = () => {
  const { user } = useAuthStore(); // Untuk mendapatkan nama siswa
  const [guruList, setGuruList] = useState<GuruBkInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGuruList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await consultationService.getGuruBkList();
      setGuruList(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Gagal memuat daftar guru: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuruList();
  }, [loadGuruList]);

  const handleChatWhatsApp = (phoneNumber: string, guruName: string) => {
    // 1. Format nomor telepon: ganti '0' di depan dengan '62' (kode negara Indonesia)
    let formattedNumber = phoneNumber.trim().replace(/[- .()]/g, ""); // Hapus spasi, strip, dll.
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "62" + formattedNumber.substring(1);
    }

    // 2. Buat pesan default
    const studentName = user?.name || "Siswa";
    const message = `Halo, selamat pagi/siang/sore, Bapak/Ibu ${guruName}. Saya ${studentName}, ingin menjadwalkan sesi konsultasi. Terima kasih.`;
    const encodedMessage = encodeURIComponent(message);

    // 3. Buat URL WhatsApp dan buka di tab baru
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='p-10 flex justify-center'>
          <Loader className='h-8 w-8 animate-spin' />
        </div>
      );
    }
    if (error) {
      return (
        <div className='p-4 bg-red-50 text-red-700 rounded-md'>
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      );
    }
    if (guruList.length === 0) {
      return (
        <p className='text-center text-gray-500 p-8'>
          Saat ini belum ada Guru BK yang tersedia.
        </p>
      );
    }
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {guruList.map((guru) => (
          <Card
            key={guru.id}
            className='text-center shadow-md hover:shadow-lg transition-shadow'
          >
            <CardContent className='p-6 flex flex-col items-center'>
              <div className='w-24 h-24 rounded-full mb-4 bg-gray-100 flex items-center justify-center overflow-hidden'>
                {guru.avatarUrl ? (
                  <img
                    src={guru.avatarUrl}
                    alt={guru.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <User className='w-12 h-12 text-gray-400' />
                )}
              </div>
              <h3 className='text-lg font-bold text-gray-900'>{guru.name}</h3>
              <p className='text-sm text-gray-500'>
                Guru Bimbingan & Konseling
              </p>
            </CardContent>
            <CardFooter className='p-4 bg-gray-50'>
              <Button
                className='w-full'
                onClick={() =>
                  handleChatWhatsApp(guru.nomor_telp_hp, guru.name)
                }
                disabled={!guru.nomor_telp_hp} // Nonaktifkan jika tidak ada nomor HP
                leftIcon={<MessageCircle className='h-4 w-4' />}
              >
                Chat via WhatsApp
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Mulai Konsultasi</h1>
        <p className='mt-2 max-w-2xl mx-auto text-gray-600'>
          Pilih Guru BK yang tersedia di bawah ini untuk memulai sesi konsultasi
          melalui WhatsApp.
        </p>
      </div>
      {renderContent()}
    </div>
  );
};

export default ConsultationPage;
