import { Link } from "react-router-dom";
import { Globe, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-[#0066cc] text-white'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Logo and Links Section */}
          <div className='col-span-1'>
            <div className='flex items-center mb-6'>
              <img src='/Logo.png' alt='DIGILING Logo' className='h-16 w-16' />
            </div>
            <div className='space-y-2'>
              <a
                href='https://unipma.ac.id'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 hover:text-blue-200'
              >
                <Globe className='h-5 w-5' />
                <span>unipma.ac.id</span>
              </a>
              <a
                href='https://bk.unipma.ac.id'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 hover:text-blue-200'
              >
                <Globe className='h-5 w-5' />
                <span>bk.unipma.ac.id</span>
              </a>
            </div>
          </div>

          {/* Menu Section */}
          <div className='col-span-1'>
            <h3 className='text-lg font-semibold mb-4'>Menu</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/siswa/absensi' className='hover:text-blue-200'>
                  Absensi Siswa
                </Link>
              </li>
              <li>
                <Link to='/siswa/profile-saya' className='hover:text-blue-200'>
                  Profile Siswa
                </Link>
              </li>
              <li>
                <Link to='/siswa/jurnal-kasus' className='hover:text-blue-200'>
                  Jurnal Kasus
                </Link>
              </li>
              <li>
                <Link to='/siswa/aspirasi' className='hover:text-blue-200'>
                  Wadah Aspirasi
                </Link>
              </li>
              <li>
                <Link to='/konsultasi' className='hover:text-blue-200'>
                  Konsultasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Media Sosial Section */}
          <div className='col-span-1'>
            <h3 className='text-lg font-semibold mb-4'>Media Sosial</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='https://instagram.com/official_unipma'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-2 hover:text-blue-200'
                >
                  <Instagram className='h-5 w-5' />
                  <span>official_unipma</span>
                </a>
              </li>
              <li>
                <a
                  href='https://instagram.com/bk.unipma'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-2 hover:text-blue-200'
                >
                  <Instagram className='h-5 w-5' />
                  <span>bk.unipma</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className='col-span-1'>
            <h3 className='text-lg font-semibold mb-4'>Alamat</h3>
            <p>
              Universitas PGRI Madiun
              <br />
              Jl. Setia Budi No.85, Kanigoro,
              <br />
              Kec. Kartoharjo, Kota Madiun,
              <br />
              Jawa Timur 63118
            </p>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-blue-400'>
          <p className='text-center'>
            &copy; {new Date().getFullYear()} DIGILING - Universitas PGRI
            Madiun. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
