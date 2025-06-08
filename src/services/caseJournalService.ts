// Tipe data untuk satu data Jurnal Kasus
export interface CaseJournalRecord {
  id: string;
  studentId: string;
  studentName: string;
  guruBkId: string;
  guruBkName: string;
  topic: string;
  followUp: string;
  date: string; // Format YYYY-MM-DD
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipe data untuk form tambah/edit
export type CaseJournalFormData = Omit<
  CaseJournalRecord,
  "id" | "guruBkId" | "guruBkName" | "studentName" | "createdAt" | "updatedAt"
>;

interface ApiResponseWithMessage {
  message: string;
  data?: CaseJournalRecord;
}

// --- MOCK DATA (DATA CONTOH) ---
let mockCases: CaseJournalRecord[] = [
  {
    id: "case1",
    studentId: "u3",
    studentName: "Siswa Contoh",
    guruBkId: "gbk1",
    guruBkName: "Tantri, S.Pd.",
    topic: "Mencontek Saat Ujian",
    followUp: "Melakukan layanan konseling",
    date: "2025-05-10",
    notes: "Siswa mengakui kesalahannya dan berjanji tidak mengulangi.",
  },
  {
    id: "case2",
    studentId: "s2",
    studentName: "Budi Santoso",
    guruBkId: "gbk2",
    guruBkName: "Susanto, S.Pd.",
    topic: "Sering bolos sekolah",
    followUp: "Panggilan orang tua",
    date: "2025-05-15",
    notes: "Ada masalah keluarga yang perlu perhatian.",
  },
  {
    id: "case3",
    studentId: "u3",
    studentName: "Siswa Contoh",
    guruBkId: "gbk2",
    guruBkName: "Susanto, S.Pd.",
    topic: "Kesulitan bergaul",
    followUp: "Layanan bimbingan kelompok",
    date: "2025-05-18",
    notes: "-",
  },
];

// --- FUNGSI-FUNGSI API (SIMULASI) ---

// Untuk Guru BK/Admin: Mengambil semua jurnal kasus
export const getAllCases = async (): Promise<CaseJournalRecord[]> => {
  console.log("Fetching all cases (simulated)...");
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCases;
};

// Untuk Siswa: Mengambil riwayat kasusnya sendiri
export const getMyCases = async (
  studentId: string
): Promise<CaseJournalRecord[]> => {
  console.log("Fetching my cases (simulated)...");
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCases.filter((c) => c.studentId === studentId);
};

// Untuk Guru BK/Admin: Membuat kasus baru
export const createCase = async (
  caseData: CaseJournalFormData,
  creator: { id: string; name: string }
): Promise<ApiResponseWithMessage> => {
  console.log("Creating new case (simulated):", caseData);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newCase: CaseJournalRecord = {
    id: `case_${Date.now()}`,
    ...caseData,
    guruBkId: creator.id,
    guruBkName: creator.name,
    studentName: "Nama Siswa dari ID", // Di aplikasi nyata, nama ini diambil dari DB berdasarkan studentId
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCases.push(newCase);
  return { message: "Jurnal kasus berhasil dibuat.", data: newCase };
};

// Untuk Guru BK/Admin: Mengupdate kasus
export const updateCase = async (
  caseId: string,
  caseData: Partial<CaseJournalFormData>
): Promise<ApiResponseWithMessage> => {
  console.log(`Updating case ${caseId} (simulated):`, caseData);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = mockCases.findIndex((c) => c.id === caseId);
  if (index > -1) {
    mockCases[index] = {
      ...mockCases[index],
      ...caseData,
      updatedAt: new Date().toISOString(),
    };
    return {
      message: "Jurnal kasus berhasil diperbarui.",
      data: mockCases[index],
    };
  }
  throw new Error("Kasus tidak ditemukan");
};

// Untuk Guru BK/Admin: Menghapus kasus
export const deleteCase = async (
  caseId: string
): Promise<ApiResponseWithMessage> => {
  console.log(`Deleting case ${caseId} (simulated)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  mockCases = mockCases.filter((c) => c.id !== caseId);
  return { message: "Jurnal kasus berhasil dihapus." };
};
