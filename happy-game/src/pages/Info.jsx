import React, { useState } from 'react';

// Componente interno de Item do Acordeão
const AccordionItem = ({ title, isOpen, onClick, children }) => {
  return (
    <div className="mb-3 border border-happy-detail rounded-lg overflow-hidden bg-white">
      <button
        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors font-bold text-happy-dark"
        onClick={onClick}
      >
        {title}
        <span className={`transform transition-transform duration-200 text-happy-pink ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {/* Conteúdo do Acordeão com animação de altura */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 text-gray-600 text-sm leading-relaxed text-justify">
          {children}
        </div>
      </div>
    </div>
  );
};

const Info = () => {
  // Estado para controlar qual item está aberto (0, 1 ou 2)
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Logo Centralizada */}
      <div className="text-center mb-8">
        <img 
          src="/images/logo.png" 
          alt="Logo Happy Game" 
          className="w-32 h-auto mx-auto mb-4 p-2 bg-white rounded-2xl shadow-neon-blue"
        />
        <h2 className="text-2xl font-bold text-happy-pink">Informações do Projeto</h2>
      </div>

      {/* Lista de Acordeões */}
      <div className="space-y-2">
        
        <AccordionItem 
          title="Assistente de IA para E-commerce Gamer" 
          isOpen={openIndex === 0} 
          onClick={() => handleToggle(0)}
        >
          <p className="mb-3">
            O projeto consiste na criação de um <strong>e-commerce gamer integrado a inteligência artificial</strong>, 
            com foco em oferecer suporte e recomendações personalizadas. A proposta é utilizar a ascensão da IA 
            generativa para transformar a experiência de compra.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chatbot Inteligente:</strong> Recomendações personalizadas.</li>
            <li><strong>Visualização Limpa:</strong> Interface clara e responsiva.</li>
            <li><strong>Navegação Fluida:</strong> Menus organizados por categorias.</li>
          </ul>
        </AccordionItem>

        <AccordionItem 
          title="Receita do Mercado" 
          isOpen={openIndex === 1} 
          onClick={() => handleToggle(1)}
        >
          <p className="mb-3">
            O mercado movimenta mais de R$ 200 milhões ao ano. De <strong>2022 a 2025</strong>, 
            o setor de acessórios gamer cresceu significativamente.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-200">Ano</th>
                  <th className="p-2 border border-gray-200">Vendas (R$ Milhões)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border border-gray-200">2022</td><td className="p-2 border border-gray-200">R$ 175 mi</td></tr>
                <tr><td className="p-2 border border-gray-200">2023</td><td className="p-2 border border-gray-200">R$ 188 mi</td></tr>
                <tr><td className="p-2 border border-gray-200">2024</td><td className="p-2 border border-gray-200">R$ 215 mi</td></tr>
                <tr><td className="p-2 border border-gray-200">2025</td><td className="p-2 border border-gray-200">R$ 262 mi</td></tr>
              </tbody>
            </table>
          </div>
        </AccordionItem>

        <AccordionItem 
          title="Design e Tecnologia" 
          isOpen={openIndex === 2} 
          onClick={() => handleToggle(2)}
        >
          <h5 className="font-bold mb-1">Identidade Visual</h5>
          <p className="mb-3">
            A paleta utiliza <span className="text-happy-blue font-bold">Azul Neon</span> e 
            <span className="text-happy-pink font-bold"> Rosa Vibrante</span> para refletir o universo gamer moderno.
          </p>
          <h5 className="font-bold mb-1">Stack Tecnológica</h5>
          <p>
            O site foi reconstruído utilizando <strong>React</strong> para componentização e 
            <strong> Tailwind CSS v4</strong> para estilização rápida e responsiva.
          </p>
        </AccordionItem>

      </div>
    </div>
  );
};

export default Info;