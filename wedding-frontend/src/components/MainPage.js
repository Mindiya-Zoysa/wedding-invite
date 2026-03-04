import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, MapPin, CalendarPlus, CheckCircle, Copy, Camera, Users, Heart, Mail, ArrowUp } from 'lucide-react';

// IMPORTANT: Import your images here! 
const HERO_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"; 
const YASARA_PIC = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const ANURUDDHA_PIC = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

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

  // --- STATE FOR TABS & RSVP ---
  const [activeTab, setActiveTab] = useState('guests');
  const [copied, setCopied] = useState(false);
  
  const [rsvpData, setRsvpData] = useState({
    name: '',
    phone: '', // Changed from email to phone
    side: '',  // Added to track which side they are from
    attending: 'yes',
    message: ''
  });

  const handleRsvpChange = (e) => {
    setRsvpData({ ...rsvpData, [e.target.name]: e.target.value });
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    console.log("RSVP Data Submitted:", rsvpData);
    alert(`Thank you, ${rsvpData.name}! Your RSVP has been received.`);
  };

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
            <span>April</span>
            <span style={{ fontSize: '48px', borderLeft: '1px solid white', borderRight: '1px solid white', padding: '0 15px' }}>11</span>
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
        <h2 style={{ fontSize: '32px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '10px' }}>We Are Getting Married</h2>
        <p style={{ color: '#888', fontSize: '14px', maxWidth: '600px', margin: '0 auto 50px auto', lineHeight: '1.6' }}>
          Today marks the beginning of our forever. Built on love, trust, and endless laughter, our journey together is one we cherish deeply.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
            >
              <img src={YASARA_PIC} alt="Yasara" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <div style={{ display: 'flex', gap: '15px', color: '#B59461' }}>
              <Instagram size={20} style={{ cursor: 'pointer' }} />
              <Facebook size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
            >
              <img src={ANURUDDHA_PIC} alt="Anuruddha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <div style={{ display: 'flex', gap: '15px', color: '#B59461' }}>
              <Instagram size={20} style={{ cursor: 'pointer' }} />
              <Twitter size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      </section>

      {/* --- COUNTDOWN SECTION --- */}
      <section style={{ padding: '60px 20px', backgroundColor: '#F9F6F0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontFamily: 'serif', color: '#B59461', marginBottom: '40px' }}>The Countdown Begins</h2>
        <CountdownTimer targetDate="2026-04-11T00:00:00" />
      </section>

      {/* --- LOCATION & CALENDAR SECTION --- */}
      <section style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Join Us At</p>
        <h2 style={{ fontSize: '36px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '40px' }}>The Location</h2>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 20px', boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }}>
          <MapPin size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
          <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#333', marginBottom: '5px' }}>Your Beautiful Venue Name</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>123 Wedding Road, City, Country</p>
          
          <div style={{ display: 'inline-block', border: '1px solid #EAEAEA', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', color: '#888', marginBottom: '30px' }}>
            📅 4:00 PM to 11:00 PM
          </div>

          <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px', border: '1px solid #EAEAEA' }}>
            <iframe 
              title="Wedding Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9!2d79.85!3d6.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMTIuMCJOIDc5wrA1MScwMC4wIkU!5e0!3m2!1sen!2slk!4v1600000000000!5m2!1sen!2slk" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
            <a 
              href="https://goo.gl/maps/your-link-here" 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#B59461', color: 'white', padding: '12px 25px', borderRadius: '5px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
            >
              <MapPin size={16} /> Open in Maps
            </a>
            
            <a 
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Yasara+%26+Anuruddha&dates=20260411T103000Z/20260411T173000Z&details=We+can't+wait+to+celebrate+with+you!&location=Your+Venue+Name" 
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
            { time: "5:00 PM", title: "Guest Arrival", desc: "Welcome drinks and canapés" },
            { time: "5:30 PM", title: "The Ceremony", desc: "Exchange of vows" },
            { time: "6:30 PM", title: "Drinks & Photos", desc: "Drinks and hors d'oeuvres in the garden" },
            { time: "7:30 PM", title: "Dinner", desc: "Three-course dinner" },
            { time: "9:30 PM", title: "First Dance", desc: "Couple's first dance" },
            { time: "11:00 PM", title: "Going Away", desc: "Thank you for celebrating with us" }
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

      {/* --- RSVP SECTION (UPDATED) --- */}
      <section ref={rsvpRef} style={{ padding: '80px 20px', backgroundColor: '#F9F6F0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Join Us</p>
          <h2 style={{ fontSize: '36px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '10px' }}>RSVP</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '40px' }}>Please let us know if you can join our celebration</p>

          <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            
            {/* NEW: Which Side Selection */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>Which side are you from? *</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  type="button" 
                  onClick={() => setRsvpData({ ...rsvpData, side: 'yasara' })} 
                  style={{ 
                    flex: 1, padding: '15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease',
                    border: rsvpData.side === 'yasara' ? '2px solid #B59461' : '1px solid #DDD', 
                    backgroundColor: rsvpData.side === 'yasara' ? '#FDFBF7' : 'white', 
                    color: rsvpData.side === 'yasara' ? '#B59461' : '#555', 
                    fontWeight: rsvpData.side === 'yasara' ? 'bold' : 'normal',
                    boxShadow: rsvpData.side === 'yasara' ? '0 4px 10px rgba(181, 148, 97, 0.2)' : 'none'
                  }}
                >
                  Bride's Side (Yasara)
                </button>
                <button 
                  type="button" 
                  onClick={() => setRsvpData({ ...rsvpData, side: 'anuruddha' })} 
                  style={{ 
                    flex: 1, padding: '15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease',
                    border: rsvpData.side === 'anuruddha' ? '2px solid #B59461' : '1px solid #DDD', 
                    backgroundColor: rsvpData.side === 'anuruddha' ? '#FDFBF7' : 'white', 
                    color: rsvpData.side === 'anuruddha' ? '#B59461' : '#555', 
                    fontWeight: rsvpData.side === 'anuruddha' ? 'bold' : 'normal',
                    boxShadow: rsvpData.side === 'anuruddha' ? '0 4px 10px rgba(181, 148, 97, 0.2)' : 'none'
                  }}
                >
                  Groom's Side (Anuruddha)
                </button>
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Your Name *</label>
              <input type="text" name="name" required value={rsvpData.name} onChange={handleRsvpChange} placeholder="Enter your full name" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            {/* NEW: Telephone Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Telephone / WhatsApp No *</label>
              <input type="tel" name="phone" required value={rsvpData.phone} onChange={handleRsvpChange} placeholder="+94 77 123 4567" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>Will you attend? *</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={() => setRsvpData({ ...rsvpData, attending: 'yes' })} style={{ flex: 1, padding: '12px', borderRadius: '5px', border: rsvpData.attending === 'yes' ? '2px solid #B59461' : '1px solid #DDD', backgroundColor: rsvpData.attending === 'yes' ? '#FDFBF7' : 'white', cursor: 'pointer', color: '#555', fontWeight: rsvpData.attending === 'yes' ? 'bold' : 'normal' }}>
                  Yes, I'll be there!
                </button>
                <button type="button" onClick={() => setRsvpData({ ...rsvpData, attending: 'no' })} style={{ flex: 1, padding: '12px', borderRadius: '5px', border: rsvpData.attending === 'no' ? '2px solid #B59461' : '1px solid #DDD', backgroundColor: rsvpData.attending === 'no' ? '#FDFBF7' : 'white', cursor: 'pointer', color: '#555', fontWeight: rsvpData.attending === 'no' ? 'bold' : 'normal' }}>
                  Sorry, I can't attend
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Message for the couple (Optional)</label>
              <textarea name="message" value={rsvpData.message} onChange={handleRsvpChange} placeholder="Share your wishes or any special requests..." rows="4" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
            </div>

            <button type="submit" style={{ backgroundColor: '#B59461', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.3s' }}>
              Submit RSVP
            </button>
          </form>
        </div>
      </section>

      {/* --- INTERACTIVE TABS SECTION --- */}
      <section style={{ padding: '60px 20px', backgroundColor: '#FDFBF7', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
          {['guests', 'gallery', 'honeymoon'].map((tab) => (
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
              {tab === 'guests' ? 'Who\'s Coming' : tab === 'gallery' ? 'Wedding Gallery' : 'Honeymoon Fund'}
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

          {activeTab === 'honeymoon' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Heart size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '5px' }}>Contribute to our Honeymoon</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>
                Your presence is our greatest gift, but if you wish to contribute to our honeymoon, you can use the details below.
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
      <footer style={{ backgroundColor: '#333', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'serif', margin: 0, fontSize: '24px' }}>Yasara & Anuruddha</h2>
        <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#AAA', marginTop: '10px' }}>April 11, 2026</p>
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