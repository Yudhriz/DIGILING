import { API_BASE_URL, withAuth } from "./api";

// Tipe data untuk informasi Guru BK yang diterima dari API
export interface GuruBkInfo {
  id: string;
  name: string;
  nomor_telp_hp: string;
  avatarUrl: string;
}

// Handler respons API internal (bisa juga diimpor dari file utilitas umum)
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

// GET /api/chatguru -> SiswaController@chatguru
export const getGuruBkList = async (): Promise<GuruBkInfo[]> => {
  const response = await fetch(`${API_BASE_URL}/chatguru`, {
    method: "GET",
    headers: withAuth(), // Membutuhkan token siswa yang login
  });
  return handleApiResponse(response);
};
