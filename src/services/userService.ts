import { API_BASE_URL, withAuth } from "./api";

// Mendefinisikan struktur data pengguna yang diharapkan dari API
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "guru_bk" | "siswa";
  avatarUrl?: string;
}

// Tipe data untuk payload saat membuat pengguna baru
export type UserCreationData = Omit<User, "id" | "avatarUrl"> & {
  password?: string;
};

// Tipe data untuk payload saat memperbarui pengguna
export type UserUpdateData = Partial<Omit<User, "id" | "avatarUrl">> & {
  password?: string;
};

// Tipe standar untuk respons API yang hanya berisi pesan
interface ApiResponseWithMessage {
  message: string;
  success?: boolean;
}

// Fungsi terpusat untuk menangani respons dari fetch API
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

// Mengambil semua pengguna dari backend (GET /users)
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: withAuth(),
  });
  const data = await handleApiResponse(response);
  return data as User[];
};

// Mengambil satu pengguna berdasarkan ID (GET /users/{id})
export const getUserById = async (id: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "GET",
    headers: withAuth(),
  });
  const data = await handleApiResponse(response);
  return data as User;
};

// Membuat pengguna baru (POST /users) - Nama fungsi diubah menjadi createUser
export const createUser = async (userData: UserCreationData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: withAuth(),
    body: JSON.stringify(userData),
  });
  await handleApiResponse(response);

  // Asumsi backend tidak mengembalikan user baru, jadi kita buat di sini
  const newUser: User = {
    id: `new_${Date.now()}`,
    name: userData.name,
    username: userData.username,
    email: userData.email,
    role: userData.role,
  };
  return newUser;
};

// Memperbarui data pengguna (PUT /users/{id})
export const updateUser = async (
  id: string,
  userData: UserUpdateData
): Promise<User> => {
  const payload = { ...userData };
  if (
    payload.password === "" ||
    payload.password === null ||
    payload.password === undefined
  ) {
    delete payload.password;
  }
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: withAuth(),
    body: JSON.stringify(payload),
  });
  await handleApiResponse(response);

  const existingUser = await getUserById(id);
  const updatedUser: User = {
    ...existingUser,
    ...userData,
    id: id,
  };
  return updatedUser;
};

// Menghapus pengguna (DELETE /users/{id})
export const deleteUser = async (
  id: string
): Promise<ApiResponseWithMessage> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: withAuth(),
  });
  return handleApiResponse(response);
};
