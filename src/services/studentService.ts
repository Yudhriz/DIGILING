import { API_BASE_URL, withAuth } from "./api"; // Menggunakan withAuth

// --- Tipe Data Lengkap untuk Profil Siswa ---
// Sesuai dengan formatSiswaData dan validateSiswaData
export interface SaudaraKandung {
  nama?: string;
  tanggal_lahir?: string; // YYYY-MM-DD
  jenis_kelamin?: "Laki-laki" | "Perempuan" | "";
  status_hubungan?: "Kandung" | "Siri" | "";
  pekerjaan_sekolah?: string;
  tingkat?: string;
  status_perkawinan?: "Kawin" | "Belum" | "";
}

export interface RiwayatSakitKeras {
  jenis_penyakit?: string;
  usia_saat_sakit?: number | string | null;
  opname?: "Ya" | "Tidak" | "";
  opname_di_rs?: string;
}

export interface Prestasi {
  nama_kejuaraan?: string;
  tingkat?: string;
  raihan_prestasi?: string;
  tahun_kelas?: string;
}

export interface DataKeluargaItem {
  nama?: string;
  tanggal_lahir?: string; // YYYY-MM-DD
  agama?: string;
  pendidikan?: string;
  pekerjaan?: string;
  suku_bangsa?: string;
  alamat?: string;
}

export interface StudentProfile {
  id: string;
  name?: string;
  username?: string;
  // Tidak ada email & role di formatSiswaData, tapi mungkin ada di user dasar
  // Kita akan fokus pada field yang ada di formatSiswaData untuk profil ini

  // A. Identitas Pribadi (dari formatSiswaData)
  jenis_kelamin?: "Laki-laki" | "Perempuan" | "";
  tempat_lahir?: string;
  tanggal_lahir?: string; // YYYY-MM-DD
  agama?: string;
  suku_bangsa?: string;
  tanggal_masuk?: string; // YYYY-MM-DD
  asal_sekolah?: string;
  status_sebagai?: "Siswa Baru" | "Pindahan" | "";

  // B. Keterangan Tempat Tinggal
  alamat_asal?: string;
  nomor_telp_hp?: string;
  termasuk_daerah_asal?: string[];
  alamat_sekarang?: string;
  nomor_telp_hp_sekarang?: string;
  termasuk_daerah_sekarang?: string[];
  jarak_rumah_sekolah?: number | string | null;
  alat_sarana_ke_sekolah?: string[];
  alat_sarana_ke_sekolah_lainnya_text?: string;
  tempat_tinggal?: string;
  tempat_tinggal_lainnya_text?: string;
  tinggal_bersama?: string[];
  tinggal_bersama_wali_text?: string;
  tinggal_bersama_lainnya_text?: string;
  rumah_terbuat_dari?: string;
  rumah_terbuat_dari_lainnya_text?: string;
  alat_fasilitas_dimiliki?: string[];
  alat_fasilitas_dimiliki_surat_kabar_text?: string;

  // C. Data Keluarga
  data_keluarga?: {
    ayah?: DataKeluargaItem;
    ibu?: DataKeluargaItem;
    wali?: DataKeluargaItem;
  };
  anak_ke?: number | string | null;
  saudara_kandung?: SaudaraKandung[];

  // D. Keadaan Jasmani
  tinggi_badan?: number | string | null;
  berat_badan?: number | string | null; // Di backend 'doubleValue'
  golongan_darah?: "A" | "B" | "AB" | "O" | "";
  bentuk_mata?: string;
  bentuk_muka?: string;
  rambut?: "Lurus" | "Keriting" | "Bergelombang" | "";
  warna_kulit?: string;
  memiliki_cacat_tubuh?: "Ya" | "Tidak" | "";
  cacat_tubuh_penjelasan?: string;
  memakai_kacamata?: "Ya" | "Tidak" | "";
  kacamata_kelainan?: string;
  sakit_sering_diderita?: string;
  sakit_keras?: RiwayatSakitKeras[];

  // E. Penguasaan Bahasa
  kemampuan_bahasa_indonesia?:
    | "Menguasai"
    | "Cukup Menguasai"
    | "Kurang Menguasai"
    | "Tidak Menguasai"
    | "";
  bahasa_sehari_hari_dirumah?: string;
  bahasa_daerah_dikuasai?: string[];
  bahasa_daerah_lainnya_text?: string;
  bahasa_asing_dikuasai?: string[];
  bahasa_asing_lainnya_text?: string;

  // F. Hobby, Kegemaran, dan Cita-Cita
  hobby?: string;
  cita_cita?: string;

