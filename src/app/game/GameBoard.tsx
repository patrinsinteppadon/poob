"use client";

import React from 'react';
import { Slot } from './types';

interface SlotTableProps {
  tableData: Slot[][]; // Table data passed as a prop
  onCellClick: (rowIndex: number, colIndex: number) => void; // Function to handle cell clicks
}

const GameBoard:React.FC<SlotTableProps> = ({tableData, onCellClick}) => {

  // use onPointer instead of onMouseDown
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
              key={colIndex}
              onClick={() => onCellClick(rowIndex, colIndex)}
              style={{
                border: "1px solid black",
                width: "50px",
                height: "50px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor:
                  cell === Slot.Red
                    ? "red"
                    : cell === Slot.Blue
                    ? "blue"
                    : "white",
                color: cell === Slot.Empty ? "gray" : "white",
                fontWeight: "bold",
              }}
            >
              {cell}
            </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GameBoard;
