import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-happy-pink text-white pt-6 pb-24 mt-auto relative text-xs z-10">
      {/* Linha Degradê Superior */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-happy-pink to-white" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="font-medium">&copy; 2025 Cristian Gadelha, João Beraldo, Pedro Henrique</p>
          </div>

          <div className="text-center md:text-right">
            <h5 className="font-bold uppercase mb-2 text-[0.8rem]">Mapa do Site</h5>
            <ul className="flex justify-center md:justify-end gap-4 list-none p-0 m-0">
              <li>
                <Link to="/" className="text-white hover:underline hover:text-happy-blue transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/info" className="text-white hover:underline hover:text-happy-blue transition-colors">Informações</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:underline hover:text-happy-blue transition-colors">Contato</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;