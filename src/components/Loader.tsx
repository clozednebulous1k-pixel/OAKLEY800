import React, { useEffect, useState } from 'react';

export const Loader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // Wait for the animation to finish
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-wrapper" style={{ transition: 'opacity 0.5s ease', opacity: loading ? 1 : 0, pointerEvents: loading ? 'all' : 'none' }}>
      <div className="loader-text" data-text="OAKLEY">OAKLEY</div>
    </div>
  );
};
