import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter } from 'lucide-react';

// IMPORTANT: Import your images here! 
// Replace these with your actual image paths once you have them.
const HERO_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"; 
const YASARA_PIC = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const ANURUDDHA_PIC = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

const MainPage = () => {
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
        {/* Dark overlay to make text readable */}
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

        {/* Scroll Down Indicator */}
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
          
          {/* Yasara Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
            >
              <img src={YASARA_PIC} alt="Yasara" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Hover Quote Overlay */}
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

          {/* Anuruddha Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
            >
              <img src={ANURUDDHA_PIC} alt="Anuruddha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
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
            <div style={{ display: 'flex', gap: '15px', color: '#B59461' }}>
              <Instagram size={20} style={{ cursor: 'pointer' }} />
              <Twitter size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default MainPage;