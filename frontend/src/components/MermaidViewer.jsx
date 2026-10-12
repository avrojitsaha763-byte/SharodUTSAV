import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { GitBranch, Shield, Zap } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0f172a',
    primaryColor: '#881337',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#fbbf24',
    lineColor: '#fbbf24',
    secondaryColor: '#1e293b',
    tertiaryColor: '#070a13'
  },
  securityLevel: 'loose',
});

export default function MermaidViewer({ chart, title = "Gate Barricade Flow" }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart) return;
      setRenderError(false);
      try {
        const id = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;
        const cleanChart = chart.trim();
        const { svg } = await mermaid.render(id, cleanChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.warn("Mermaid rendering warning:", err);
        if (isMounted) {
          setRenderError(true);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-4 my-3 text-slate-200">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <span>{title}</span>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
          <Shield className="w-3 h-3 text-emerald-400 mr-1" /> Barricade Flow
        </span>
      </div>

      {!renderError && svgContent ? (
        <div
          ref={containerRef}
          className="overflow-x-auto py-2 flex justify-center [&_svg]:max-w-full [&_svg]:h-auto text-xs"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        /* Fallback visual flow in case of offline/syntax glitch */
        <div className="flex items-center justify-between text-xs py-3 px-2 bg-slate-950/60 rounded-lg text-slate-300">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Perimeter Check</span>
          </div>
          <span className="text-amber-500 font-bold">➔</span>
          <div className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Metal Detector</span>
          </div>
          <span className="text-amber-500 font-bold">➔</span>
          <div className="flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Sanctum View</span>
          </div>
          <span className="text-amber-500 font-bold">➔</span>
          <span className="text-emerald-400 font-medium">Exit Gate</span>
        </div>
      )}
      <div className="text-[11px] text-slate-400 text-center mt-2">
        Kolkata Police Barricade Protocol • Staggered holding boxes deployed
      </div>
    </div>
  );
}
