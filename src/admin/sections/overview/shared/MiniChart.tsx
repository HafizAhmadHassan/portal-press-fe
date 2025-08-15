import React from 'react';
import styles from './shared.module.scss';

interface MiniChartProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({ 
  data, 
  color, 
  width = 60, 
  height = 20 
}) => {
  const maxValue = Math.max(...data);
  
  const points = data.map((val, i) => 
    `${(i / (data.length - 1)) * width},${height - (val / maxValue) * height}`
  ).join(' ');

  return (
    <div className={styles.miniChart}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className={styles.chartLine}
        />
      </svg>
    </div>
  );
};

export default MiniChart;