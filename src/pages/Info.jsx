import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler // Importante: importamos o Filler para preencher a área abaixo da linha
} from 'chart.js';

// Registramos o Filler aqui também
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const AccordionItem = ({ title, isOpen, onClick, children }) => {
  return (
    <div className="mb-3 border border-happy-detail rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors font-bold text-happy-dark"
        onClick={onClick}
      >
        {title}
        <span className={`transform transition-transform duration-200 text-happy-pink ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1200px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
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
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const rendimentoInicial = 50; 
  const taxaCrescimento = 0.15; 
  const marcosUsuarios = [0, 10, 20, 30, 40, 50, 60]; 

  const rendimentos = marcosUsuarios.map((_, index) => Math.round(rendimentoInicial * Math.pow(1 + taxaCrescimento, index)));

  const lineChartData = {
    labels: marcosUsuarios.map(u => `${u}k Usuários`),
    datasets: [
      {
        label: 'Projeção de Rendimento (R$ mil)',
        data: rendimentos,
        borderColor: '#00eaff', // Azul Neon na linha principal
        backgroundColor: 'rgba(0, 234, 255, 0.2)', // Azul Neon translúcido para o fundo
        fill: true, // Isso cria o preenchimento charmoso abaixo da linha
        pointBackgroundColor: '#ff2bd6', // Rosa Vibrante nas bolinhas
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2, // Bordinha branca nas bolinhas para destacar
        pointRadius: 5, // Tamanho normal da bolinha
        pointHoverRadius: 7, // Fica um pouco maior quando passa o mouse
        borderWidth: 3,
        tension: 0.4, // Mantém a curva suave
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 14, weight: 'bold' },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip escura pra contrastar
        padding: 10,
        callbacks: {
          label: function(context) {
            return ` R$ ${context.parsed.y} mil`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    scales: {
      // Configuração do eixo X (embaixo)
      x: {
        grid: {
          display: false, // Esconde as linhas verticais para ficar mais "clean"
        }
      },
      // Configuração do eixo Y (lateral)
      y: {
        grid: {
          color: '#e5e7eb', // Cor bem clarinha
          borderDash: [5, 5] // Deixa as linhas horizontais tracejadas
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">

      <div className="text-center mb-8">
        <img 
          src="/images/logo.png" 
          alt="Logo Happy Game" 
          className="w-32 h-auto mx-auto mb-4 p-2 bg-white rounded-2xl shadow-neon-blue"
        />
        <h2 className="text-2xl font-bold text-happy-pink">Informações do Projeto</h2>
      </div>

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
            <li><strong>Chatbot Inteligente:</strong> Recomendações personalizadas e assistência em tempo real.</li>
            <li><strong>Visualização Limpa:</strong> Interface moderna, focada no usuário final.</li>
            <li><strong>Navegação Fluida:</strong> Menus otimizados e organizados para facilitar a conversão.</li>
          </ul>
        </AccordionItem>

        <AccordionItem 
          title="Projeção de Rendimento por Usuários" 
          isOpen={openIndex === 1} 
          onClick={() => handleToggle(1)}
        >
          <p className="mb-4">
            Em negócios digitais com forte apelo à comunidade (como o mercado gamer), o crescimento raramente é linear. 
            Aplicamos uma <strong>modelagem matemática exponencial</strong> para prever como o rendimento da plataforma 
            se comporta à medida que a base de clientes ativos aumenta.
          </p>

          <p className="mb-4">
            Utilizamos a seguinte função para refletir o <em>efeito de rede</em> e a recorrência de compras impulsionada pelas recomendações da IA:
          </p>

          <p className="bg-gray-100 p-3 rounded text-center font-mono text-lg mb-4 text-happy-dark shadow-inner">
            R(t) = 50 × (1.15)^t
          </p>

          <ul className="list-disc pl-5 mb-8 space-y-2">
            <li><strong>R(t):</strong> Representa a projeção do rendimento em milhares de reais.</li>
            <li><strong>50:</strong> É o nosso faturamento base estimado (R$ 50 mil).</li>
            <li><strong>1.15:</strong> Representa uma taxa de crescimento acelerada de <strong>15%</strong>.</li>
            <li><strong>t:</strong> É a variável de tempo/escala, onde cada unidade representa um marco de <strong>10 mil novos usuários</strong> cadastrados.</li>
          </ul>

          <div className="w-full max-w-lg mx-auto h-80 pb-6">
            <Line data={lineChartData} options={chartOptions} />
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
            <span className="text-happy-pink font-bold"> Rosa Vibrante</span> para refletir a estética contemporânea do universo gamer.
          </p>
          <h5 className="font-bold mb-1">Stack Tecnológica</h5>
          <p>
            O site foi desenvolvido utilizando <strong>React</strong> para a estruturação modular dos componentes e 
            <strong> Tailwind CSS v4</strong> para garantir uma estilização ágil, moderna e totalmente responsiva.
          </p>
        </AccordionItem>

      </div>
    </div>
  );
};

export default Info;