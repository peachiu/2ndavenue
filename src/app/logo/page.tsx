"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";

function buildSvg(dy: number, size = 500) {
    const rx = Math.round(size * 0.4);
    const fontSize = Math.round(size * 0.56);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect x="0" y="0" width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="#5170ff"/>
  <rect x="0" y="0" width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="${Math.round(size * 0.006)}"/>
  <text x="${size / 2}" y="${size / 2}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="900" fill="#e5e5e5" text-anchor="middle" dominant-baseline="central" alignment-baseline="middle" letter-spacing="-3" dy="${dy}">s</text>
</svg>`;
}

export default function LogoPage() {
    const [offset, setOffset] = useState(-25);
    const [copied, setCopied] = useState(false);
    const [svgUrl, setSvgUrl] = useState<string>("");
    const imgRef = useRef<HTMLImageElement>(null);

    const svgContent = useMemo(() => buildSvg(offset), [offset]);

    // Update blob URL whenever SVG changes
    useEffect(() => {
        const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        setSvgUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [svgContent]);

    const downloadSVG = () => {
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "secondavenue-logo.svg";
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadPNG = () => {
        const a = document.createElement("a");
        a.href = "/logo.png";
        a.download = "secondavenue-logo.png";
        a.click();
    };

    const copySVG = async () => {
        await navigator.clipboard.writeText(svgContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center p-8">
            {/* Logo — SVG real renderizado como <img> para poderes clicar com o botão direito e guardar */}
            <div className="mb-8 select-none">
                {svgUrl && (
                    <img
                        ref={imgRef}
                        src={svgUrl}
                        alt="SecondAvenue Logo"
                        style={{
                            width: 500,
                            height: 500,
                            cursor: "pointer",
                            display: "block",
                        }}
                        draggable={false}
                        onContextMenu={e => {
                            // Let the native context menu show "Save image as..."
                        }}
                    />
                )}
            </div>

            <p className="text-sm text-gray-400 mb-4 text-center max-w-sm leading-relaxed">
                ⚡ O logótipo em PNG nítido. Ajusta a posição do &ldquo;s&rdquo; com o slider abaixo.
            </p>

            {/* ── Slider ── */}
            <div className="w-full max-w-sm mb-6">
                <label className="flex items-center justify-between text-sm font-semibold text-gray-500 mb-2">
                    <span>Posição vertical do "s"</span>
                    <span className="font-mono text-base text-[#121212] bg-white px-3 py-1 rounded-xl shadow-sm">
                        dy: {offset}px
                    </span>
                </label>
                <input
                    type="range"
                    min="-80"
                    max="20"
                    value={offset}
                    onChange={e => setOffset(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#5170ff]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>mais acima (-80)</span>
                    <span>mais abaixo (+20)</span>
                </div>
            </div>

            {/* Preview do SVG gerado */}
            <details className="w-full max-w-sm mb-8">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                    Ver código SVG
                </summary>
                <pre className="mt-2 text-[10px] text-gray-500 bg-white p-3 rounded-xl shadow-sm overflow-x-auto max-h-32 overflow-y-auto whitespace-pre">
                    {svgContent}
                </pre>
            </details>

            {/* Download / copy controls */}
            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    onClick={downloadSVG}
                    className="px-8 py-4 bg-[#5170ff] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-base"
                >
                    ⬇️ Descarregar SVG
                </button>
                <button
                    onClick={downloadPNG}
                    className="px-8 py-4 bg-white text-[#121212] font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-base"
                >
                    ⬇️ Descarregar PNG (estático)
                </button>
                <button
                    onClick={copySVG}
                    className="px-8 py-4 bg-white text-[#121212] font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-base"
                >
                    {copied ? "✅ Copiado!" : "📋 Copiar SVG"}
                </button>
            </div>

            <p className="text-sm text-gray-400 mt-12 text-center max-w-md leading-relaxed">
                Logótipo SecondAvenue — versão PNG de alta qualidade (500×500).
                Também disponível em SVG para uso vetorial.
            </p>

            <Link
                href="/"
                className="mt-8 text-sm font-semibold text-[#5170ff] hover:opacity-80 transition-opacity"
            >
                ← Voltar ao início
            </Link>
        </div>
    );
}
