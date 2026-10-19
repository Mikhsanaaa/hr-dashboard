import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Memanggil API backend
    axios.get('http://localhost:5000/api/employees/stats')
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">HR Dashboard Overview</h1>
      
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm">Total Karyawan</h2>
            <p className="text-3xl font-bold">{stats.totalEmployees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm">Karyawan Aktif</h2>
            <p className="text-3xl font-bold text-green-600">{stats.activeEmployees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm">Turnover Rate</h2>
            <p className="text-3xl font-bold text-red-600">{stats.turnoverRate}%</p>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default App;