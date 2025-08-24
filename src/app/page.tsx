"use client";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import logo from "../assets/logo.png";

export default function Home() {
  const [grupos, setGrupos] = useState<string[][]>([]);
  const tabelaRef = useRef<HTMLDivElement>(null);
  function handleGerarPDF() {
    if (!tabelaRef.current) return;
    html2canvas(tabelaRef.current, { backgroundColor: "#f7fafc", scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header background
      pdf.setFillColor(33, 150, 243); // blue
      pdf.rect(0, 0, 210, 30, "F");

      // Logo (if you want to add, needs base64 or url)
      // pdf.addImage(logo.src, "PNG", 10, 5, 20, 20);

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text("Sorteio Semana da Juventude ", 105, 18, { align: "center" });

      // Subtitle
      pdf.setFontSize(13);
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
      pdf.setDrawColor(33, 150, 243);
      pdf.setLineWidth(1.5);
      pdf.line(15, 137, 195, 137);

      pdf.save(`chaves_${modalidadeSelecionada}_${generoSelecionado}.pdf`);
    });
  }
  let listaDeTurmasMasculinasEMisto = [
    "Turma 11", "Turma 12", "Turma 13", "Turma 14", "Turma 15",
    "Turma 21", "Turma 22", "Turma 23", "Turma 24",
    "Turma 31", "Turma 32", "Turma 33", "Turma 34",
    "Turma TI 11", "Turma TI 12", "Turma TI20", "Turma TI30"
  ];
 
  let listaDeTurmasFemininas = [
    "Turma 11", "Turma 12", "Turma 13", "Turma 14", "Turma 15",
    "Turma 21", "Turma 22", "Turma 23", "Turma 24",
    "Turma 31", "Turma 32", "Turma 33", "Turma 34"
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
      const novosGrupos: string[][] = [];
      for (let i = 0; i < 4; i++) {
        const grupo = listaDeTurmas.splice(0, generoSelecionado === "feminino" ? 3 : 4);
        novosGrupos.push(grupo);
      }
      setGrupos(novosGrupos);
    } else {
      alert("Por favor, selecione uma modalidade e um gênero.");
    }
  }
  return (
    <div className="font-sans items-center w-full p-8 pb-20 gap-16 ">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="text-4xl font-bold">Sorteio Semana da Juventude 🏅</h1>
          <img style={{ width: "100px" }} src={logo.src} alt="Sorteio Semana da Juventude" />

        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>

           <p className="text-2xl bg-gray-100 text-center p-4">Gere as chaves para a semana da juventude de forma TOTALMENTE aleatória.</p>

        {/* SELECT MODALIDADE */}
        <div className="w-full flex flex-col gap-6 items-center">
          {/* Modalidade Select */}
          <div className="w-full max-w-md">
            <label htmlFor="modalidade" className="block text-lg font-semibold mb-2 text-gray-700">
              Modalidade
            </label>
            <select
              id="modalidade"
              name="Selecionar modalidade"
              value={modalidadeSelecionada}
              onChange={(e) => setModalidadeSelecionada(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Selecione uma modalidade</option>
              {modalidades.map((modalidade, index) => (
                <option key={index} value={modalidade}>
                  {modalidade}
                </option>
              ))}
            </select>
          </div>

          {/* Gênero Radio Buttons */}
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                id="masculino"
                name="genero"
                value="masculino"
                checked={generoSelecionado === "masculino"}
                onChange={(e) => setGeneroSelecionado(e.target.value)}
                className="accent-blue-600"
              />
              <span className="text-gray-700 font-medium">Masculino</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                id="feminino"
                name="genero"
                value="feminino"
                checked={generoSelecionado === "feminino"}
                onChange={(e) => setGeneroSelecionado(e.target.value)}
                className="accent-pink-500"
              />
              <span className="text-gray-700 font-medium">Feminino</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                id="misto"
                name="genero"
                value="misto"
                checked={generoSelecionado === "misto"}
                onChange={(e) => setGeneroSelecionado(e.target.value)}
                className="accent-green-500"
              />
              <span className="text-gray-700 font-medium">Misto</span>
            </label>
          </div>

          {/* Botão */}
          <button
            type="button"
            onClick={handleSortear}
            className="w-52 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold shadow-lg transition"
          >
            Gerar chave
          </button>
        </div>

        {/* TABELA DE CHAVES ABAIXO DO BOTÃO */}
        {grupos.length > 0 && (
          <>
            <div ref={tabelaRef} style={{ width: "100%", marginTop: "32px" }}>
              <h2 className="text-2xl text-center font-bold">Chaves geradas para {modalidadeSelecionada} - {generoSelecionado}</h2>
              <table style={{ width: "100%", marginTop: "32px", background: "#ededed", borderRadius: "8px", border: "1px solid #0b0b0b" }}>
                <thead>
                  <tr>
                    <th style={{ borderRight: "1px solid #0b0b0b", padding: "12px 16px", borderBottom: "1px solid #0b0b0b" }}>Chave</th>
                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #0b0b0b" }}>Turmas</th>
                  </tr>
                </thead>
                <tbody>
                  {grupos.map((grupo, idx) => (
                    <tr style={{ width: "100%", alignItems: "center", justifyContent: "center" }} key={idx}>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #0b0b0b", borderRight: "1px solid #0b0b0b" }}>Chave {idx + 1}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #0b0b0b" }}>{grupo.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{marginTop: "24px", textAlign: "center"}}>Boa sorte a todos os participantes!</p>

            <button
              style={{
                marginTop: "24px",
                width: "200px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#0a0a0a"
              }}
              type="button"
              onClick={handleGerarPDF}
            >
              <p style={{ color: "#ededed" }}>Gerar PDF</p>
            </button>
          </>
        )}
        </div>
      </main>
    </div>
  );
  }
