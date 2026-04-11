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
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        grid: { color: '#f3f4f6', borderDash: [4, 4] },
        ticks: { color: '#6b7280', font: { size: 12 } },
        beginAtZero: true,
      }
    }
  };

  /* ── Dados do gráfico 2: Cliente x Receita — Função Racional ── */
  /* R(c) = (-250c³ + 750c² + 1000c) / (-c² + 4c)
     Fatoração:
       Numerador: -250c(c² - 3c - 4) = -250c(c + 1)(c - 4)
       Denominador: -c(c - 4)
     Simplificação (cancela c e (c - 4)):
       R(c) = 250(c + 1)
     Limite: lim c→4 R(c) = 250(4 + 1) = 250 × 5 = 1250
     R(4) não existe (denominador = 0), mas o limite é R$ 1.250/h */
  const clientes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const calcReceita = (c) => {
    const numerador = -250 * Math.pow(c, 3) + 750 * Math.pow(c, 2) + 1000 * c;
    const denominador = -Math.pow(c, 2) + 4 * c;
    if (denominador === 0) return null; // descontinuidade em c = 0 e c = 4
    return Math.round(numerador / denominador);
  };
  const valoresReceita = clientes.map(c => calcReceita(c));

  const growthChartData = {
    labels: clientes.map(c => `${c}`),
    datasets: [
      {
        label: 'Receita/h por Cliente (R$)',
        data: valoresReceita,
        borderColor: '#05d9e8',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, 'rgba(5, 217, 232, 0.25)');
          gradient.addColorStop(1, 'rgba(5, 217, 232, 0.02)');
          return gradient;
        },
        fill: true,
        pointBackgroundColor: clientes.map(c => c === 4 ? '#ffffff' : '#ff2a6d'),
        pointBorderColor: clientes.map(c => c === 4 ? '#ff2a6d' : '#ffffff'),
        pointBorderWidth: clientes.map(c => c === 4 ? 3 : 2),
        pointRadius: clientes.map(c => c === 4 ? 8 : 5),
        pointHoverRadius: 9,
        borderWidth: 3,
        tension: 0.4,
        spanGaps: true,
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
        bodyColor: '#d1f7ff',
        borderColor: '#05d9e8',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          title: (items) => `${items[0].label} clientes`,
          label: (ctx) => {
            if (ctx.parsed.y === null) return ' R(c) não existe (descontinuidade)';
            return ` Receita/h = R$ ${ctx.parsed.y.toLocaleString('pt-BR')}`;
          },
          afterLabel: (ctx) => {
            if (Number(ctx.label) === 4) return ' ⚠ Limite lateral → R$ 1.250/h';
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Clientes', color: '#6b7280', font: { size: 12, weight: 'bold' } },
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        title: { display: true, text: 'R$/hora', color: '#6b7280', font: { size: 12, weight: 'bold' } },
        grid: { color: '#f3f4f6', borderDash: [4, 4] },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          callback: (val) => `R$ ${val.toLocaleString('pt-BR')}/h`,
        },
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
              <p className="text-sm uppercase tracking-[0.25em] opacity-90 mb-1">Sobre o projeto</p>
              <h1 className="text-3xl font-bold mb-1">Informações do Projeto</h1>
              <p className="text-sm md:text-base opacity-90 max-w-xl">
                Conheça a visão, as projeções, a tecnologia e as práticas socioambientais da plataforma Happy Game.
              </p>
            </div>
          </div>

          {/* ── Badges de destaque (dentro do header) ── */}
          <div className="relative flex flex-wrap gap-3 justify-center md:justify-start">
              {[
              { label: 'Stack', value: 'React' },
              { label: 'Estilo', value: 'Tailwind' },
              { label: 'IA Integrada', value: 'ChatBot' },
              { label: 'Impacto', value: 'ESG' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center justify-center rounded-xl px-5 py-2.5 min-w-[100px] bg-white/15 backdrop-blur-sm border border-white/20">
                <span className="text-lg font-bold text-white">{badge.value}</span>
                <span className="text-[12px] text-white/90 mt-0.5">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Conteúdo em acordeão ── */}
        <div className="p-6 md:p-8 space-y-4 mt-4">

          {/* Seção 1 ─ Sobre */}
          <AccordionItem
            title="Assistente de IA para E-commerce Gamer"
            icon=""
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
                { title: 'Chatbot Inteligente', desc: 'Recomendações personalizadas e assistência em tempo real.' },
                { title: 'Visualização Limpa', desc: 'Interface moderna, focada no usuário final.' },
                { title: 'Navegação Fluida', desc: 'Menus otimizados para facilitar a conversão.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center hover:border-happy-blue/40 hover:shadow-sm transition-all duration-200"
                >

                  <h4 className="font-bold text-happy-text text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Seção 2 ─ Projeções */}
          <AccordionItem
            title="Projeções de Rendimento e Engajamento"
            icon=""
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
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-happy-blue-text">Rendimento × Usuários</span>
                  <span className="text-xs text-gray-500">Projeção exponencial</span>
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
              <span className="text-xs text-gray-500 uppercase tracking-widest">Análise de Limites</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>

            {/* Gráfico 2 ─ N(t) função racional com descontinuidade */}
            <div>
              <h3 className="text-lg font-bold text-happy-text mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-happy-pink inline-block"></span>
                Cliente x Receita — Função Racional R(c)
              </h3>
              <p className="mb-4 text-[15px]">
                Para modelar a <strong>receita por hora</strong> em função do número de clientes, utilizamos uma função racional
                que apresenta uma <strong>descontinuidade removível</strong> em c = 4. Embora R(4) não exista
                (denominador zero), podemos verificar por meio dos <strong>limites laterais</strong> que
                R(c) <strong>tende a R$ 1.250/h</strong> à medida que c se aproxima de 4.
              </p>

              {/* ── Fórmula original ── */}
              <div className="bg-gradient-to-r from-happy-pink/5 to-happy-blue/5 border border-gray-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 text-center">Função Original</p>
                <p className="text-center font-mono text-base md:text-lg text-happy-dark font-bold tracking-wide leading-relaxed">
                  R(c) = (-250c³ + 750c² + 1000c) / (-c² + 4c)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  {[
                    { var: 'R(c)', desc: 'Receita/hora (R$)' },
                    { var: 'c', desc: 'Nº de Clientes' },
                    { var: 'c = 4', desc: 'Descontinuidade' },
                    { var: 'R(1) = 500', desc: 'Valor inicial' },
                  ].map((item, i) => (
                    <div key={i} className="text-center bg-white/60 rounded-lg py-2 px-1">
                      <span className="font-mono font-bold text-happy-pink text-sm">{item.var}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Passo a passo: Fatoração → Simplificação → Limite ── */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Desenvolvimento Completo</p>

                {/* Passo 1 – Fatoração */}
                <div>
                  <p className="text-sm font-bold text-happy-text mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-happy-pink text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Fatoração
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-gray-100 space-y-1">
                    <p className="font-mono text-sm text-gray-700">
                      Numerador: -250c³ + 750c² + 1000c
                    </p>
                    <p className="font-mono text-sm text-gray-700 pl-4">
                      = -250c(c² - 3c - 4)
                    </p>
                    <p className="font-mono text-sm text-happy-pink font-bold pl-4">
                      = -250c(c + 1)<span className="text-happy-blue">(c - 4)</span>
                    </p>
                    <hr className="my-2 border-gray-100" />
                    <p className="font-mono text-sm text-gray-700">
                      Denominador: -c² + 4c
                    </p>
                    <p className="font-mono text-sm text-happy-pink font-bold pl-4">
                      = -c<span className="text-happy-blue">(c - 4)</span>
                    </p>
                  </div>
                </div>

                {/* Passo 2 – Cancelamento */}
                <div>
                  <p className="text-sm font-bold text-happy-text mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-happy-blue text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Simplificação
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-gray-100 space-y-1">
                    <p className="font-mono text-sm text-gray-700">
                      R(c) = <span className="line-through text-gray-400">-250c</span> · 250(c + 1) · <span className="line-through text-gray-400">(c - 4)</span> / <span className="line-through text-gray-400">-c</span> · <span className="line-through text-gray-400">(c - 4)</span>
                    </p>
                    <p className="font-mono text-sm text-happy-blue font-bold pl-4">
                      R(c) = 250(c + 1), para c ≠ 0 e c ≠ 4
                    </p>
                  </div>
                </div>

                {/* Passo 3 – Cálculo do Limite */}
                <div>
                  <p className="text-sm font-bold text-happy-text mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-happy-pink text-white text-[11px] flex items-center justify-center font-bold">3</span>
                    Cálculo do Limite
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="font-mono text-sm text-gray-700 text-center">
                      lim<sub>c→4</sub> <span className="text-happy-pink font-bold">250(c + 1)</span> = 250(4 + 1) = 250 × 5 = <span className="text-happy-blue font-bold text-base">R$ 1.250/h</span>
                    </p>
                  </div>
                </div>

                {/* Passo 4 – Interpretação */}
                <div>
                  <p className="text-sm font-bold text-happy-text mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-happy-blue text-white text-[11px] flex items-center justify-center font-bold">4</span>
                    Interpretação
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-sm text-gray-600">
                      O ponto <strong>(4, 1250)</strong> é uma <strong>descontinuidade removível</strong>.
                      A função R(c) não possui imagem em c = 4 (denominador zero), porém o limite lateral
                      confirma que a receita por hora <strong>tende a R$ 1.250/h</strong>. No gráfico, representamos
                      esse ponto com uma <strong>bolinha aberta</strong> (⚬).
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Gráfico ── */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-happy-pink">Cliente x Receita</span>
                  <span className="text-xs text-gray-500">Descontinuidade removível em c = 4</span>
                </div>
                <div className="w-full h-72">
                  <Line
                    data={growthChartData}
                    options={growthChartOptions}
                    role="img"
                    aria-label="Gráfico Cliente x Receita com função racional R(c) e descontinuidade removível em c = 4, onde o limite tende a R$ 1.250/h."
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  <span className="inline-block w-3 h-3 rounded-full border-2 border-red-400 bg-white flex-shrink-0"></span>
                  <span>Bolinha aberta em c = 4 indica que R(4) não existe, mas lim<sub>c→4</sub> R(c) = R$ 1.250/h</span>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Seção 3 ─ Design e Tecnologia */}
          <AccordionItem
            title="Design e Tecnologia"
            icon=""
            isOpen={openIndex === 2}
            onClick={() => handleToggle(2)}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Identidade Visual */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h4 className="font-bold text-happy-text mb-3 flex items-center gap-2">
                  Identidade Visual
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  A paleta utiliza cores vibrantes para refletir a estética contemporânea do universo gamer.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-blue shadow-sm"></div>
                    <span className="text-xs text-gray-500 mt-1">Azul Neon</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-pink shadow-sm"></div>
                    <span className="text-xs text-gray-500 mt-1">Rosa Vibrante</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-dark shadow-sm"></div>
                    <span className="text-xs text-gray-500 mt-1">Dark</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-10 rounded-lg bg-happy-detail border border-gray-100 shadow-sm"></div>
                    <span className="text-xs text-gray-500 mt-1">Detalhe</span>
                  </div>
                </div>
              </div>

              {/* Stack Tecnológica */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h4 className="font-bold text-happy-text mb-3 flex items-center gap-2">
                  Stack Tecnológica
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

          {/* Seção 4 ─ Impacto ESG */}
          <AccordionItem
            title="Impacto ESG e Transparência"
            icon=""
            isOpen={openIndex === 3}
            onClick={() => handleToggle(3)}
          >
            <p className="mb-4 text-[15px]">
              A Happy Game usa dados simulados para demonstrar como um e-commerce gamer pode comunicar
              impacto socioambiental com transparência e influenciar escolhas melhores durante a jornada de compra.
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <StatBadge label="opções de baixo impacto" value="13" />
              <StatBadge label="categorias com alternativa" value="7" accent />
              <StatBadge label="dados simulados ESG" value="100%" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {[
                {
                  title: 'Embalagens',
                  desc: 'Priorização simulada de papelão reciclado, embalagens compactas e redução de plástico descartável.'
                },
                {
                  title: 'Fornecedores',
                  desc: 'Critérios simulados para origem de materiais, eficiência energética, reparabilidade e menor geração de resíduos.'
                },
                {
                  title: 'Descarte responsável',
                  desc: 'Orientações para separar periféricos, cabos, telas e componentes eletrônicos em pontos de coleta adequados.'
                },
                {
                  title: 'Educação na compra',
                  desc: 'Selos, microconteúdos e chatbot ajudam o usuário a comparar impacto sem interromper a experiência gamer.'
                }
              ].map((item, i) => (
                <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <h4 className="font-bold text-green-800 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-green-900 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-happy-blue/5 to-happy-pink/5 border border-gray-100 rounded-xl p-5">
              <h4 className="font-bold text-happy-text mb-3">Como isso aparece na aplicação</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { label: 'Home', text: 'Cards exibem selos como baixo impacto e embalagem reciclável.' },
                  { label: 'Produto', text: 'A sidebar mostra embalagem, descarte, política de fornecedor e entrega sustentável simulada.' },
                  { label: 'Chatbot', text: 'O assistente indica opções sustentáveis mantendo respostas simples de categoria, número e sim/não.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-lg p-3">
                    <span className="text-xs font-bold uppercase text-happy-pink">{item.label}</span>
                    <p className="text-xs text-gray-600 mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </AccordionItem>

        </div>
      </div>
    </div>
  );
};

export default Info;
