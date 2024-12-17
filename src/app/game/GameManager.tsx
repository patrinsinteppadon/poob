"use client";

import React, { useState } from 'react';
import GameBoard from './GameBoard';

enum Slot {
  Red = 'r',
  Blue = 'b',
  Empty = 'x',
}

const GameManager = () => {
  const board_size = 6;

  // init table data as a 6x6 grid filled with Slot.Empty
  const [tableData, setTableData] = useState<Slot[][]>(
    Array.from({ length: board_size }, () => Array(board_size).fill(Slot.Empty))
  );
  
  const onCellClick = (rowIndex: number, colIndex: number) => {
    let isValidMove = false;
    const clickedSlot = tableData[rowIndex][colIndex];
    const newTableData = tableData.map((row) => [...row]);

    console.log("cell clicked! Value is ", clickedSlot);
    console.log("cell rowIndex: %d",  rowIndex);
    console.log("cell colIndex: %d",  colIndex);

    if (clickedSlot === Slot.Empty) {
      console.log('placing token!');
      isValidMove = true;
      newTableData[rowIndex][colIndex] = Slot.Red;
      setTableData(newTableData);
      pushNeighborTokens(newTableData, rowIndex, colIndex);
    }

    if (isValidMove) {
      checkForWinner();
    }
  }

  const pushNeighborTokens = (newTableData: Slot[][], rowIndex: number, colIndex: number) => {
    // call pushNeighbor on each of the 8 neighbors of the tile
    pushToken(newTableData, rowIndex - 1, colIndex, -1, 0); // boop upwards
    pushToken(newTableData, rowIndex, colIndex + 1, 0, 1); // boop rightwards
    pushToken(newTableData, rowIndex + 1, colIndex, 1, 0); // boop downwards
    pushToken(newTableData, rowIndex, colIndex - 1, 0, -1); // boop leftwards
    pushToken(newTableData, rowIndex -1, colIndex + 1, -1, 1); // boop up right
    pushToken(newTableData, rowIndex -1, colIndex - 1, -1, -1); // boop up left
    pushToken(newTableData, rowIndex + 1, colIndex - 1, 1, -1); // boop down left
    pushToken(newTableData, rowIndex + 1, colIndex + 1, 1, 1); // boop rightwards
  }

  const pushToken = (
    newTableData: Slot[][],
    rowIndex: number,
    colIndex: number,
    rowDelta: number,
    colDelta: number
  ) => {
    if (
      rowIndex > tableData.length ||
      rowIndex < 0 ||
      colIndex > tableData.length ||
      colIndex < 0 ||
      newTableData[rowIndex][colIndex] === Slot.Empty
    ) {
      console.log('cannot boop this tile. ignoring');
      return;
    } else if (rowIndex + rowDelta > tableData.length ||
      rowIndex + rowDelta < 0 ||
      colIndex + colDelta > tableData.length ||
      colIndex + colDelta < 0) {
      console.log('boop destination (', rowIndex, ',', colIndex, ') is out of bounds. Token was pushed off the board');
      newTableData[rowIndex][colIndex] = Slot.Empty;
      // if intended push destination is out of bounds, then return
    } else {
      // if intended push destination is in bounds AND empty, then set its value to Slot.RED
      console.log('boop destination (', rowIndex + rowDelta, ',', colIndex + colDelta, ') is valid!');
      newTableData[rowIndex][colIndex] = Slot.Empty;
      newTableData[rowIndex + rowDelta][colIndex + colDelta] = Slot.Red;
    }
  }; 

  const checkForWinner = () => {
    // todo: implement a check for any 3-in-a-rows for either player.
  }

  return (
    <GameBoard tableData={tableData} onCellClick={onCellClick} />
  );
}

export default GameManager;

