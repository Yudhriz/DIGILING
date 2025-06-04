import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"; // Atau ikon separator lain

export interface BreadcrumbItem {
  label: string;
  to?: string; // Opsional, jika tidak ada 'to', item dianggap sebagai halaman saat ini
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label='breadcrumb' className={`mb-6 ${className}`}>
      <ol className='flex items-center space-x-1 text-sm text-gray-500'>
        {items.map((item, index) => (
          <li key={index} className='flex items-center'>
            {item.to ? (
              <Link
                to={item.to}
                className='hover:text-primary-600 hover:underline'
              >
                {item.label}
              </Link>
            ) : (
              <span className='font-medium text-gray-700' aria-current='page'>
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className='h-4 w-4 mx-1 text-gray-400' />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
