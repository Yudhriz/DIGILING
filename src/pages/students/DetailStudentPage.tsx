import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, ArrowLeft, Edit, Save, Download } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Breadcrumb from "../../components/ui/Breadcrumb";
import type { BreadcrumbItem } from "../../components/ui/Breadcrumb";
import DetailStudentForm from "../../components/students/DetailStudentForm"; // Form yang baru kita buat
import * as studentService from "../../services/studentService";
import type {
  StudentProfile,
  StudentProfileFormData,
} from "../../services/studentService";
import { useAuthStore } from "../../store/authStore"; // Untuk cek peran jika perlu

const DetailStudentPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuthStore();

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // State untuk mode edit/view

  // Tentukan apakah pengguna saat ini adalah siswa yang melihat profilnya sendiri
  const isOwnProfile = useMemo(() => {
    return !userId && loggedInUser?.role === "siswa";
  }, [userId, loggedInUser]);

  const canEdit =
    isOwnProfile ||
    loggedInUser?.role === "admin" ||
    loggedInUser?.role === "guru_bk";

  const loadStudentProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let profileData;

      // 1. Cek jika ada userId dari URL (untuk Admin/Guru BK yang melihat profil siswa lain)
      if (userId) {
        profileData = await studentService.getSiswaById(userId);
      }
      // 2. Jika tidak ada userId, cek apakah yang login adalah siswa (untuk melihat profilnya sendiri)
      else if (loggedInUser?.role === "siswa") {
        profileData = await studentService.getMyStudentProfile();
      }
      // 3. Jika tidak keduanya, berarti tidak ada data yang bisa diambil
      else {
        throw new Error(
          "Halaman ini tidak bisa diakses tanpa ID pengguna untuk peran Anda."
        );
      }

      setStudentProfile(profileData);
    } catch (err) {
      console.error("Gagal memuat profil siswa:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Pastikan useEffect Anda memanggil fungsi ini dan memiliki dependency yang benar
  useEffect(() => {
    // Hanya panggil jika ada info user yang login
    if (loggedInUser) {
      loadStudentProfile();
    }
  }, [userId, loggedInUser]);

  const handleDownloadCSV = () => {
    if (!studentProfile) {
      toast.error("Data siswa tidak tersedia untuk diunduh.");
      return;
    }

    // Fungsi flattenObject yang direvisi untuk menangani array of objects
    const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
      return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + "_" : "";
        const keyName = pre + k;

        if (obj[k] === null || obj[k] === undefined) {
          acc[keyName] = ""; // Handle null atau undefined sebagai string kosong
        } else if (Array.isArray(obj[k])) {
          // Cek apakah array berisi objek
          if (
            obj[k].length > 0 &&
            typeof obj[k][0] === "object" &&
            obj[k][0] !== null
          ) {
            obj[k].forEach((item: any, index: number) => {
              if (typeof item === "object" && item !== null) {
                // Pastikan item adalah objek
                Object.assign(acc, flattenObject(item, `${keyName}_${index}`));
              } else {
                // Jika item dalam array bukan objek (jarang terjadi untuk data seperti saudara_kandung)
                acc[`${keyName}_${index}`] = String(
                  item === null || item === undefined ? "" : item
                );
              }
            });
          } else {
            // Array berisi nilai primitif (string, angka)
            acc[keyName] = obj[k].join("; ");
          }
        } else if (typeof obj[k] === "object" && obj[k] !== null) {
          // Objek nested
          Object.assign(acc, flattenObject(obj[k], keyName));
        } else {
          // Nilai primitif
          acc[keyName] = obj[k];
        }
        return acc;
      }, {} as Record<string, any>);
    };

    const dataToExport = flattenObject(studentProfile);

    // Membuat header dari keys dataToExport
    // Urutan header akan sesuai dengan urutan keys yang dikembalikan Object.keys,
    // yang mungkin tidak selalu ideal tapi fungsional.
    const headersArray = Object.keys(dataToExport);
    const headers = headersArray.join(",");

    // Membuat baris data CSV
    const csvRow = headersArray
      .map((headerKey) => {
        const value = dataToExport[headerKey];
        const strValue = String(
          value === null || value === undefined ? "" : value
        );
        // Escape koma, kutip ganda, dan baris baru di dalam value
        if (
          strValue.includes(",") ||
          strValue.includes('"') ||
          strValue.includes("\n")
        ) {
          return `"${strValue.replace(/"/g, '""')}"`; // Ganti kutip ganda dengan dua kutip ganda
        }
        return strValue;
      })
      .join(",");

    const csvContent = `${headers}\n${csvRow}`;

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    }); // Tambahkan BOM untuk Excel
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    // Nama file lebih dinamis
    const fileName = `detail_siswa_${(
      studentProfile.name ||
      studentProfile.id ||
      "data"
    ).replace(/\s+/g, "_")}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadStudentProfile();
  }, [userId, isOwnProfile]); // Jalankan ulang jika userId atau isOwnProfile berubah

  const handleFormSubmit = async (formData: StudentProfileFormData) => {
    if (!userId && !isOwnProfile) {
      // Jika bukan profil sendiri, butuh userId
      toast.error("ID Siswa tidak valid untuk update.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Siswa mengupdate profilnya sendiri, Admin/GuruBK mengupdate by ID
      const targetUserId = isOwnProfile ? loggedInUser!.id : userId!; // Pastikan ID ada

      await (isOwnProfile
        ? studentService.updateMyStudentProfile(formData)
        : studentService.updateSiswaById(targetUserId, formData));

      toast.success("Profil siswa berhasil diperbarui!");
      setIsEditMode(false); // Kembali ke mode view setelah simpan
      loadStudentProfile(); // Muat ulang data
    } catch (err) {
      console.error("Gagal memperbarui profil siswa:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menyimpan data.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    // 1. Tentukan link "rumah" berdasarkan peran
    if (loggedInUser?.role === "admin" || loggedInUser?.role === "guru_bk") {
      items.push({ label: "Dashboard", to: "/dashboard" });
    } else if (loggedInUser?.role === "siswa") {
      // Siswa mungkin tidak punya dashboard, 'rumah' mereka adalah '/'
      items.push({ label: "Home", to: "/" });
    }

    // 2. Tentukan link tengah jika bukan melihat profil sendiri
    if (!isOwnProfile) {
      if (loggedInUser?.role === "admin") {
        items.push({ label: "User Management", to: "/user-management" });
      } else if (loggedInUser?.role === "guru_bk") {
        items.push({ label: "Daftar Siswa", to: "/guru/daftar-siswa" });
      }
    }

    // 3. Tambahkan label halaman saat ini
    const currentPageLabel = isOwnProfile
      ? "Profil Saya"
      : studentProfile?.name || `Profil Siswa`;

    items.push({ label: currentPageLabel });

    return items;
  }, [loggedInUser, isOwnProfile, studentProfile, userId]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-200px)]'>
        <Loader className='h-12 w-12 animate-spin text-primary-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8 text-center'>
        <p className='text-red-500 mb-4'>{error}</p>
        <Button onClick={() => navigate(-1)} variant='outline'>
          Kembali
        </Button>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8 text-center'>
        <p className='text-gray-500'>Profil siswa tidak ditemukan.</p>
        <Button
          onClick={() =>
            navigate(
              loggedInUser?.role === "siswa" ? "/" : "/guru/daftar-siswa"
            )
          }
          variant='outline'
          className='mt-4'
        >
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <Breadcrumb items={breadcrumbItems} />
      <div className='flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2'>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {isOwnProfile
              ? "Profil Saya"
              : `Profil Siswa: ${studentProfile.name}`}
          </h1>
          {isOwnProfile && studentProfile.username && (
            <p className='text-sm text-gray-600'>
              Username: {studentProfile.username}
            </p>
          )}
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={handleDownloadCSV}
            variant='outline'
            leftIcon={<Download className='h-4 w-4' />}
            disabled={!studentProfile || isLoading} // Nonaktifkan jika data belum ada atau sedang loading
          >
            Download CSV
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant='outline'
            leftIcon={<ArrowLeft className='h-4 w-4' />}
          >
            Kembali
          </Button>
          {canEdit && !isEditMode && (
            <Button
              onClick={() => setIsEditMode(true)}
              leftIcon={<Edit className='h-4 w-4' />}
            >
              Edit Profil
            </Button>
          )}
          {canEdit && isEditMode && (
            <Button
              onClick={() =>
                document
                  .querySelector<HTMLFormElement>("#detailStudentForm form")
                  ?.requestSubmit()
              }
              isLoading={isSubmitting}
              leftIcon={<Save className='h-4 w-4' />}
            >
              Simpan Perubahan
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className='text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4'>
          Error: {error}
        </p>
      )}

      <div id='detailStudentForm'>
        {" "}
        {/* Wrapper untuk mempermudah submit dari tombol luar */}
        <DetailStudentForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsEditMode(false);
            loadStudentProfile(); // Muat ulang data awal jika batal edit
          }}
          initialData={studentProfile}
          isLoading={isSubmitting}
          isEditMode={isEditMode && canEdit} // Form hanya bisa diedit jika isEditMode true dan user punya hak
        />
      </div>
    </div>
  );
};

export default DetailStudentPage;
