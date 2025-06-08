import { API_BASE_URL, withAuth } from "./api";

// Tipe Data untuk Absensi
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "HADIR" | "SAKIT" | "IZIN" | "ALPHA";
  clockInTime?: string | null;
  clockOutTime?: string | null;
  notes?: string | null;
  recordedBy?: string;
  clockInLatitude?: number | null;
  clockInLongitude?: number | null;
  clockInAddress?: string | null;
  workCode?: "LURING" | "DARING" | string | null; // <-- Gunakan workCode (camelCase) secara konsisten
  createdAt?: string;
  updatedAt?: string;
  year_month?: string;
}

// Tipe data untuk payload submit absensi oleh siswa
export interface SubmitAttendancePayload {
  action: "HADIR" | "SAKIT" | "IZIN";
  latitude?: number;
  longitude?: number;
  notes?: string;
  address?: string;
  work_code?: "LURING" | "DARING" | string | null;
}

// Tipe data untuk respons dari API submit
interface SubmitAttendanceResponse {
  message: string;
  data: AttendanceRecord;
}

// Interface ApiResponseWithMessage yang tidak terpakai DIHAPUS dari sini

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
    const errorMessage = responseData?.errors
      ? JSON.stringify(responseData.errors)
      : responseData?.message ||
        `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return responseData;
};

// POST /api/attendance/submit
export const submitStudentAttendance = async (
  payload: SubmitAttendancePayload
): Promise<SubmitAttendanceResponse> => {
  const apiPayload = {
    ...payload,
    action: payload.action === "HADIR" ? "DATANG" : payload.action,
  };

  const response = await fetch(`${API_BASE_URL}/attendance/submit`, {
    method: "POST",
    headers: withAuth(),
    body: JSON.stringify(apiPayload),
  });
  return handleApiResponse(response);
};

// GET /api/attendance/today
export const getMyTodaysAttendance = async (): Promise<AttendanceRecord> => {
  const response = await fetch(`${API_BASE_URL}/attendance/today`, {
    method: "GET",
    headers: withAuth(),
  });
  return handleApiResponse(response);
};

// GET /api/attendance/report/daily
export const getDailyReport = async (
  date: string
): Promise<AttendanceRecord[]> => {
  const response = await fetch(
    `${API_BASE_URL}/attendance/report/daily?date=${date}`,
    {
      method: "GET",
      headers: withAuth(),
    }
  );
  return handleApiResponse(response);
};

// GET /api/attendance/report/monthly
export const getMonthlyReport = async (
  year: number,
  month: number
): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URL}/attendance/report/monthly?year=${year}&month=${month}`,
    {
      method: "GET",
      headers: withAuth(),
    }
  );
  return handleApiResponse(response);
};

// PUT /api/absensi/update/{attendanceId}
export const updateAttendance = async (
  attendanceId: string,
  data: Partial<AttendanceRecord>
): Promise<SubmitAttendanceResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/absensi/update/${attendanceId}`,
    {
      method: "PUT",
      headers: withAuth(),
      body: JSON.stringify(data),
    }
  );
  return handleApiResponse(response);
};

// POST /api/absensi/manual-add
export const manualAddAttendance = async (
  data: any
): Promise<SubmitAttendanceResponse> => {
  const response = await fetch(`${API_BASE_URL}/absensi/manual-add`, {
    method: "POST",
    headers: withAuth(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(response);
};