  // G. Keadaan Pendidikan
  pelajaran_disukai_sd?: string;
  alasan_pelajaran_disukai_sd?: string;
  pelajaran_tidak_disukai_sd?: string;
  alasan_pelajaran_tidak_disukai_sd?: string;
  prestasi_sd?: Prestasi[];
  kegiatan_belajar_dirumah?: "Rutin" | "Tidak" | "";
  dilaksanakan_setiap_belajar?: string[];
  kesulitan_belajar?: string;
  hambatan_belajar?: string;
  prestasi_smp?: Prestasi[];
}

// Tipe data untuk form update profil siswa, semua opsional kecuali mungkin ID (jika dikirim)
// Backend menerima semua field ini sebagai nullable, jadi Partial cocok.
export type StudentProfileFormData = Partial<Omit<StudentProfile, "id">>;

interface ApiResponseWithMessage {
  message: string;
  success?: boolean;
}

// Handler respons API internal
const handleApiResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  let responseData;

  if (contentType?.includes("application/json")) {
    responseData = await response.json();
  } else {
    if (
      response.status === 204 ||
      (response.status === 200 && !(await response.clone().text()))
    ) {
      return {
        success: true,
        message: response.statusText || "Operasi berhasil",
      };
    }
    const textContent = await response.text();
    responseData = {
      message: textContent || response.statusText || "Terjadi kesalahan",
    };
  }

  if (!response.ok) {
    const errorMessage =
      responseData?.message ||
      `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return responseData;
};

// --- Fungsi untuk API Profil Siswa (dari sudut pandang siswa) ---

// GET /api/siswa/profile - (SiswaController@showProfile)
// Mengambil data profil lengkap siswa yang sedang login
export const getMyStudentProfile = async (): Promise<StudentProfile> => {
  // --- PERUBAHAN DI SINI ---
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: withAuth(), 
  });
  const data = await handleApiResponse(response);
  return data as StudentProfile;
};

// PUT /api/profile -> SiswaController@updateProfile
export const updateMyStudentProfile = async (
  profileData: StudentProfileFormData
): Promise<ApiResponseWithMessage> => {
  // --- PERUBAHAN DI SINI ---
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: withAuth(),
    body: JSON.stringify(profileData),
  });
  return handleApiResponse(response);
};

// --- Fungsi Tambahan (jika diperlukan oleh Admin/Guru BK dari SiswaController) ---

// GET /api/siswa - (SiswaController@index) - Mengambil semua siswa (oleh Admin/Guru BK)
export const getAllSiswa = async (): Promise<StudentProfile[]> => {
  const response = await fetch(`${API_BASE_URL}/siswa`, {
    // Asumsi endpoint
    method: "GET",
    headers: withAuth(), // Membutuhkan token Admin/Guru BK
  });
  const data = await handleApiResponse(response);
  return data as StudentProfile[];
};

// GET /api/siswa/{id} - (SiswaController@show) - Mengambil detail siswa tertentu (oleh Admin/Guru BK)
export const getSiswaById = async (id: string): Promise<StudentProfile> => {
  const response = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    // Asumsi endpoint
    method: "GET",
    headers: withAuth(), // Membutuhkan token Admin/Guru BK
  });
  const data = await handleApiResponse(response);
  return data as StudentProfile;
};

// POST /api/siswa - (SiswaController@store) - Membuat data siswa baru (oleh Admin)
// Ini akan membuat user baru di collection 'Users' dengan data lengkap.
export const createSiswaWithDetail = async (
  siswaData: StudentProfileFormData
): Promise<ApiResponseWithMessage> => {
  // Pastikan siswaData memiliki semua field yang divalidasi di SiswaController@validateSiswaData
  // dan mungkin field wajib seperti `name`, `username`, `email`, `password`, `role` jika ini membuat user baru.
  // Jika ini membuat user baru, tipe datanya mungkin perlu disesuaikan agar password wajib.
  const response = await fetch(`${API_BASE_URL}/siswa`, {
    // Asumsi endpoint
    method: "POST",
    headers: withAuth(), // Membutuhkan token Admin
    body: JSON.stringify(siswaData),
  });
  return handleApiResponse(response);
};

// PUT /api/siswa/{id} - (SiswaController@update) - Mengupdate data siswa tertentu (oleh Admin/Guru BK)
export const updateSiswaById = async (
  id: string,
  siswaData: StudentProfileFormData
): Promise<ApiResponseWithMessage> => {
  const response = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    // Asumsi endpoint
    method: "PUT",
    headers: withAuth(), // Membutuhkan token Admin/Guru BK
    body: JSON.stringify(siswaData),
  });
  return handleApiResponse(response);
};

// DELETE /api/siswa/{id} - (SiswaController@destroy) - Menghapus data siswa tertentu (oleh Admin)
export const deleteSiswaById = async (
  id: string
): Promise<ApiResponseWithMessage> => {
  const response = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    // Asumsi endpoint
    method: "DELETE",
    headers: withAuth(), // Membutuhkan token Admin
  });
  return handleApiResponse(response);
};
