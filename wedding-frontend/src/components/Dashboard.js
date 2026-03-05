import React, { useState, useEffect } from 'react';
import { Users, Download, Heart, UserCheck, UserX, Lock, FileText } from 'lucide-react';

const Dashboard = () => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');

  const CORRECT_PIN = '20221218'; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinCode === CORRECT_PIN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPinCode('');
    }
  };

  // --- DASHBOARD DATA STATE ---
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the data ONLY if the user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRsvps = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/rsvps');
        const data = await response.json();
        setRsvps(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchRsvps();
  }, [isAuthenticated]);

  // Calculate Statistics
  const totalAttending = rsvps.filter(r => r.attending === 'yes').length;
  const totalDeclined = rsvps.filter(r => r.attending === 'no').length;
  const yasaraSide = rsvps.filter(r => r.attending === 'yes' && r.side === 'yasara').length;
  const anuruddhaSide = rsvps.filter(r => r.attending === 'yes' && r.side === 'anuruddha').length;

  // --- 1. RENDER LOGIN SCREEN (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <Lock size={40} color="#B59461" style={{ margin: '0 auto 20px auto' }} />
          <h2 style={{ fontFamily: 'serif', color: '#333', marginBottom: '10px' }}>Admin Access</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Please enter the PIN to view the guest dashboard.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Enter PIN"
              style={{ width: '100%', padding: '15px', border: '1px solid #DDD', borderRadius: '6px', fontSize: '20px', textAlign: 'center', letterSpacing: '8px', boxSizing: 'border-box', marginBottom: '15px' }}
            />
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '-5px', marginBottom: '15px' }}>{error}</p>}
            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#B59461', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}>
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. RENDER DASHBOARD (If authenticated) ---
  return (
    <div style={{ backgroundColor: '#F4F4F9', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header & Export Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#333', margin: '0 0 5px 0', fontFamily: 'serif' }}>Guest Dashboard</h1>
            <p style={{ color: '#777', margin: 0 }}>Manage your RSVPs for Yasara & Anuruddha's Wedding</p>
          </div>
          
            {/* <a 
                href="http://127.0.0.1:8000/api/rsvp/export" 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#B59461', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(181, 148, 97, 0.2)' }}
            >
                <Download size={20} /> Export to Excel
            </a> */}

            <a 
                href="http://127.0.0.1:8000/api/rsvp/export-pdf" 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#B59461', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(181, 148, 97, 0.2)' }}
            >
                <FileText size={18} /> Export to PDF
            </a>
        </div>

        {/* Action Buttons */}
        {/* <div style={{ display: 'flex', gap: '10px' }}>
            <a 
                href="http://127.0.0.1:8000/api/rsvp/export" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(40, 167, 69, 0.2)' }}
            >
                <Download size={18} /> Export to Excel
            </a>

            <a 
                href="http://127.0.0.1:8000/api/rsvp/export-pdf" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(220, 53, 69, 0.2)' }}
            >
                <FileText size={18} /> Export to PDF
            </a>
        </div> */}

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { title: 'Total Attending', count: totalAttending, icon: <UserCheck size={24} color="#28a745" /> },
            { title: "Yasara's Side", count: yasaraSide, icon: <Heart size={24} color="#e83e8c" /> },
            { title: "Anuruddha's Side", count: anuruddhaSide, icon: <Users size={24} color="#007bff" /> },
            { title: 'Not Attending', count: totalDeclined, icon: <UserX size={24} color="#dc3545" /> }
          ].map((stat, index) => (
            <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#F8F9FA', borderRadius: '50%' }}>
                {stat.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '24px', color: '#333' }}>{stat.count}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Guest Data Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {loading ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading guests...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#F8F9FA', borderBottom: '2px solid #EAEAEA' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Name</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Phone</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Side</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Attending</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#333' }}>{rsvp.name}</td>
                      <td style={{ padding: '15px 20px', color: '#666' }}>{rsvp.phone}</td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ backgroundColor: rsvp.side === 'yasara' ? '#ffe8f0' : '#e8f4ff', color: rsvp.side === 'yasara' ? '#e83e8c' : '#007bff', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                          {rsvp.side}
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ backgroundColor: rsvp.attending === 'yes' ? '#e6f4ea' : '#fce8e6', color: rsvp.attending === 'yes' ? '#1e8e3e' : '#d93025', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                          {rsvp.attending}
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px', color: '#666', fontSize: '13px', maxWidth: '250px' }}>
                        {rsvp.message || '-'}
                      </td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No RSVPs yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;