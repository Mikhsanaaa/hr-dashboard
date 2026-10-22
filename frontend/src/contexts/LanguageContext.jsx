import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const dictionary = {
  id: {
    dashboard: 'Dasbor',
    employees: 'Data Karyawan',
    leaves: 'Manajemen Cuti',
    compensation: 'Kompensasi',
    logout: 'Keluar',
    search: 'Cari...',
    export: 'Ekspor CSV',
    totalEmp: 'Total Karyawan',
    activeEmp: 'Karyawan Aktif',
    turnover: 'Tingkat Turnover',
    filter: 'Filter Lanjutan',
  },
  en: {
    dashboard: 'Dashboard',
    employees: 'Employees',
    leaves: 'Leave Management',
    compensation: 'Compensation',
    logout: 'Logout',
    search: 'Search...',
    export: 'Export CSV',
    totalEmp: 'Total Employees',
    activeEmp: 'Active Employees',
    turnover: 'Turnover Rate',
    filter: 'Advanced Filter',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id'); // Default: Bahasa Indonesia

  const t = (key) => dictionary[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);