"use client";

import React, { useState } from 'react';
import GameBoard from './GameBoard';
import { InputHistory, Slot, TokenType } from './types';

const GameManager = () => {
  const BOARD_SIZE = 6;

  // init table data as a 6x6 grid filled with Slot.Empty
  const [tableData, setTableData] = useState<Slot[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(Slot.EMPTY))
  );

  const [inputHistoryList, setInputHistoryList] = useState<InputHistory[]>([]);
  
  const onCellClick = (rowIndex: number, colIndex: number) => {
    let isValidMove = false;
    const clickedSlot = tableData[rowIndex][colIndex];
    const newTableData = tableData.map((row) => [...row]);

    console.log("cell clicked! Value is ", clickedSlot);
    console.log("cell rowIndex: %d",  rowIndex);
    console.log("cell colIndex: %d",  colIndex);

    if (clickedSlot === Slot.EMPTY) {
      console.log('placing token!');
      isValidMove = true;
      newTableData[rowIndex][colIndex] = Slot.RED;
      setTableData(newTableData);
      pushNeighborTokens(newTableData, rowIndex, colIndex);
      checkForWinner();
      addToInputHistory(rowIndex, colIndex, Slot.RED);
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
      rowIndex >= tableData.length ||
      rowIndex < 0 ||
      colIndex >= tableData.length ||
      colIndex < 0 ||
      newTableData[rowIndex][colIndex] === Slot.EMPTY
    ) {
      console.log('cannot boop this tile. ignoring');
      return;
    } else if (rowIndex + rowDelta >= tableData.length ||
      rowIndex + rowDelta < 0 ||
      colIndex + colDelta >= tableData.length ||
      colIndex + colDelta < 0) {
      // token was pushed off the board
      newTableData[rowIndex][colIndex] = Slot.EMPTY;
    } else if (newTableData[rowIndex + rowDelta][colIndex + colDelta] === Slot.EMPTY) {
      newTableData[rowIndex][colIndex] = Slot.EMPTY;
      newTableData[rowIndex + rowDelta][colIndex + colDelta] = Slot.RED;
    } // else: destination tile is not empty, so do not push
  }; 

  const addToInputHistory = (rowIndex: number, colIndex: number, player: Slot.RED | Slot.BLUE) => {
    const inputHistory: InputHistory = {
      rowIndex,
      colIndex,
      player,
      token: TokenType.KITTEN
    }

    const newInputHistoryList = inputHistoryList?.map((oldInputHistory) => oldInputHistory);
    newInputHistoryList?.push(inputHistory);
    setInputHistoryList(newInputHistoryList);
    console.log("input History List", inputHistoryList);
  }

  const checkForWinner = () => {
    // todo: implement a check for any 3-in-a-rows for either player.
  }

  const resetGame = () => {
    const newTable = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(Slot.EMPTY));
    setTableData(newTable);
  }

  return (
    <>
      <GameBoard tableData={tableData} onCellClick={onCellClick} />
      <button onClick={resetGame}>Reset</button>
    </>
    
  );
}

export default GameManager;

