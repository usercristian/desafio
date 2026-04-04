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
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

/* ───────────────── Accordion refatorado ───────────────── */
const AccordionItem = ({ title, icon, isOpen, onClick, children }) => {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <button
        className="w-full flex items-center justify-between gap-3 p-5 text-left group"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="text-lg font-bold text-happy-text group-hover:text-happy-pink transition-colors">
            {title}
          </span>
        </div>
        <span
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 text-xs
            ${isOpen
              ? 'bg-happy-pink text-white rotate-180'
              : 'bg-gray-100 text-gray-500 group-hover:bg-happy-pink/10 group-hover:text-happy-pink'
            }`}
        >
          ▼
        </span>
      </button>

      <div
        className={`transition-all duration-400 ease-in-out overflow-hidden ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-6 pt-0 text-gray-600 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
};

/* ───────────────── Stat badge ───────────────── */
const StatBadge = ({ label, value, accent = false }) => (
  <div className={`flex flex-col items-center justify-center rounded-2xl p-4 min-w-[120px] border ${accent ? 'bg-happy-pink/5 border-happy-pink/20' : 'bg-happy-blue/5 border-happy-blue/20'}`}>
    <span className={`text-2xl font-bold ${accent ? 'text-happy-pink' : 'text-happy-blue'}`}>{value}</span>
    <span className="text-xs text-gray-500 mt-1 text-center">{label}</span>
  </div>
);

