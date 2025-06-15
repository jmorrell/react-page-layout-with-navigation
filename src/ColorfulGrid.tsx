import { useState } from "react";

type ColorfulGridProps = {
  onItemClick: (value: number) => void;
};

type SquareProps = {
  value: number;
  colorClass: string;
  rowClass: string;
  onClick: (value: number) => void;
};

function Square({ value, colorClass, rowClass, onClick }: SquareProps) {
  let squareStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  };
  return (
    <div className={`square ${colorClass} ${rowClass}`} style={squareStyle} onClick={() => onClick(value)}>
      {value}
    </div>
  );
}

function getRandomColorClass() {
  let colorNum = Math.floor(Math.random() * 8) + 1;
  return `color-${colorNum}`;
}

export function ColorfulGrid({ onItemClick }: ColorfulGridProps) {
  let numSquares = 160;
  let squaresPerRow = 8;
  let [colorClasses] = useState(() => Array.from({ length: numSquares }, getRandomColorClass));

  return (
    <div className="grid">
      {Array.from({ length: numSquares }, (_, i) => {
        let row = Math.floor(i / squaresPerRow) + 1;
        let rowClass = `row-${row}`;
        return <Square key={i} value={i + 1} colorClass={colorClasses[i]} rowClass={rowClass} onClick={onItemClick} />;
      })}
    </div>
  );
}
