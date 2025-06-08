import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/ui/Button";
import AttendanceMap from "../../components/maps/AttendanceMap";
import Modal from "../../components/ui/Modal";
import {
  Loader,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  XCircle,
  Users,
  Wifi,
  ArrowLeft,
} from "lucide-react";
import L from "leaflet";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import * as attendanceService from "../../services/attendanceService";
import type { SubmitAttendancePayload } from "../../services/attendanceService";

const CAMPUS_COORDINATES = {
  latitude: -7.633,
  longitude: 111.5415,
};
const MAX_RADIUS_METERS = 250;

function calculateDistance(
  coords1: { latitude: number; longitude: number },
  coords2: { latitude: number; longitude: number }
) {
  function toRad(x: number) {
    return (x * Math.PI) / 180;
  }
  const R = 6371e3;
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

type AttendanceStatus = "HADIR" | "IZIN" | "SAKIT";

const AttendancePage: React.FC = () => {
  const { user } = useAuthStore();
  const [attendanceMode, setAttendanceMode] = useState<
    "LURING" | "DARING" | null
  >(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [submittingStatus, setSubmittingStatus] =
    useState<AttendanceStatus | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [isWithinCampus, setIsWithinCampus] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<L.LatLngExpression | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const [selectedStatusForModal, setSelectedStatusForModal] = useState<
    "IZIN" | "SAKIT" | null
  >(null);

  const checkInitialAttendanceStatus = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const todayAttendance = await attendanceService.getMyTodaysAttendance();
      if (todayAttendance && todayAttendance.status) {
        setCurrentStatus(todayAttendance.status);
        if (todayAttendance.workCode) {
          setAttendanceMode(todayAttendance.workCode as "LURING" | "DARING");
        }
      }
    } catch (error: any) {
      if (
        error.message.includes("404") ||
        error.message.toLowerCase().includes("belum ada data")
      ) {
        setCurrentStatus(null);
      } else {
        toast.error(`Gagal memuat status: ${error.message}`);
      }
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      checkInitialAttendanceStatus();
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [user, checkInitialAttendanceStatus]);

  const checkUserLocation = useCallback(() => {
    setIsLocationLoading(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Browser Anda tidak mendukung Geolocation.");
      setIsLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation([userCoords.latitude, userCoords.longitude]);
        const distance = calculateDistance(userCoords, CAMPUS_COORDINATES);
        setIsWithinCampus(distance <= MAX_RADIUS_METERS);
        setIsLocationLoading(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Akses lokasi ditolak. Harap izinkan akses lokasi.");
        } else {
          setLocationError("Tidak bisa mendapatkan lokasi Anda.");
        }
        setIsLocationLoading(false);
      }
    );
  }, []);

  const handleModeSelect = useCallback(
    (mode: "LURING" | "DARING") => {
      setAttendanceMode(mode);
      checkUserLocation();
    },
    [checkUserLocation]
  );

  const handleResetMode = useCallback(() => {
    setAttendanceMode(null);
    setUserLocation(null);
    setLocationError(null);
    setIsWithinCampus(false);
  }, []);

  const handleOpenAbsenceModal = useCallback((status: "IZIN" | "SAKIT") => {
    setSelectedStatusForModal(status);
    setIsModalOpen(true);
  }, []);

  const handleMarkAttendance = useCallback(
    async (status: AttendanceStatus, reason?: string) => {
      setSubmittingStatus(status);

      const payload: SubmitAttendancePayload = {
        action: status,
        notes: reason,
        work_code: attendanceMode,
      };

      if (userLocation) {
        payload.latitude = (userLocation as L.LatLngTuple)[0];
        payload.longitude = (userLocation as L.LatLngTuple)[1];
      } else if (attendanceMode === "LURING" && status === "HADIR") {
        toast.error(
          "Lokasi tidak ditemukan. Harap aktifkan lokasi dan coba lagi."
        );
        setSubmittingStatus(null);
        return;
      }

      try {
        const response = await attendanceService.submitStudentAttendance(
          payload
        );
        toast.success(response.message || "Absensi berhasil dicatat!");
        setCurrentStatus(response.data.status);
      } catch (error: any) {
        toast.error(`Gagal: ${error.message || "Terjadi kesalahan"}`);
      } finally {
        setSubmittingStatus(null);
      }
    },
    [attendanceMode, userLocation]
  );

  const handleSubmitAbsenceReason = useCallback(() => {
    if (!absenceReason.trim() || !selectedStatusForModal) {
      toast.error("Harap isi alasan Anda.");
      return;
    }
    handleMarkAttendance(selectedStatusForModal, absenceReason);
    setIsModalOpen(false);
    setAbsenceReason("");
    setSelectedStatusForModal(null);
  }, [absenceReason, selectedStatusForModal, handleMarkAttendance]);

  const renderAttendanceActions = () => {
    if (isLocationLoading) {
      return (
        <div className='flex items-center justify-center p-8'>
          <Loader className='animate-spin w-8 h-8 text-gray-500 mr-3' />
          <span>Mencari lokasi Anda...</span>
        </div>
      );
    }
    if (locationError) {
      return (
        <div className='p-4 bg-red-50 text-red-700 rounded-md flex items-center'>
          <XCircle className='w-5 h-5 mr-3' /> {locationError}
        </div>
      );
    }
    return (
      <div className='space-y-6'>
        <Button
          onClick={handleResetMode}
          variant='link'
          className='p-0 h-auto text-gray-600 hover:text-gray-800'
          disabled={!!submittingStatus}
        >
          <ArrowLeft className='w-4 h-4 mr-2' /> Pilih Ulang Mode
        </Button>
        {attendanceMode && userLocation && (
          <AttendanceMap
            mode={attendanceMode}
            campusCenter={[
              CAMPUS_COORDINATES.latitude,
              CAMPUS_COORDINATES.longitude,
            ]}
            radius={MAX_RADIUS_METERS}
            userLocation={userLocation}
            isWithinCampus={isWithinCampus}
          />
        )}
        {attendanceMode === "LURING" && !isWithinCampus && (
          <div className='p-4 bg-yellow-50 text-yellow-700 rounded-md flex items-start'>
            <AlertTriangle className='w-5 h-5 mr-3 flex-shrink-0' />
            <span>
              Anda berada di luar area kampus. Tombol "Hadir" dinonaktifkan.
            </span>
          </div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Button
            size='lg'
            onClick={() => handleMarkAttendance("HADIR")}
            // --- REVISI LOGIKA DISABLED DI SINI ---
            disabled={
              isLocationLoading ||
              !!submittingStatus ||
              (attendanceMode === "LURING" && !isWithinCampus)
            }
            isLoading={submittingStatus === "HADIR"}
            className='w-full'
            rightIcon={<MapPin className='w-5 h-5' />}
          >
            Hadir {attendanceMode === "DARING" ? "(Daring)" : ""}
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => handleOpenAbsenceModal("IZIN")}
            // --- REVISI LOGIKA DISABLED DI SINI ---
            disabled={isLocationLoading || !!submittingStatus}
            isLoading={submittingStatus === "IZIN"}
            className='w-full'
            rightIcon={<ShieldAlert className='h-5 h-5' />}
          >
            Izin
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => handleOpenAbsenceModal("SAKIT")}
            // --- REVISI LOGIKA DISABLED DI SINI ---
            disabled={isLocationLoading || !!submittingStatus}
            isLoading={submittingStatus === "SAKIT"}
            className='w-full'
            rightIcon={<XCircle className='h-5 h-5' />}
          >
            Sakit
          </Button>
        </div>
      </div>
    );
  };

  const renderInitialChoice = () => {
    return (
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-700 mb-4'>
          Pilih Mode Pembelajaran Hari Ini
        </h3>
        <div className='flex flex-col md:flex-row gap-4 justify-center'>
          <Button
            size='lg'
            onClick={() => handleModeSelect("LURING")}
            className='w-full md:w-auto'
            rightIcon={<Users />}
          >
            Luring (Tatap Muka)
          </Button>
          <Button
            size='lg'
            onClick={() => handleModeSelect("DARING")}
            variant='outline'
            className='w-full md:w-auto'
            rightIcon={<Wifi />}
          >
            Daring (Online)
          </Button>
        </div>
      </div>
    );
  };

  if (isPageLoading) {
    return (
      <div className='flex items-center justify-center min-h-[calc(100vh-200px)]'>
        <Loader className='animate-spin w-10 h-10 text-primary-500' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-6'>
      <div className='bg-white shadow-md rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          Absensi Harian
        </h2>
        <p className='text-gray-500 mb-2'>
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className='text-center text-4xl font-mono tracking-widest text-gray-800 py-4 mb-4 bg-gray-100 rounded-lg'>
          {currentTime.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        {currentStatus ? (
          <div className='flex flex-col items-center text-center p-8 bg-green-50 border-2 border-green-200 rounded-lg'>
            <CheckCircle className='w-16 h-16 text-green-500 mb-4' />
            <h3 className='text-xl font-bold text-gray-800'>
              Absensi Berhasil
            </h3>
            <p className='text-gray-600 mt-2'>
              Status Anda hari ini telah tercatat:{" "}
              <strong>
                {currentStatus} {attendanceMode ? `(${attendanceMode})` : ""}
              </strong>
            </p>
          </div>
        ) : (
          <>
            <div className='mb-6 text-center'>
              <span className='text-gray-500'>Status: </span>
              <span className='font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm'>
                Belum Absen
              </span>
            </div>
            {attendanceMode ? renderAttendanceActions() : renderInitialChoice()}
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAbsenceReason("");
          setSelectedStatusForModal(null);
        }}
        title={`Form Keterangan ${selectedStatusForModal || ""}`}
      >
        <div className='space-y-4'>
          <label
            htmlFor='reason'
            className='block text-sm font-medium text-gray-700'
          >
            Mohon berikan alasan{" "}
            {selectedStatusForModal === "IZIN" ? "izin" : "sakit"} Anda.
          </label>
          <textarea
            id='reason'
            rows={4}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            value={absenceReason}
            onChange={(e) => setAbsenceReason(e.target.value)}
            placeholder={
              selectedStatusForModal === "IZIN"
                ? "Contoh: Ada acara keluarga mendadak"
                : "Contoh: Demam dan batuk"
            }
          ></textarea>
          <div className='flex justify-end space-x-3'>
            <Button
              variant='ghost'
              onClick={() => {
                setIsModalOpen(false);
                setAbsenceReason("");
                setSelectedStatusForModal(null);
              }}
              disabled={
                submittingStatus === "IZIN" || submittingStatus === "SAKIT"
              }
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitAbsenceReason}
              disabled={!absenceReason.trim() || !!submittingStatus}
              isLoading={submittingStatus === selectedStatusForModal}
            >
              Kirim Keterangan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendancePage;
