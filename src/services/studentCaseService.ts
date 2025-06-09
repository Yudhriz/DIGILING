import { API_BASE_URL, withAuth } from "./api";

// Tipe data untuk satu data Jurnal Kasus, sesuai respons API
export interface StudentCaseRecord {
  id: string;
  studentId: string;
  studentName: string;
  guruBkId: string;
  guruBkName: string;
  topic: string;
  followUp: string;
  caseDate: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Tipe data untuk form tambah/edit.
export interface StudentCaseFormData {
  student_user_id: string; // Wajib saat membuat
  topic: string;
  follow_up: string;
  case_date: string; // Format YYYY-MM-DD
  notes?: string | null; // <-- PERUBAHAN DI SINI, disamakan dengan StudentCaseRecord
}

// Tipe data untuk update.
export type StudentCaseUpdateData = Partial<
  Omit<StudentCaseFormData, "student_user_id">
>;

// Tipe standar untuk respons API
interface ApiResponse {
  message: string;
  data?: StudentCaseRecord;
}

// Handler respons API internal
const handleApiResponse = async (response: Response) => {
  const responseData = await response.json();
  if (!response.ok) {
    const errorMessage =
      responseData?.message ||
      JSON.stringify(responseData.errors) ||
      `Error: ${response.status}`;
    throw new Error(errorMessage);
  }
  return responseData;
};

// --- FUNGSI-FUNGSI API JURNAL KASUS ---

// GET /api/student-cases -> KasusSiswaController@index
export const getCases = async (): Promise<StudentCaseRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/student-cases`, {
    method: "GET",
    headers: withAuth(),
  });
  return handleApiResponse(response);
};

// GET /api/student-cases/{id} -> KasusSiswaController@show
export const getCaseById = async (
  caseId: string
): Promise<StudentCaseRecord> => {
  const response = await fetch(`${API_BASE_URL}/student-cases/${caseId}`, {
    method: "GET",
    headers: withAuth(),
  });
  return handleApiResponse(response);
};

// POST /api/student-cases -> KasusSiswaController@store (hanya untuk Guru BK)
export const createCase = async (
  caseData: StudentCaseFormData
): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/student-cases`, {
    method: "POST",
    headers: withAuth(),
    body: JSON.stringify(caseData),
  });
  return handleApiResponse(response);
};

// PUT /api/student-cases/{id} -> KasusSiswaController@update (hanya untuk Guru BK)
export const updateCase = async (
  caseId: string,
  caseData: StudentCaseUpdateData
): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/student-cases/${caseId}`, {
    method: "PUT",
    headers: withAuth(),
    body: JSON.stringify(caseData),
  });
  return handleApiResponse(response);
};

// DELETE /api/student-cases/{id} -> KasusSiswaController@destroy (hanya untuk Guru BK)
export const deleteCase = async (caseId: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/student-cases/${caseId}`, {
    method: "DELETE",
    headers: withAuth(),
  });
  return handleApiResponse(response);
};