/* ───────────────── Componente principal ───────────────── */
const Info = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  /* ── Dados do gráfico 1: Rendimento ── */
  const rendimentoInicial = 50;
  const taxaCrescimento = 0.15;
  const marcosUsuarios = [0, 10, 20, 30, 40, 50, 60];
  const rendimentos = marcosUsuarios.map((_, index) =>
    Math.round(rendimentoInicial * Math.pow(1 + taxaCrescimento, index))
  );

  const lineChartData = {
    labels: marcosUsuarios.map(u => `${u}k`),
    datasets: [
      {
        label: 'Projeção de Rendimento (R$ mil)',
        data: rendimentos,
        borderColor: '#05d9e8',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, 'rgba(5, 217, 232, 0.25)');
          gradient.addColorStop(1, 'rgba(5, 217, 232, 0.02)');
          return gradient;
        },
        fill: true,
        pointBackgroundColor: '#ff2a6d',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1c1c1c',
        titleColor: '#fff',
        bodyColor: '#d1f7ff',
        borderColor: '#05d9e8',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx) => ` R$ ${ctx.parsed.y} mil`,
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f3f4f6', borderDash: [4, 4] },
        ticks: { color: '#9ca3af', font: { size: 11 } },
        beginAtZero: true,
      }
    }
  };

  /* ── Dados do gráfico 2: Crescimento logístico ── */
  const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const maxUsuarios = 100;
  const taxaK = 0.8;
  const pontoInflexao = 6;
  const crescimentoUsuarios = meses.map(m =>
    Math.round(maxUsuarios / (1 + Math.exp(-taxaK * (m - pontoInflexao))))
  );

  const growthChartData = {
    labels: meses.map(m => `Mês ${m}`),
    datasets: [
      {
        label: 'Usuários Ativos e Retidos (milhares)',
        data: crescimentoUsuarios,
        borderColor: '#ff2a6d',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, 'rgba(255, 42, 109, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 42, 109, 0.02)');
          return gradient;
        },
        fill: true,
        pointBackgroundColor: '#05d9e8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
        tension: 0.4,
      }
    ]
  };

  const growthChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1c1c1c',
        titleColor: '#fff',
        bodyColor: '#fcd5e3',
        borderColor: '#ff2a6d',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} mil usuários`,
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f3f4f6', borderDash: [4, 4] },
        ticks: { color: '#9ca3af', font: { size: 11 } },
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* ── Card principal ── */}
      <div className="bg-white rounded-[20px] shadow-[0_0_30px_rgba(5,217,232,0.08)] border border-gray-100 overflow-hidden">

        {/* ── Header com gradiente (igual Security) ── */}
        <div className="bg-gradient-to-r from-happy-pink to-happy-blue text-white p-8 pb-10 relative overflow-hidden">
          {/* Círculos decorativos de fundo */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"></div>
          <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/5"></div>

          <div className="relative flex items-center gap-5 mb-6">
            <img
              src="/images/logo.png"
              alt="Logo Happy Game"
              className="w-20 h-20 p-2 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.25em] opacity-80 mb-1">Sobre o projeto</p>
              <h1 className="text-3xl font-bold mb-1">Informações do Projeto</h1>
              <p className="text-sm md:text-base opacity-90 max-w-xl">
                Conheça a visão, as projeções e a tecnologia por trás da plataforma Happy Game.
              </p>
            </div>
          </div>

          {/* ── Badges de destaque (dentro do header) ── */}
          <div className="relative flex flex-wrap gap-3 justify-center md:justify-start">
            {[
              { label: 'Stack', value: 'React' },
              { label: 'Estilo', value: 'Tailwind' },
              { label: 'IA Integrada', value: 'ChatBot' },
              { label: 'Crescimento', value: '+15%' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center justify-center rounded-xl px-5 py-2.5 min-w-[100px] bg-white/15 backdrop-blur-sm border border-white/20">
                <span className="text-lg font-bold text-white">{badge.value}</span>
                <span className="text-[11px] text-white/70 mt-0.5">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Conteúdo em acordeão ── */}
        <div className="p-6 md:p-8 space-y-4 mt-4">

          {/* Seção 1 ─ Sobre */}
          <AccordionItem
            title="Assistente de IA para E-commerce Gamer"
            icon="🤖"
            isOpen={openIndex === 0}
            onClick={() => handleToggle(0)}
          >
            <p className="mb-4 text-[15px]">
              O projeto consiste na criação de um <strong>e-commerce gamer integrado a inteligência artificial</strong>,
              com foco em oferecer suporte e recomendações personalizadas. A proposta é utilizar a ascensão da IA
              generativa para transformar a experiência de compra.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: '💬', title: 'Chatbot Inteligente', desc: 'Recomendações personalizadas e assistência em tempo real.' },
                { icon: '🎨', title: 'Visualização Limpa', desc: 'Interface moderna, focada no usuário final.' },
                { icon: '🧭', title: 'Navegação Fluida', desc: 'Menus otimizados para facilitar a conversão.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center hover:border-happy-blue/40 hover:shadow-sm transition-all duration-200"
                >
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <h4 className="font-bold text-happy-text text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Seção 2 ─ Projeções */}
          <AccordionItem
            title="Projeções de Rendimento e Engajamento"
            icon="📈"
            isOpen={openIndex === 1}
            onClick={() => handleToggle(1)}
          >
            {/* Rendimento */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-happy-text mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-happy-blue inline-block"></span>
                Crescimento Exponencial de Rendimento
              </h3>
              <p className="mb-4 text-[15px]">
                Em negócios digitais com forte apelo à comunidade, o crescimento raramente é linear.
                Aplicamos uma <strong>modelagem matemática exponencial</strong> para prever como o rendimento
                se comporta à medida que a base de clientes ativos aumenta.
              </p>

              <div className="bg-gradient-to-r from-happy-blue/5 to-happy-pink/5 border border-gray-100 rounded-xl p-4 mb-5">
                <p className="text-center font-mono text-lg text-happy-dark font-bold tracking-wide">
                  R(t) = 50 × (1.15)<sup>t</sup>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  {[
                    { var: 'R(t)', desc: 'Rendimento em R$ mil' },
                    { var: '50', desc: 'Faturamento base' },
                    { var: '1.15', desc: 'Taxa de +15%' },
                    { var: 't', desc: 'Marco de 10k users' },
                  ].map((item, i) => (
                    <div key={i} className="text-center bg-white/60 rounded-lg py-2 px-1">
                      <span className="font-mono font-bold text-happy-pink text-sm">{item.var}</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-happy-blue">Rendimento × Usuários</span>
                  <span className="text-[11px] text-gray-400">Projeção exponencial</span>
                </div>
                <div className="w-full h-72">
                  <Line
                    data={lineChartData}
                    options={chartOptions}
                    role="img"
                    aria-label="Gráfico de linha mostrando a projeção exponencial crescente do faturamento."
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <span className="text-xs text-gray-400 uppercase tracking-widest">Tendência</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>

            {/* Retenção */}
            <div>
              <h3 className="text-lg font-bold text-happy-text mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-happy-pink inline-block"></span>
                Tendência e Retenção de Usuários
              </h3>
              <p className="mb-4 text-[15px]">
                Para prever o <strong>crescimento de usuários</strong> e os níveis de engajamento ao longo de um ano,
                aplicamos uma modelagem baseada no <strong>Crescimento Logístico (Curva S)</strong>. Esta função interpreta
                o ciclo natural de adoção em três fases: tração inicial lenta, aumento de engajamento acelerado e a
                consequente suavização de adoção.
              </p>

              <div className="bg-gradient-to-r from-happy-pink/5 to-happy-blue/5 border border-gray-100 rounded-xl p-4 mb-5">
                <p className="text-center font-mono text-lg text-happy-dark font-bold tracking-wide">
                  U(t) = L / (1 + e<sup className="-top-1 text-sm relative">-k(t - t₀)</sup>)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  {[
                    { var: 'U(t)', desc: 'Usuários retidos (mil)' },
                    { var: 'L = 100', desc: 'Limite projetado' },
                    { var: 'k = 0.8', desc: 'Agressividade' },
                    { var: 't₀ = 6', desc: 'Ponto de inflexão' },
                  ].map((item, i) => (
                    <div key={i} className="text-center bg-white/60 rounded-lg py-2 px-1">
                      <span className="font-mono font-bold text-happy-blue text-sm">{item.var}</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-happy-pink">Retenção × Tempo</span>
                  <span className="text-[11px] text-gray-400">Curva logística (S)</span>
                </div>
                <div className="w-full h-72">
                  <Line
                    data={growthChartData}
                    options={growthChartOptions}
                    role="img"
                    aria-label="Gráfico ilustrando a curva em S de adoção e retenção ao longo do tempo."
                  />
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Seção 3 ─ Design e Tecnologia */}
          <AccordionItem
            title="Design e Tecnologia"
            icon="⚡"
            isOpen={openIndex === 2}
            onClick={() => handleToggle(2)}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Identidade Visual */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h4 className="font-bold text-happy-text mb-3 flex items-center gap-2">
                  <span className="text-lg">🎨</span> Identidade Visual
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  A paleta utiliza cores vibrantes para refletir a estética contemporânea do universo gamer.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-blue shadow-sm"></div>
                    <span className="text-[10px] text-gray-400 mt-1">Azul Neon</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-pink shadow-sm"></div>
                    <span className="text-[10px] text-gray-400 mt-1">Rosa Vibrante</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-dark shadow-sm"></div>
                    <span className="text-[10px] text-gray-400 mt-1">Dark</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-detail border border-gray-100 shadow-sm"></div>
                    <span className="text-[10px] text-gray-400 mt-1">Detalhe</span>
                  </div>
                </div>
              </div>

              {/* Stack Tecnológica */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h4 className="font-bold text-happy-text mb-3 flex items-center gap-2">
                  <span className="text-lg">🛠️</span> Stack Tecnológica
                </h4>
                <div className="space-y-2">
                  {[
                    { name: 'React', desc: 'Componentes modulares', color: 'bg-happy-blue' },
                    { name: 'Tailwind CSS v4', desc: 'Estilização ágil', color: 'bg-happy-pink' },
                    { name: 'Chart.js', desc: 'Visualizações de dados', color: 'bg-happy-blue' },
                    { name: 'Node.js', desc: 'Backend e APIs', color: 'bg-happy-pink' },
                  ].map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-50">
                      <span className={`w-2 h-2 rounded-full ${tech.color}`}></span>
                      <div>
                        <span className="font-bold text-sm text-happy-text">{tech.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{tech.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionItem>

        </div>
      </div>
    </div>
  );
};

export default Info;