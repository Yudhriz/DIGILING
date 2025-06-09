import { API_BASE_URL, withAuth } from "./api";

// Tipe data untuk satu data Aspirasi
export interface AspirationRecord {
  id: string;
  userId: string;
  username: string; // Bisa 'Anonymous'
  name: string; // Bisa 'Siswa Anonim'
  content: string;
  createdAt: string; // ISO 8601 Timestamp string
  updatedAt: string;
}

// Tipe data untuk payload saat siswa mengirim aspirasi
export interface AspirationFormData {
  content: string;
  is_anonymous: boolean;
}

// Tipe standar untuk respons API
interface ApiResponse {
  message: string;
  data?: AspirationRecord;
}

const handleApiResponse = async (response: Response) => {
  // ... (Gunakan fungsi handleApiResponse yang sudah ada atau salin dari service lain)
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

// --- FUNGSI-FUNGSI API ASPIRASI ---

// GET /api/aspirations -> AspirationController@index
// Backend akan otomatis memfilter berdasarkan peran (Guru BK lihat semua, Siswa lihat miliknya)
export const getAspirations = async (): Promise<AspirationRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/aspirations`, {
    method: "GET",
    headers: withAuth(),
  });
  return handleApiResponse(response);
};

// POST /api/aspirations -> AspirationController@store (hanya untuk Siswa)
export const submitAspiration = async (
  data: AspirationFormData
): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/aspirations`, {
    method: "POST",
    headers: withAuth(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(response);
};

// DELETE /api/aspirations/{id} -> AspirationController@destroy (Siswa/Guru BK)
export const deleteAspiration = async (
  aspirationId: string
): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/aspirations/${aspirationId}`, {
    method: "DELETE",
    headers: withAuth(),
  });
  return handleApiResponse(response);
};
