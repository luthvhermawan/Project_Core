import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-[#b09744] text-center py-4 mt-8">
      <p>&copy; {new Date().getFullYear()} Amorty Billiards Training Ground. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
