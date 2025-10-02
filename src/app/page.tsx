"use client";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Home() {
  const [grupos, setGrupos] = useState<string[][]>([]);
  const tabelaRef = useRef<HTMLDivElement>(null);
  
  // Função para gerar os jogos dentro de cada chave
  function gerarJogos(grupo: string[], chaveIndex: number) {
    if (grupo.length < 2) return [];
    
    const jogos = [];
    const gruposAcumulados = grupos.slice(0, chaveIndex).reduce((acc, g) => acc + g.length, 0);
    
    // Para cada grupo de 3 equipes: 1x2, 2x3, 3x1
    for (let i = 0; i < grupo.length; i++) {
      const proxima = (i + 1) % grupo.length;
      const equipe1Numero = gruposAcumulados + i + 1;
      const equipe2Numero = gruposAcumulados + proxima + 1;
      
      jogos.push({
        equipe1: grupo[i],
        equipe2: grupo[proxima],
        equipe1Numero,
        equipe2Numero
      });
    }
    
    return jogos;
  }
  function handleGerarPDF() {
    if (!tabelaRef.current) return;
    
    // Configurações para evitar problemas com cores lab/lch
    const options = {
      backgroundColor: "#ffffff", // Cor sólida branca ao invés de variáveis CSS
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false, // Desabilita renderização que pode causar problemas com cores modernas
      ignoreElements: (element: Element) => {
        // Ignora elementos que podem ter cores problemáticas
        return element.classList?.contains('gradient') || false;
      }
    };
    
    html2canvas(tabelaRef.current, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header background - cores da logo oficial
      pdf.setFillColor(30, 58, 138); // azul marinho da logo
      pdf.rect(0, 0, 210, 30, "F");

      // Logo (if you want to add, needs base64 or url)
      // pdf.addImage(logo.src, "PNG", 10, 5, 20, 20);

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(250, 204, 21); // dourado da logo
      pdf.setFontSize(22);
      pdf.text("29ª Semana da Juventude \ud83c\udfc6", 105, 18, { align: "center" });

      // Subtitle
      pdf.setFontSize(13);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Chaves geradas para " + modalidadeSelecionada + " - " + generoSelecionado, 105, 27, { align: "center" });

      // Table image
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.setTextColor(33, 33, 33);
      pdf.addImage(imgData, "PNG", 15, 40, 180, 0); // auto height

      // Footer
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const dataBR = (() => {
        const d = new Date();
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      })();
      pdf.text(`Chaves geradas de forma totalmente aleatória, às ${new Date().toLocaleTimeString()} do dia ${dataBR}`, 105, 135, { align: "center" });

      // Decorative line
      pdf.setDrawColor(30, 58, 138); // azul marinho da logo
      pdf.setLineWidth(1.5);
      pdf.line(15, 137, 195, 137);

      pdf.save(`chaves_${modalidadeSelecionada}_${generoSelecionado}.pdf`);
    }).catch((error) => {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    });
  }
  let listaDeTurmasMasculinasEMisto = [
    "Turma 11", "Turma 12", "Turma 13", "Turma 14", "Turma 15",
    "Turma 21", "Turma 22", "Turma 23", "Turma 24",
    "Turma 31", "Turma 32", "Turma 33", "Turma 34",
    "Turma TI 11", "Turma TI 12"
  ];
 
  let listaDeTurmasFemininas = [
    "Turma 11", "Turma 12", "Turma 13", "Turma 14", "Turma 15",
    "Turma 21", "Turma 22", "Turma 23", "Turma 24",
    "Turma 31", "Turma 32", "Turma 33"
  ];

  const modalidades = [
    "Corrida 100m", "Revezamento 4x100", "Corrida 1500m", "Corrida 800m",
    "Salto em distância", "Arremesso de peso", "Lançamento de dardo",
    "Tiro de laço", "Futsal", "Basquetebol", "Gincana cultural",
    "Mortal Kombat", "Bocha campeira", "Show de talentos", "Culinária",
    "FIFA", "Vôlei de praia", "Xadrez", "Handebol", "Counter Strike",
    "Gincana recreativa", "Voleibol", "Truco", "Cabo de guerra",
    "Escape room", "Soletrando", "Sudoku", "Bisca"
  ];

  const modalidadesMistas = ["Gincana cultural", "Mortal Kombat", "Show de talentos", "Culinária", "FIFA", "Vôlei de praia", "Xadrez",  "Counter Strike", "Gincana recreativa", "Truco", "Cabo de guerra", "Escape room", "Soletrando", "Sudoku", "Bisca" ]

  const modalidadesSemChaves = ["Salto em distância", "Arremesso de peso", "Lançamento de dardo", "Tiro de laço", "Gincana cultural", "Escape room", "Soletrando"];

  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");
  const [generoSelecionado, setGeneroSelecionado] = useState("masculino");


  function handleSortear() {
    if (modalidadeSelecionada && generoSelecionado) {

      if (modalidadesMistas.includes(modalidadeSelecionada) && generoSelecionado !== "misto") {
        alert("A modalidade selecionada é mista, por favor selecione o gênero 'Misto'.");
        return;
      }

      let listaDeTurmas: string[] = [];
      if (generoSelecionado === "masculino" || generoSelecionado === "misto") {
        listaDeTurmas = [...listaDeTurmasMasculinasEMisto].sort(() => Math.random() - 0.5);
      } else if (generoSelecionado === "feminino") {
        listaDeTurmas = [...listaDeTurmasFemininas].sort(() => Math.random() - 0.5);
      }
      
      // Verifica se é uma modalidade sem chaves (lista numerada)
      if (modalidadesSemChaves.includes(modalidadeSelecionada)) {
        // Para modalidades sem chaves, criar uma única "chave" com todas as turmas
        const novosGrupos: string[][] = [listaDeTurmas];
        setGrupos(novosGrupos);
      } else {
        // Para modalidades com chaves
        const novosGrupos: string[][] = [];
        let numeroDeChaves: number;
        let turmasPorChave: number;
        
        if (generoSelecionado === "masculino" || generoSelecionado === "misto") {
          numeroDeChaves = 5; // 5 chaves para masculino/misto
          turmasPorChave = 3; // 3 turmas por chave
        } else {
          numeroDeChaves = 4; // 4 chaves para feminino
          turmasPorChave = 3; // 3 turmas por chave
        }
        
        for (let i = 0; i < numeroDeChaves; i++) {
          const grupo = listaDeTurmas.splice(0, turmasPorChave);
          novosGrupos.push(grupo);
        }
        setGrupos(novosGrupos);
      }
    } else {
      alert("Por favor, selecione uma modalidade e um gênero.");
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 font-sans">
      <main className="container mx-auto px-8 py-12">
        {/* Header com identidade visual da logo oficial */}
        <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 rounded-2xl p-8 mb-12 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-yellow-400 drop-shadow-lg">
                29ª Semana da Juventude 🏅
              </h1>
              <p className="text-yellow-200 text-lg mt-2 font-medium">
                Desde 1994 - Competição Oficial
              </p>
            </div>
            <img 
              style={{ width: "120px", height: "120px", objectFit: "contain" }} 
              src="/logo.jpeg" 
              alt="Logo Semana da Juventude" 
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Seção principal com card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-900 to-slate-800 text-yellow-400 px-6 py-3 rounded-full text-xl font-bold mb-4">
              ⚡ Gerador de Chaves Oficial ⚡
            </div>
            <p className="text-slate-600 text-lg">
              Sistema automatizado para geração de chaves totalmente aleatórias
            </p>
          </div>

        {/* Formulário com design elegante */}
        <div className="flex flex-col items-center gap-8">
          {/* Modalidade Select */}
          <div className="w-full max-w-md">
            <label htmlFor="modalidade" className="block text-xl font-bold mb-3 text-slate-800 text-center">
              🏆 Selecione a Modalidade
            </label>
            <select
              id="modalidade"
              name="Selecionar modalidade"
              value={modalidadeSelecionada}
              onChange={(e) => setModalidadeSelecionada(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-blue-900 transition-all shadow-lg"
            >
              <option value="">🎯 Escolha uma modalidade</option>
              {modalidades.map((modalidade, index) => (
                <option key={index} value={modalidade}>
                  {modalidade}
                </option>
              ))}
            </select>
          </div>

          {/* Gênero Radio Buttons */}
          <div className="flex gap-6 flex-wrap justify-center">
            <label className="flex items-center gap-3 cursor-pointer bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-xl transition-all shadow-md border border-blue-200">
              <input
                type="radio"
                id="masculino"
                name="genero"
                value="masculino"
                checked={generoSelecionado === "masculino"}
                onChange={(e) => setGeneroSelecionado(e.target.value)}
                className="w-5 h-5 accent-blue-900"
              />
              <span className="text-blue-900 font-bold text-lg">👦 Masculino</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer bg-yellow-50 hover:bg-yellow-100 px-6 py-3 rounded-xl transition-all shadow-md border border-yellow-200">
              <input
                type="radio"
                id="feminino"
                name="genero"
                value="feminino"
                checked={generoSelecionado === "feminino"}
                onChange={(e) => setGeneroSelecionado(e.target.value)}
                className="w-5 h-5 accent-yellow-600"
              />
              <span className="text-yellow-700 font-bold text-lg">👧 Feminino</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 px-6 py-3 rounded-xl transition-all shadow-md border border-slate-200">
              <input
                type="radio"
                id="misto"
                name="genero"
                value="misto"
                checked={generoSelecionado === "misto"}
                onChange={(e) => setGeneroSelecionado(e.target.value)}
                className="w-5 h-5 accent-slate-600"
              />
              <span className="text-slate-700 font-bold text-lg">🤝 Misto</span>
            </label>
          </div>

          {/* Botão */}
          <button
            type="button"
            onClick={handleSortear}
            className={`px-12 py-4 rounded-2xl text-white font-black text-xl shadow-2xl transition-all transform hover:scale-105 hover:shadow-3xl ${
              generoSelecionado === "masculino"
                ? "bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700"
                : generoSelecionado === "feminino"
                ? "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
                : "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500"
            }`}
          >
            🎲 GERAR CHAVES 🎲
          </button>
        </div>
        </div>

        {/* RESULTADOS */}
        {grupos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-slate-200">
            <div ref={tabelaRef} style={{ width: "100%" }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">
                  🏆 {modalidadesSemChaves.includes(modalidadeSelecionada) ? 'Lista de Participação' : 'Chaves Geradas'}
                </h2>
                <div className="inline-block bg-gradient-to-r from-blue-900 to-slate-800 text-yellow-400 px-6 py-2 rounded-full font-bold">
                  {modalidadeSelecionada} - {generoSelecionado}
                </div>
              </div>
              
              {modalidadesSemChaves.includes(modalidadeSelecionada) ? (
                // Para modalidades sem chaves - lista numerada vertical
                <table className="w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-slate-800">
                      <th className="border-r border-slate-600 px-6 py-4 text-yellow-400 font-black text-lg">🏅 Posição</th>
                      <th className="px-6 py-4 text-yellow-400 font-black text-lg">🏢 Turmas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grupos[0]?.map((turma, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-yellow-50 transition-colors`}>
                        <td className="border-r border-slate-200 px-6 py-4 text-center font-bold text-lg text-blue-900">{idx + 1}º</td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-800">{turma}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Para modalidades com chaves - formato invertido com numeração contínua
                <table className="w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-slate-800">
                      {grupos.map((_, idx) => (
                        <th key={idx} className={`${idx < grupos.length - 1 ? "border-r border-slate-600" : ""} px-6 py-4 text-center text-yellow-400 font-black text-lg`}>
                          🏆 Chave {String.fromCharCode(65 + idx)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Encontrar o número máximo de equipes em uma chave */}
                    {Array.from({ length: Math.max(...grupos.map(g => g.length)) }, (_, rowIdx) => (
                      <tr key={rowIdx} className={`${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-yellow-50 transition-colors`}>
                        {grupos.map((grupo, chaveIdx) => {
                          const equipeIndex = grupos.slice(0, chaveIdx).reduce((acc, g) => acc + g.length, 0) + rowIdx + 1;
                          const equipe = grupo[rowIdx];
                          return (
                            <td 
                              key={chaveIdx} 
                              className={`${ 
                                chaveIdx < grupos.length - 1 ? "border-r border-slate-200" : ""
                              } px-6 py-4 text-center font-bold text-slate-800`}
                            >
                              {equipe ? `${equipeIndex} - ${equipe}` : ''}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* SEÇÃO DE JOGOS - apenas para modalidades com chaves */}
            {!modalidadesSemChaves.includes(modalidadeSelecionada) && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800 mb-2">⚽ Jogos por Chave 🏀</h3>
                  <p className="text-slate-600">Confrontos dentro de cada chave</p>
                </div>
                <div className={`grid gap-6 ${grupos.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'}`}>
                  {grupos.map((grupo, chaveIdx) => {
                    const jogos = gerarJogos(grupo, chaveIdx);
                    return (
                      <div key={chaveIdx} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border-2 border-slate-200 shadow-xl transform hover:scale-105 transition-all">
                        <h4 className="text-center font-black mb-6 text-xl bg-gradient-to-r from-blue-900 to-slate-800 text-yellow-400 py-3 rounded-xl shadow-lg">
                          🏆 Chave {String.fromCharCode(65 + chaveIdx)}
                        </h4>
                        <div className="space-y-4">
                          {jogos.map((jogo, jogoIdx) => (
                            <div key={jogoIdx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-md hover:shadow-lg transition-all">
                              <div className="text-center">
                                <div className="font-bold text-slate-800 mb-3 text-lg">
                                  🏰 Jogo {jogoIdx + 1}
                                </div>
                                <div className="bg-blue-100 text-blue-900 font-bold py-2 px-4 rounded-lg mb-2 border border-blue-200">
                                  {jogo.equipe1Numero} - {jogo.equipe1}
                                </div>
                                <div className="text-yellow-600 font-black text-lg my-2">
                                  ⚔️ VS ⚔️
                                </div>
                                <div className="bg-yellow-100 text-yellow-800 font-bold py-2 px-4 rounded-lg border border-yellow-200">
                                  {jogo.equipe2Numero} - {jogo.equipe2}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Rodapé e botão PDF */}
            <div className="text-center mt-12">
              
              
              <button
                onClick={handleGerarPDF}
                className="bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 text-yellow-400 font-black px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all text-lg border border-slate-600"
              >
                📄 GERAR PDF OFICIAL 📄
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
