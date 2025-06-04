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

const navLinks = [
  { to: "/siswa/absensi", label: "Absensi Siswa" },
  { to: "/profil", label: "Profil Siswa" },
  { to: "/jurnal", label: "Jurnal Kasus" },
  { to: "/aspirasi", label: "Wadah Aspirasi" },
  { to: "/konsultasi", label: "Konsultasi" },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout, isLoggedIn } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);

  if (["/login", "/register", "/forgot-password"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <Link
              to='/'
              className='flex items-center text-[#0066cc] font-bold text-xl'
            >
              <img src='/Logo.png' alt='Logo Digiling' className='h-16 w-16' />
              DIGILING
            </Link>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {isLoggedIn &&
                navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === link.to
                        ? "border-[#0066cc] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>

          <div className='hidden sm:flex sm:items-center space-x-4'>
            {isLoggedIn ? (
              <>
                <button
                  className='p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none'
                  aria-label='Notifikasi'
                >
                  <Bell className='h-6 w-6' />
                </button>
                <Link
                  to='/pesan'
                  className='p-2 rounded-full text-gray-500 hover:text-gray-600'
                >
                  <MessageSquare className='h-6 w-6' />
                </Link>
                <div className='relative'>
                  <button
                    onClick={toggleUserMenu}
                    className='flex text-sm items-center rounded-full focus:outline-none'
                  >
                    <span className='mr-2 text-gray-700'>{user?.name}</span>
                    <div className='h-8 w-8 rounded-full bg-[#0066cc] bg-opacity-10 flex items-center justify-center text-[#0066cc]'>
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user?.name || user?.username}
                          className='h-8 w-8 rounded-full'
                        />
                      ) : (
                        <User className='h-5 w-5' />
                      )}
                    </div>
                    <ChevronDown className='ml-1 h-4 w-4 text-gray-500' />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white py-1 ring-1 ring-black ring-opacity-5 z-10'
                      role='menu'
                    >
                      <Link
                        to='/profil'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Profil Saya
                      </Link>
                      <Link
                        to='/pengaturan'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Pengaturan
                      </Link>
                      <button
                        onClick={logout}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
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
              <>
                <Link to='/login'>
                  <Button variant='ghost'>Masuk</Button>
                </Link>
                <Link to='/register'>
                  <Button variant='primary'>Daftar</Button>
                </Link>
              </>
            )}
          </div>

          <div className='sm:hidden flex items-center'>
            <button
              onClick={toggleMenu}
              className='p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none'
              aria-label='Toggle Menu'
            >
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='sm:hidden'>
          <div className='pt-2 pb-3 space-y-1'>
            {isLoggedIn ? (
              navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === link.to
                      ? "border-[#0066cc] text-[#0066cc] bg-blue-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))
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
                        alt={user?.name || user?.username}
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
                <button className='ml-auto p-1 text-gray-500 hover:text-gray-600'>
                  <Bell className='h-6 w-6' />
                </button>
              </div>
              <div className='mt-3 space-y-1'>
                <Link
                  to='/profil'
                  className='block px-4 py-2 text-base text-gray-600 hover:bg-gray-100'
                >
                  Profil Saya
                </Link>
                <Link
                  to='/pengaturan'
                  className='block px-4 py-2 text-base text-gray-600 hover:bg-gray-100'
                >
                  Pengaturan
                </Link>
                <button
                  onClick={logout}
                  className='block w-full text-left px-4 py-2 text-base text-gray-600 hover:bg-gray-100'
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
      )}
    </nav>
  );
};

export default Navbar;
