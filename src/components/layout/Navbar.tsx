import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  MessageSquare,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Button from "../ui/Button";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout, isLoggedIn } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  if (["/login", "/register", "/forgot-password"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link
                to='/'
                className='text-[#0066cc] font-bold text-xl flex items-center'
              >
                <img
                  src='/Logo.png'
                  alt='Logo Digiling'
                  className='h-16 w-16'
                />
                DIGILING
              </Link>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {isLoggedIn && (
                <>
                  <Link
                    to='/absensi'
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/absensi"
                        ? "border-[#0066cc] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Absensi Siswa
                  </Link>
                  <Link
                    to='/profil'
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/profil"
                        ? "border-[#0066cc] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Profil Siswa
                  </Link>
                  <Link
                    to='/jurnal'
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/jurnal"
                        ? "border-[#0066cc] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Jurnal Kasus
                  </Link>
                  <Link
                    to='/aspirasi'
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/aspirasi"
                        ? "border-[#0066cc] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Wadah Aspirasi
                  </Link>
                  <Link
                    to='/konsultasi'
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/konsultasi"
                        ? "border-[#0066cc] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Konsultasi
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            {isLoggedIn ? (
              <>
                <button
                  className='p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600'
                  aria-label='Notifikasi'
                >
                  <Bell className='h-6 w-6' />
                </button>

                <Link
                  to='/pesan'
                  className='p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600'
                  aria-label='Pesan'
                >
                  <MessageSquare className='h-6 w-6' />
                </Link>

                <div className='ml-3 relative'>
                  <div>
                    <button
                      className='flex text-sm items-center rounded-full focus:outline-none'
                      id='user-menu'
                      aria-expanded='false'
                      aria-haspopup='true'
                      onClick={toggleUserMenu}
                    >
                      <span className='mr-2 text-gray-700'>{user?.name}</span>
                      <div className='h-8 w-8 rounded-full bg-[#0066cc] bg-opacity-10 flex items-center justify-center text-[#0066cc]'>
                        {user?.avatarUrl ? (
                          <img
                            className='h-8 w-8 rounded-full'
                            src={user.avatarUrl}
                            alt={user.name}
                          />
                        ) : (
                          <User className='h-5 w-5' />
                        )}
                      </div>
                      <ChevronDown className='ml-1 h-4 w-4 text-gray-500' />
                    </button>
                  </div>

                  {isUserMenuOpen && (
                    <div
                      className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10'
                      role='menu'
                      aria-orientation='vertical'
                      aria-labelledby='user-menu'
                    >
                      <Link
                        to='/profil'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        role='menuitem'
                      >
                        Profil Saya
                      </Link>
                      <Link
                        to='/pengaturan'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        role='menuitem'
                      >
                        Pengaturan
                      </Link>
                      <button
                        onClick={logout}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        role='menuitem'
                      >
                        <div className='flex items-center'>
                          <LogOut className='h-4 w-4 mr-2' />
                          Keluar
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className='flex space-x-4 items-center'>
                <Link to='/login'>
                  <Button variant='ghost'>Masuk</Button>
                </Link>
                <Link to='/register'>
                  <Button variant='primary'>Daftar</Button>
                </Link>
              </div>
            )}
          </div>

          <div className='flex items-center sm:hidden'>
            <button
              className='p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none'
              aria-expanded='false'
              onClick={toggleMenu}
            >
              <span className='sr-only'>Buka menu</span>
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className='pt-2 pb-3 space-y-1'>
          {isLoggedIn ? (
            <>
              <Link
                to='/absensi'
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === "/absensi"
                    ? "border-[#0066cc] text-[#0066cc] bg-blue-50"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                Absensi Siswa
              </Link>
              <Link
                to='/profil'
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === "/profil"
                    ? "border-[#0066cc] text-[#0066cc] bg-blue-50"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                Profil Siswa
              </Link>
              <Link
                to='/jurnal'
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === "/jurnal"
                    ? "border-[#0066cc] text-[#0066cc] bg-blue-50"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                Jurnal Kasus
              </Link>
              <Link
                to='/aspirasi'
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === "/aspirasi"
                    ? "border-[#0066cc] text-[#0066cc] bg-blue-50"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                Wadah Aspirasi
              </Link>
              <Link
                to='/konsultasi'
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === "/konsultasi"
                    ? "border-[#0066cc] text-[#0066cc] bg-blue-50"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                Konsultasi
              </Link>
            </>
          ) : (
            <div className='mt-4 flex justify-center space-x-4 p-4'>
              <Link to='/login'>
                <Button variant='ghost' size='md'>
                  Masuk
                </Button>
              </Link>
              <Link to='/register'>
                <Button variant='primary' size='md'>
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <div className='pt-4 pb-3 border-t border-gray-200'>
            <div className='flex items-center px-4'>
              <div className='flex-shrink-0'>
                <div className='h-10 w-10 rounded-full bg-[#0066cc] bg-opacity-10 flex items-center justify-center text-[#0066cc]'>
                  {user?.avatarUrl ? (
                    <img
                      className='h-10 w-10 rounded-full'
                      src={user.avatarUrl}
                      alt={user.name}
                    />
                  ) : (
                    <User className='h-6 w-6' />
                  )}
                </div>
              </div>
              <div className='ml-3'>
                <div className='text-base font-medium text-gray-800'>
                  {user?.name}
                </div>
                <div className='text-sm font-medium text-gray-500'>
                  {user?.email}
                </div>
              </div>
              <button className='ml-auto flex-shrink-0 p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none'>
                <Bell className='h-6 w-6' />
              </button>
            </div>
            <div className='mt-3 space-y-1'>
              <Link
                to='/profil'
                className='block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100'
              >
                Profil Saya
              </Link>
              <Link
                to='/pengaturan'
                className='block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100'
              >
                Pengaturan
              </Link>
              <button
                onClick={logout}
                className='block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100'
              >
                <div className='flex items-center'>
                  <LogOut className='h-5 w-5 mr-2' />
                  Keluar
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
