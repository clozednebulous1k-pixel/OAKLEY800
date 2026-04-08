import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

export const SiteHeader = () => (
  <motion.header
    className="site-header"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 2.8 }}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 'var(--page-pad-x)',
      paddingRight: 'var(--page-pad-x)',
      mixBlendMode: 'difference',
    }}
  >
    <div
      className="site-header__logo"
      style={{ fontWeight: 900, letterSpacing: '-1px', color: '#fff' }}
    >
      OAKLEY<span style={{ color: 'var(--oakley-red)' }}>.</span>
    </div>
    <Link
      to="/admin/login"
      className="site-header__admin-link"
      aria-label="Área do administrador — login"
    >
      <LogIn size={20} strokeWidth={2.2} aria-hidden />
      <span className="site-header__admin-text">Login</span>
    </Link>
  </motion.header>
);
