import React from 'react';

interface DonutChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    size?: number;
    strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 200, strokeWidth = 20 }) => {
    const halfSize = size / 2;
    const radius = halfSize - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
    let accumulatedValue = 0;

    return (
        <div className="relative flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={halfSize}
                    cy={halfSize}
                    r={radius}
                    fill="none"
                    stroke="#334155" // slate-700
                    strokeWidth={strokeWidth}
                />
                {data.map((item, index) => {
                    const strokeDashoffset = circumference * (1 - accumulatedValue / totalValue);
                    const strokeDasharray = `${(circumference * item.value) / totalValue} ${circumference}`;
                    accumulatedValue += item.value;

                    return (
                        <circle
                            key={index}
                            cx={halfSize}
                            cy={halfSize}
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform={`rotate(-90 ${halfSize} ${halfSize})`}
                            className="chart-donut-segment"
                            style={{ animationDelay: `${index * 150}ms` }}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-slate-100">{totalValue > 0 ? `${totalValue}%` : 'N/A'}</span>
                <span className="text-sm text-slate-400">Sentiment</span>
            </div>
             <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-300">{item.label}</span>
                        <span className="ml-1.5 font-medium text-slate-400">({item.value}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface LineChartProps {
  data: {
    x: string;
    y: number;
  }[];
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, height = 250 }) => {
  if (!data || data.length < 2) {
    return (
      <div style={{ height: `${height}px` }} className="flex items-center justify-center text-sm text-slate-500">
        Not enough data to display a trend.
      </div>
    );
  }

  const yMax = Math.max(...data.map(d => d.y), 0) * 1.2;
  const xPoints = data.map((_, i) => (i / (data.length - 1)) * 100);
  const yPoints = data.map(d => 100 - (d.y / yMax) * 100);
  const path = `M ${xPoints.map((x, i) => `${x},${yPoints[i]}`).join(' L ')}`;

  return (
    <div className="h-full w-full" style={{ height: `${height}px` }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="0.1" />
        ))}
        
        {/* Line */}
        <path d={path} fill="none" stroke="#0ea5e9" strokeWidth="0.5" className="chart-line" />
        
        {/* Gradient under the line */}
        <path d={`${path} L 100,100 L 0,100 Z`} fill="url(#line-gradient)" className="opacity-50 animate-slide-in-up" />
        <defs>
          <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};


interface HorizontalBarChartProps {
  data: {
    label: string;
    value: number;
  }[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value), 0);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between items-baseline mb-1 text-sm">
            <span className="font-medium text-slate-300">{item.label}</span>
            <span className="font-bold text-indigo-300">{item.value.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-indigo-500 h-2.5 rounded-full chart-bar"
              style={{ width: `${(item.value / maxValue) * 100}%`, animationDelay: `${index * 100}ms`, transformOrigin: 'left' }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};