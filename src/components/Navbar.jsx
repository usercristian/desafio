import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Substitui o <a href> para não recarregar a página
import { FaBars, FaTimes } from 'react-icons/fa'; // Ícones de menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");


  // Função para alternar o menu no mobile
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header>
      <nav className="bg-happy-pink border-b-4 border-happy-blue py-3 fixed w-full top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 bg-white py-1 px-3 rounded-full shadow-md transition-transform hover:scale-105">
              {/* Certifique-se de que a imagem existe em public/images/logo.png */}
              <img src="/images/logo.png" alt="Happy Game Logo" className="h-8 w-auto" />
              {/* Oculta o texto em telas muito pequenas, mostra em md (tablet) pra cima */}
              <span className="text-happy-blue font-bold text-lg hidden md:block">
                Happy Game
              </span>
            </Link>

            {/* MENU DESKTOP (Escondido em telas pequenas 'hidden', visível em 'md:flex') */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/">Início</NavLink>
              <NavLink to="/info">Informações</NavLink>
              <NavLink to="/contact">Contato</NavLink>

              {isLoggedIn && (
                <NavLink to="/my-purchases">Minhas Compras</NavLink>
              )}

              {!isLoggedIn && (
                <NavLink to="/login" isButton>Entrar</NavLink>
              )}

            </div>

            {/* BOTÃO HAMBURGUER (Visível apenas no Mobile) */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white text-2xl focus:outline-none"
              aria-label="Abrir navegação"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* MENU MOBILE (Expandível) */}
          {isOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 bg-happy-pink-dark rounded-lg p-4 shadow-inner animate-fade-in">
              <MobileNavLink to="/" onClick={toggleMenu}>Início</MobileNavLink>
              <MobileNavLink to="/info" onClick={toggleMenu}>Informações</MobileNavLink>
              <MobileNavLink to="/contact" onClick={toggleMenu}>Contato</MobileNavLink>

              {isLoggedIn && (
                <MobileNavLink to="/my-purchases" onClick={toggleMenu}>
                  Minhas Compras
                </MobileNavLink>
              )}

              {!isLoggedIn && (
                <MobileNavLink to="/login" onClick={toggleMenu} isButton>
                  Entrar
                </MobileNavLink>
              )}
              
            </div>
          )}
        </div>
      </nav>
      { }
      <div className="h-[70px]"></div>
    </header>
  );
};

// Componente auxiliar para Links Desktop
const NavLink = ({ to, children, isButton }) => {
  if (isButton) {
    return (
      <Link to={to} className="bg-white text-happy-pink font-bold py-1 px-4 rounded-full hover:bg-happy-blue hover:text-white transition-colors duration-300 shadow-sm">
        {children}
      </Link>
    );
  }
  return (
    <Link to={to} className="text-white font-medium hover:text-happy-blue hover:underline transition-colors duration-200">
      {children}
    </Link>
  );
};

// Componente auxiliar para Links Mobile
const MobileNavLink = ({ to, children, onClick, isButton }) => {
  const baseClasses = "block text-white text-center py-2 rounded-md transition-colors";
  const hoverClasses = "hover:bg-happy-pink hover:text-white";
  const buttonClasses = "bg-white text-happy-pink font-bold mx-4";

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${baseClasses} ${isButton ? buttonClasses : hoverClasses}`}
    >
      {children}
    </Link>
  );
};

export default Navbar;