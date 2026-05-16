import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { MapPin, CalendarPlus, CheckCircle, Copy, Camera, Users, Heart, Mail, ArrowUp, Trash2 } from 'lucide-react';

// IMPORTANT: Import your images here! 
const HERO_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"; 
const YASARA_PIC = "3d-cartoon-style-character_23-2151034069.avif";
const ANURUDDHA_PIC = "Gemini_Generated_Image_ia7lbxia7lbxia7l.png";

// --- HELPER COMPONENT: COUNTDOWN TIMER ---
const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days || '00' },
    { label: 'HOURS', value: timeLeft.hours || '00' },
    { label: 'MINUTES', value: timeLeft.minutes || '00' },
    { label: 'SECONDS', value: timeLeft.seconds || '00' }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
      {timeBlocks.map((block, index) => (
        <div key={index} style={{ 
          backgroundColor: 'white', 
          border: '1px solid #EAEAEA', 
          borderRadius: '8px', 
          width: '80px', 
          height: '90px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }}>
          <span style={{ fontSize: '28px', fontFamily: 'serif', color: '#B59461', lineHeight: '1' }}>
            {block.value}
          </span>
          <span style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginTop: '5px' }}>
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const MainPage = () => {
  // --- REFS & SCROLL STATE FOR FLOATING BUTTON ---
  const rsvpRef = useRef(null);
  const [isAtRsvp, setIsAtRsvp] = useState(false);

  useEffect(() => {
    const currentRef = rsvpRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtRsvp(entry.isIntersecting);
      },
      { threshold: 0.3 } // Triggers when 30% of the RSVP section is visible
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const scrollToRsvpOrTop = () => {
    if (isAtRsvp) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      rsvpRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- STATE FOR TABS & DYNAMIC RSVP ---
  const [activeTab, setActiveTab] = useState('guests');
  const [copied, setCopied] = useState(false);
  
  const [rsvpData, setRsvpData] = useState({
    side: '',  
    name: '',
    phone: '', 
    message: '',
    attending: '', // Starts empty so they have to choose
    guestCount: '1',
    additionalGuests: [] // Stores extra names
  });

  const handleRsvpChange = (e) => {
    setRsvpData({ ...rsvpData, [e.target.name]: e.target.value });
  };

  // Handles changing the 1, 2, 3, 4, 5+ Dropdown
  const handleGuestCountChange = (e) => {
    const val = e.target.value;
    let newCount = val === '5+' ? 4 : parseInt(val) - 1; // Subtract 1 because the primary guest is already counted
    
    const currentGuests = [...rsvpData.additionalGuests];
    let newGuests = [];

    // Grow or shrink the input array while keeping typed names safe
    if (newCount > currentGuests.length) {
      const additions = Array(newCount - currentGuests.length).fill('');
      newGuests = [...currentGuests, ...additions];
    } else {
      newGuests = currentGuests.slice(0, newCount);
    }

    setRsvpData({ ...rsvpData, guestCount: val, additionalGuests: newGuests });
  };

  // Updates the name inside the dynamic extra inputs
  const handleAdditionalGuestChange = (index, value) => {
    const updated = [...rsvpData.additionalGuests];
    updated[index] = value;
    setRsvpData({ ...rsvpData, additionalGuests: updated });
  };

  // The "+ Add another guest" button function
  const addAnotherGuest = () => {
    setRsvpData({
      ...rsvpData,
      guestCount: '5+',
      additionalGuests: [...rsvpData.additionalGuests, '']
    });
  };

  // Removes a specific guest row
  const removeAdditionalGuest = (indexToRemove) => {
    // Filter out the guest at the specific index
    const updatedGuests = rsvpData.additionalGuests.filter((_, index) => index !== indexToRemove);
    
    // Auto-update the dropdown count to keep the UI in sync
    const newTotal = updatedGuests.length + 1;
    const newCountStr = newTotal >= 5 ? '5+' : newTotal.toString();

    setRsvpData({ 
      ...rsvpData, 
      guestCount: newCountStr, 
      additionalGuests: updatedGuests 
    });
  };

  // The Master Submit Engine
  const executeSubmit = async (finalData) => {
    // 1. Validation Check
    if (!finalData.side || !finalData.name || !finalData.phone) {
      Swal.fire({ title: 'Missing Info', text: 'Please fill in your Side, Name, and Phone number before deciding.', icon: 'warning', confirmButtonColor: '#B59461' });
      return;
    }

    try {
      // (This endpoint will need to be updated in the backend later to catch the array!)
      const response = await fetch('http://127.0.0.1:8000/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(finalData) 
      });

      if (response.ok) {
        Swal.fire({ title: 'Thank You!', text: `Your RSVP has been received, ${finalData.name}.`, icon: 'success', confirmButtonColor: '#B59461' });
        // Reset form
        setRsvpData({ side: '', name: '', phone: '', message: '', attending: '', guestCount: '1', additionalGuests: [] });
      } else {
        Swal.fire({ title: 'Oops...', text: 'There was a problem submitting your RSVP.', icon: 'error', confirmButtonColor: '#B59461' });
      }
    } catch (error) {
      Swal.fire({ title: 'Connection Error', text: 'Could not connect to the server.', icon: 'error', confirmButtonColor: '#B59461' });
    }
  };

  const handleYesSubmit = () => {
    executeSubmit({ ...rsvpData, attending: 'yes' });
  };

  const handleNoSubmit = () => {
    setRsvpData({ ...rsvpData, attending: 'no' }); // Update UI visually
    executeSubmit({ ...rsvpData, attending: 'no' }); // Send instantly
  };

  // const handleRsvpSubmit = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/api/rsvp', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //       body: JSON.stringify(rsvpData) 
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       // --- BEAUTIFUL SUCCESS ALERT ---
  //       Swal.fire({
  //         title: 'Thank You!',
  //         text: `We have received your RSVP, ${rsvpData.name}.`,
  //         icon: 'success',
  //         confirmButtonColor: '#B59461',
  //         confirmButtonText: 'Great!'
  //       });
        
  //       // Clear the form after successful submission
  //       setRsvpData({
  //         name: '',
  //         phone: '',
  //         side: '',
  //         attending: 'yes',
  //         message: ''
  //       });
        
  //     } else {
  //       // --- VALIDATION ERROR ALERT ---
  //       Swal.fire({
  //         title: 'Oops...',
  //         text: 'There was a problem submitting your RSVP. Please check the form.',
  //         icon: 'error',
  //         confirmButtonColor: '#B59461'
  //       });
  //       console.error("Validation Errors:", result.errors);
  //     }

  //   } catch (error) {
  //     // --- NETWORK ERROR ALERT ---
  //     Swal.fire({
  //       title: 'Connection Error',
  //       text: 'Could not connect to the server. Please try again later.',
  //       icon: 'error',
  //       confirmButtonColor: '#B59461'
  //     });
  //     console.error("Network Error:", error);
  //   }
  // };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("1234567890"); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  

  return (
    <div style={{ backgroundColor: '#FDFBF7', margin: 0, padding: 0, overflowX: 'hidden' }}>
      
      {/* --- HERO SECTION --- */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1 }} />

        <div style={{ zIndex: 2, padding: '20px' }}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
            style={{ fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}
          >
            Save The Date
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
            style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontFamily: 'serif', margin: '0 0 20px 0', textShadow: '2px 4px 10px rgba(0,0,0,0.3)' }}
          >
            Yasara <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(30px, 6vw, 60px)', margin: '0 15px' }}>&</span> Anuruddha
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontSize: '24px', fontFamily: 'serif' }}
          >
            <span>July</span>
            <span style={{ fontSize: '48px', borderLeft: '1px solid white', borderRight: '1px solid white', padding: '0 15px' }}>24</span>
            <span>2026</span>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: '40px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span style={{ fontSize: '10px', letterSpacing: '2px', border: '1px solid white', padding: '8px 20px', textTransform: 'uppercase' }}>
            Scroll Down
          </span>
        </motion.div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '10px' }}>Invite you to witness their union</h2>
        <p style={{ color: '#888', fontSize: '14px', maxWidth: '600px', margin: '0 auto 50px auto', lineHeight: '1.6' }}>
          Today marks the beginning of our forever. Built on love, trust, and endless laughter, our journey together is one we cherish deeply.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
          
          {/* Anuruddha Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer', backgroundColor: '#fff' }}
            >
              <img src={ANURUDDHA_PIC} alt="Anuruddha" style={{ width: '50%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              
              {/* Hover Quote Overlay */}
              <motion.div 
                variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(181, 148, 97, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}
              >
                <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '18px', lineHeight: '1.4' }}>
                  "My favorite place in all the world is next to you."
                </p>
              </motion.div>
            </motion.div>
            <h3 style={{ fontFamily: 'serif', fontSize: '24px', color: '#4A4A4A', marginTop: '20px', marginBottom: '10px' }}>Anuruddha</h3>
          </div>

          {/* Yasara Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer', backgroundColor: '#fff' }}
            >
              <img src={YASARA_PIC} alt="Yasara" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              <motion.div 
                variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(181, 148, 97, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}
              >
                <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '18px', lineHeight: '1.4' }}>
                  "I have found the one whom my soul loves."
                </p>
              </motion.div>
            </motion.div>
            <h3 style={{ fontFamily: 'serif', fontSize: '24px', color: '#4A4A4A', marginTop: '20px', marginBottom: '10px' }}>Yasara</h3>
          </div>
        </div>
      </section>

      {/* --- COUNTDOWN SECTION --- */}
      <section style={{ padding: '60px 20px', backgroundColor: '#F9F6F0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontFamily: 'serif', color: '#B59461', marginBottom: '40px' }}>The Countdown Begins</h2>
        <CountdownTimer targetDate="2026-07-24T08:30:00" />
      </section>

      {/* --- LOCATION & CALENDAR SECTION --- */}
      <section style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Join Us At</p>
        <h2 style={{ fontSize: '36px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '40px' }}>The Location</h2>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 20px', boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }}>
          <MapPin size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
          <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#333', marginBottom: '5px' }}>All Saints' Church</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>96 Ananda Rajakaruna Mawatha, Colombo 08, Sri Lanka.</p>
          
          <div style={{ display: 'inline-block', border: '1px solid #EAEAEA', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', color: '#888', marginBottom: '30px' }}>
            📅 8:30 AM to 11:30 AM
          </div>

          <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px', border: '1px solid #EAEAEA' }}>
            <iframe 
              title="All Saints Church Location"
              src="https://maps.google.com/maps?q=All%20Saints'%20Church,%20Borella&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
            <a 
              href="https://maps.app.goo.gl/BwF1s" 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#B59461', color: 'white', padding: '12px 25px', borderRadius: '5px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
            >
              <MapPin size={16} /> Open in Maps
            </a>
            
            <a 
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Yasara+%26+Anuruddha&dates=20260724T083000/20260724T113000&details=We+can't+wait+to+celebrate+with+you!&location=All+Saints'+Church,+Borella,+Sri+Lanka" 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#B59461', border: '1px solid #B59461', padding: '12px 25px', borderRadius: '5px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
            >
              <CalendarPlus size={16} /> Add to Calendar
            </a>
          </div>
        </div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section style={{ padding: '80px 20px', backgroundColor: '#FDFBF7', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Our Celebration</p>
        <h2 style={{ fontSize: '36px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '50px' }}>Timeline</h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', backgroundColor: '#EAEAEA', transform: 'translateX(-50%)' }} />

          {[
            { time: "8:30 AM", title: "Expected Arrival of Guests", desc: "Click for your Seat" },
            { time: "8:45 AM", title: "Groom's Arrival", desc: "The groom will arrive at the church" },
            { time: "8:55 AM", title: "Bride's Arrival", desc: "The bride will arrive at the church" },
            { time: "9:00 AM", title: "Wedding Service", desc: "Click for Hymnal" },
            { time: "10:10 AM", title: "Wedding Registration", desc: "Two hearts, two traditions, one lifelong journey." },
            { time: "10:20 AM", title: "Wedding March", desc: "The ceremony ended with smiles, blessings, and the joyful beginning of married life." },
            { time: "10.30 AM", title: "Blessings for the couple", desc: "Give your wishes to the couple and take a photo" }
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', width: '100%', marginBottom: '30px', position: 'relative', zIndex: 2 }}>
              <div style={{ flex: 1, textAlign: 'right', paddingRight: '30px' }}>
                {index % 2 === 0 ? (
                  <>
                    <span style={{ fontWeight: 'bold', color: '#B59461', fontSize: '14px' }}>{item.time}</span>
                    <h4 style={{ margin: '5px 0', fontSize: '18px', fontFamily: 'serif', color: '#333' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{item.desc}</p>
                  </>
                ) : null}
              </div>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#B59461', borderRadius: '50%', border: '4px solid #FDFBF7', margin: '0 auto', marginTop: '5px' }} />
              <div style={{ flex: 1, textAlign: 'left', paddingLeft: '30px' }}>
                {index % 2 !== 0 ? (
                  <>
                    <span style={{ fontWeight: 'bold', color: '#B59461', fontSize: '14px' }}>{item.time}</span>
                    <h4 style={{ margin: '5px 0', fontSize: '18px', fontFamily: 'serif', color: '#333' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{item.desc}</p>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- RSVP SECTION (DYNAMIC) --- */}
      <section ref={rsvpRef} style={{ padding: '80px 20px', backgroundColor: '#F9F6F0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Join Us</p>
          <h2 style={{ fontSize: '36px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '10px' }}>RSVP</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '40px' }}>Please let us know if you can join our celebration</p>

          {/* Changed to prevent default form submits so our custom buttons work */}
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>Which side are you from? *</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  type="button" onClick={() => setRsvpData({ ...rsvpData, side: 'yasara' })} 
                  style={{ flex: 1, padding: '15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', border: rsvpData.side === 'yasara' ? '2px solid #B59461' : '1px solid #DDD', backgroundColor: rsvpData.side === 'yasara' ? '#FDFBF7' : 'white', color: rsvpData.side === 'yasara' ? '#B59461' : '#555', fontWeight: rsvpData.side === 'yasara' ? 'bold' : 'normal', boxShadow: rsvpData.side === 'yasara' ? '0 4px 10px rgba(181, 148, 97, 0.2)' : 'none' }}
                >
                  Bride's Side (Yasara)
                </button>
                <button 
                  type="button" onClick={() => setRsvpData({ ...rsvpData, side: 'anuruddha' })} 
                  style={{ flex: 1, padding: '15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', border: rsvpData.side === 'anuruddha' ? '2px solid #B59461' : '1px solid #DDD', backgroundColor: rsvpData.side === 'anuruddha' ? '#FDFBF7' : 'white', color: rsvpData.side === 'anuruddha' ? '#B59461' : '#555', fontWeight: rsvpData.side === 'anuruddha' ? 'bold' : 'normal', boxShadow: rsvpData.side === 'anuruddha' ? '0 4px 10px rgba(181, 148, 97, 0.2)' : 'none' }}
                >
                  Groom's Side (Anuruddha)
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Your Name *</label>
              <input type="text" name="name" value={rsvpData.name} onChange={handleRsvpChange} placeholder="Enter your full name" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Telephone / WhatsApp No *</label>
              <input type="tel" name="phone" value={rsvpData.phone} onChange={handleRsvpChange} placeholder="+94 77 123 4567" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Message for the couple (Optional)</label>
              <textarea name="message" value={rsvpData.message} onChange={handleRsvpChange} placeholder="Share your wishes or any special requests..." rows="3" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>Will you attend? *</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={() => setRsvpData({ ...rsvpData, attending: 'yes' })} style={{ flex: 1, padding: '12px', borderRadius: '5px', border: rsvpData.attending === 'yes' ? '2px solid #B59461' : '1px solid #DDD', backgroundColor: rsvpData.attending === 'yes' ? '#FDFBF7' : 'white', cursor: 'pointer', color: '#555', fontWeight: rsvpData.attending === 'yes' ? 'bold' : 'normal' }}>
                  Yes, I'll be there!
                </button>
                {/* Clicking No instantly triggers the submit logic */}
                <button type="button" onClick={handleNoSubmit} style={{ flex: 1, padding: '12px', borderRadius: '5px', border: rsvpData.attending === 'no' ? '2px solid #B59461' : '1px solid #DDD', backgroundColor: rsvpData.attending === 'no' ? '#FDFBF7' : 'white', cursor: 'pointer', color: '#555', fontWeight: rsvpData.attending === 'no' ? 'bold' : 'normal' }}>
                  Sorry, I can't attend
                </button>
              </div>
            </div>

            {/* --- THE DYNAMIC "YES" SECTION --- */}
            {rsvpData.attending === 'yes' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
                
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #EAEAEA', marginTop: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>How many guests in your party? (Including yourself)</label>
                  <select value={rsvpData.guestCount} onChange={handleGuestCountChange} style={{ width: '100%', padding: '12px', marginTop: '10px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', backgroundColor: 'white' }}>
                    <option value="1">Just me (1)</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5+">5 or more Guests</option>
                  </select>

                  {/* Render extra name inputs dynamically */}
                  {rsvpData.additionalGuests.length > 0 && (
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {rsvpData.additionalGuests.map((guest, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                          
                          {/* Name Input */}
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888' }}>Guest {index + 2} Name</label>
                            <input 
                              type="text" 
                              value={guest} 
                              onChange={(e) => handleAdditionalGuestChange(index, e.target.value)} 
                              placeholder={`Full name of Guest ${index + 2}`} 
                              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px dashed #CCC', fontSize: '14px', boxSizing: 'border-box' }} 
                            />
                          </div>

                          {/* Delete Row Button */}
                          <button 
                            type="button" 
                            onClick={() => removeAdditionalGuest(index)} 
                            style={{ backgroundColor: '#fce8e6', color: '#dc3545', border: 'none', borderRadius: '5px', padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '41px', transition: 'background-color 0.2s' }}
                            title="Remove Guest"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add extra guest button (Only shows if they selected at least 2 guests) */}
                  {rsvpData.additionalGuests.length >= 1 && (
                    <button type="button" onClick={addAnotherGuest} style={{ width: '100%', backgroundColor: 'transparent', border: '1px dashed #B59461', color: '#B59461', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '15px' }}>
                      + Add another guest manually
                    </button>
                  )}
                </div>

                <button type="button" onClick={handleYesSubmit} style={{ backgroundColor: '#B59461', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                  Submit RSVP
                </button>
              </motion.div>
            )}

          </form>
        </div>
      </section>

      {/* --- INTERACTIVE TABS SECTION --- */}
      <section style={{ padding: '60px 20px', backgroundColor: '#FDFBF7', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
          {['guests', 'gallery', 'contributions'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: '1px solid #B59461',
                backgroundColor: activeTab === tab ? '#B59461' : 'transparent',
                color: activeTab === tab ? 'white' : '#B59461',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'guests' ? 'Who\'s Coming' : tab === 'gallery' ? 'Wedding Gallery' : 'Contributions'}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '200px' }}>
          {activeTab === 'guests' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Users size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '5px' }}>Who's Coming</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Join these wonderful people in celebrating with us.</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                {['Kamal', 'Nimali', 'Saman', 'Ruwan', 'Amali', 'Kasun'].map((name, i) => (
                  <div key={i} style={{ backgroundColor: '#E8C595', color: '#fff', padding: '10px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold' }}>
                    {name}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Camera size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '5px' }}>Wedding Gallery</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                Help us capture the magic! Upload your photos and videos to our shared album.
              </p>
              <a 
                href="https://photos.google.com/your-album-link" 
                target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', backgroundColor: '#333', color: 'white', padding: '12px 25px', borderRadius: '5px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
              >
                Open Google Photos
              </a>
            </motion.div>
          )}

          {activeTab === 'contributions' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Heart size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '5px' }}>Contribute a E Gift</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>
                Your love and blessings are the greatest gift. For those who wish to honor us with a gift, online transfer details are shared below.
              </p>

              <div style={{ backgroundColor: 'white', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '20px', textAlign: 'left', display: 'inline-block', width: '100%', maxWidth: '350px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}><strong>Bank:</strong> Commercial Bank</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}><strong>Name:</strong> Yasara & Anuruddha</p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9F6F0', padding: '10px 15px', borderRadius: '5px', marginTop: '15px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '16px', color: '#333', letterSpacing: '1px' }}>1234567890</span>
                  <button onClick={copyToClipboard} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#B59461', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                    {copied ? <CheckCircle size={16} color="green" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ backgroundColor: '#333', color: 'white', padding: '50px 20px 30px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'serif', margin: 0, fontSize: '28px', color: '#FDFBF7' }}>Yasara & Anuruddha</h2>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#B59461', marginTop: '10px', marginBottom: '30px' }}>
          July 24, 2026
        </p>
        
        <p style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', margin: '0 0 10px 0' }}>
          If you wish to give a shout-out, you may reach out:
        </p>
        
        {/* Contact Numbers Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: '#AAA', fontFamily: 'sans-serif' }}>
          <span>Yasara: +94 78 201 0532</span>
          <span style={{ color: '#555' }}>|</span>
          <span>Anuruddha (Sikura): +94 71 653 0165</span>
        </div>

        {/* Copyright (Optional but looks professional) */}
        <p style={{ fontSize: '10px', color: '#555', marginTop: '40px', letterSpacing: '1px' }}>
          © 2026 ALL RIGHTS RESERVED
        </p>
      </footer>

      {/* --- NEW: FLOATING ACTION BUTTON --- */}
      <motion.button
        onClick={scrollToRsvpOrTop}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#B59461',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        {isAtRsvp ? <ArrowUp size={28} /> : <Mail size={28} />}
      </motion.button>

    </div>
  );
};

export default MainPage;