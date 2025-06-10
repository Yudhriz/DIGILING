import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Clock, MessageSquare } from "lucide-react";
import Button from "../components/ui/Button";

const HomePage: React.FC = () => {
  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-r from-[#0066cc] to-blue-800 overflow-hidden'>
        <div className='max-w-7xl mx-auto'>
          <div className='relative z-10 py-8 sm:py-16 md:py-20 lg:py-28 lg:max-w-2xl lg:w-full'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <h1 className='text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl'>
                <span className='block'>DIGILING</span>
                <span className='block text-blue-200'>
                  Digital Sistem Informasi Manajemen Bimbingan Konseling
                </span>
              </h1>
              <p className='mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl'>
                Platform digital komprehensif untuk pengelolaan bimbingan
                konseling yang memudahkan interaksi antara konselor atau guru
                BK, dan siswa.
              </p>
              <div className='mt-8 sm:mt-12 sm:flex'>
                <div className='rounded-md shadow'>
                  <Link to='/register'>
                    <Button size='lg' className='w-full'>
                      Mulai Sekarang
                    </Button>
                  </Link>
                </div>
                <div className='mt-3 sm:mt-0 sm:ml-3'>
                  <Link to='/login'>
                    <Button
                      variant='outline'
                      size='lg'
                      className='w-full bg-white text-blue-700 hover:bg-gray-50'
                    >
                      Masuk
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2'>
          <img
            className='h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full'
            src='https://images.unsplash.com/photo-1494949649109-ecfc3b8c35df?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='Siswa berkolaborasi'
          />
        </div>
      </div>

      {/* Apa itu DIGILING Section */}
      <div className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:text-center'>
            <h2 className='text-base text-blue-600 font-semibold tracking-wide uppercase'>
              Tentang Kami
            </h2>
            <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
              Apa itu DIGILING?
            </p>
            <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
              DIGILING adalah platform digital yang dirancang khusus untuk
              memudahkan proses bimbingan dan konseling di institusi pendidikan.
              Sistem ini mengintegrasikan berbagai fitur yang dibutuhkan untuk
              pengelolaan BK modern.
            </p>
          </div>

          <div className='mt-20'>
            <dl className='space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10'>
              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white'>
                    <Users className='h-6 w-6' />
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Manajemen Siswa
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  Kelola data siswa secara efisien dengan fitur pencatatan yang
                  lengkap dan terorganisir.
                </dd>
              </div>

              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white'>
                    <Clock className='h-6 w-6' />
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Absensi Digital
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  Sistem absensi digital yang memudahkan pencatatan dan
                  pemantauan kehadiran siswa.
                </dd>
              </div>

              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white'>
                    <BookOpen className='h-6 w-6' />
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Jurnal Konseling
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  Dokumentasi lengkap untuk setiap sesi konseling dengan fitur
                  pelacakan perkembangan.
                </dd>
              </div>

              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white'>
                    <MessageSquare className='h-6 w-6' />
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Konsultasi Online
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  Fasilitas konsultasi online yang memungkinkan interaksi
                  langsung antara siswa dan konselor.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
