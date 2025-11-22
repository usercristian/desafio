import React from 'react';
import { useNavigate } from 'react-router-dom';

// Dados simulados baseados no my_purchases.html
const purchases = [
  {
    id: 1,
    date: '10/10/2025',
    product: 'Teclado gamer mecânico RAZER',
    image: '/images/Teclado.3.png',
    status: 'Entregue',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    date: '04/09/2025',
    product: 'Cadeira ergonômica para Home Office',
    image: '/images/Cadeira.3.png',
    status: 'Pendente',
    statusColor: 'bg-yellow-100 text-yellow-800'
  }
];

const MyPurchases = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h2 className="text-2xl font-bold text-happy-text mb-6 pl-2 border-l-4 border-happy-pink">Minhas Compras</h2>

      <div className="space-y-6">
        {purchases.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-card">
            {/* Cabeçalho do Card */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <span className="font-bold text-gray-700">{item.date}</span>
              <button className="text-sm font-bold text-happy-pink hover:text-happy-pink-dark hover:underline">
                Comprar novamente
              </button>
            </div>

            {/* Corpo do Card */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <img 
                src={item.image} 
                alt={item.product} 
                className="w-32 h-32 object-contain border border-gray-100 rounded-lg p-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/evaluation')} // Clicar na imagem leva à avaliação
              />
              
              <div className="flex-grow text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="text-gray-500 text-sm">Entrega:</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-1">{item.product}</h4>
                <p className="text-gray-500 text-sm">Quantidade: 1</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPurchases;