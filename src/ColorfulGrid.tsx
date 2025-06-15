import { useState } from "react";
import { Link } from "wouter";

type SquareProps = {
  value: number;
  colorClass: string;
  rowClass: string;
};

function Square({ value, colorClass, rowClass }: SquareProps) {
  let squareStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  };
  return (
    <Link to={`/detail/${value}`} state={{ animate: true }}>
      <div className={`square ${colorClass} ${rowClass}`} style={squareStyle}>
        {value}
      </div>
    </Link>
  );
}

function getRandomColorClass() {
  let colorNum = Math.floor(Math.random() * 8) + 1;
  return `color-${colorNum}`;
}

export function ColorfulGrid() {
  let numSquares = 160;
  let squaresPerRow = 8;
  let [colorClasses] = useState(() => Array.from({ length: numSquares }, getRandomColorClass));

  return (
    <div className="grid">
      {Array.from({ length: numSquares }, (_, i) => {
        let row = Math.floor(i / squaresPerRow) + 1;
        let rowClass = `row-${row}`;
        return <Square key={i} value={i + 1} colorClass={colorClasses[i]} rowClass={rowClass} />;
      })}
    </div>
  );
}
