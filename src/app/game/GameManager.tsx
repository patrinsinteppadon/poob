"use client";

import React, { useState } from 'react';
import Image from "next/image";
import GameBoard from './GameBoard';
import { InputHistory, Slot, TokenType } from './types';

const GameManager = () => {
  const BOARD_SIZE = 6;

  // init table data as a 6x6 grid filled with Slot.Empty
  const [tableData, setTableData] = useState<Slot[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(Slot.EMPTY))
  );

  const [inputHistoryList, setInputHistoryList] = useState<InputHistory[]>([]);
  const [winner, setWinner] = useState<string | null>(null); // To display a winner message
  const [gameStatusText, setGameStatusText] = useState<string>("Welcome to the Game Board");
  const [redPlayerKittens, setRedPlayerKittens] = useState<number>(8);
  const [bluePlayerKittens, setBluePlayerKittens] = useState<number>(8);
  
  const onCellClick = (rowIndex: number, colIndex: number) => {
    if (winner !== null) {  // todo: doesn't update gameStatusText until one click AFTER the winning click
      return;
    }

    const clickedSlot = tableData[rowIndex][colIndex];
    const newTableData = tableData.map((row) => [...row]);

    // console.log("cell clicked! Value is ", clickedSlot);
    // console.log("cell rowIndex: %d",  rowIndex);
    // console.log("cell colIndex: %d",  colIndex);

    if (clickedSlot === Slot.EMPTY) {
      newTableData[rowIndex][colIndex] = Slot.RED;
      setTableData(newTableData);
      pushNeighborTokens(newTableData, rowIndex, colIndex);
      addToInputHistory(rowIndex, colIndex, Slot.RED);
      checkAllTiles(newTableData, Slot.RED);
      checkForLineOfThree(newTableData, rowIndex, colIndex, Slot.RED);
      checkForWinner();
    }
  }

  const pushNeighborTokens = (newTableData: Slot[][], rowIndex: number, colIndex: number) => {
    // call pushNeighbor on each of the 8 neighbors of the tile
    pushToken(newTableData, rowIndex - 1, colIndex, -1, 0); // boop up
    pushToken(newTableData, rowIndex, colIndex + 1, 0, 1); // boop right
    pushToken(newTableData, rowIndex + 1, colIndex, 1, 0); // boop down
    pushToken(newTableData, rowIndex, colIndex - 1, 0, -1); // boop left
    pushToken(newTableData, rowIndex -1, colIndex + 1, -1, 1); // boop up right
    pushToken(newTableData, rowIndex -1, colIndex - 1, -1, -1); // boop up left
    pushToken(newTableData, rowIndex + 1, colIndex - 1, 1, -1); // boop down left
    pushToken(newTableData, rowIndex + 1, colIndex + 1, 1, 1); // boop down right
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
      // no token to push
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

  const checkAllTiles = (table: Slot[][], slotColor: Slot.RED | Slot.BLUE) => {
    for (let i = 1; i < BOARD_SIZE - 1; i++) {
      for (let j = 1; j < BOARD_SIZE - 1; j++) {
        checkForLineOfThree(table, i, j, slotColor);
      }
    }
  }

  /**
   * counts consecutive tokens in any given direction
   */
  const checkForLineOfThree = (table: Slot[][], row: number, col: number, slotColor: Slot.RED | Slot.BLUE): boolean => {
    const checkLine = (firstSlot: Slot, secondSlot: Slot, thirdSlot: Slot) => {
      if (firstSlot === slotColor && secondSlot === slotColor && thirdSlot === slotColor) {
        console.log('we have a winner!');
        if (winner !== null && winner !== slotColor) {
          console.log('we found a tie!');
        }
        setWinner(Slot.RED);
        return true;
      }
      return false;
    }

    if (row < 1 || col < 1 || row >= BOARD_SIZE - 1 || col >= BOARD_SIZE - 1) {
      return false; // found a corner or edge slot, therefore do nothing
    }
    const firstSlot = table[row][col];
    let secondSlot;
    let thirdSlot;

    // vertical line
    secondSlot = table[row - 1][col];
    thirdSlot = table[row + 1][col];
    if (checkLine(firstSlot, secondSlot, thirdSlot)) {
      return true;
    }

    // horizontal line
    secondSlot = table[row][col - 1];
    thirdSlot = table[row][col + 1];
    if (checkLine(firstSlot, secondSlot, thirdSlot)) {
      return true;
    }

    // upleft to downright diagonal
    secondSlot = table[row - 1][col - 1];
    thirdSlot = table[row + 1][col + 1];
    if (checkLine(firstSlot, secondSlot, thirdSlot)) {
      return true;
    }

    // downleft to upright diagonal
    secondSlot = table[row + 1][col - 1];
    thirdSlot = table[row - 1][col + 1];
    if (checkLine(firstSlot, secondSlot, thirdSlot)) {
      return true;
    }

    return false;
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
  }

  // todo: this doesnt trigger, because setWinner is resolving asynchronously after our checkForWinner call
  const checkForWinner = () => {
    if (winner !== null) {
      const victoryString = winner + ' is the winner!!';
      setGameStatusText(victoryString);
    }
  }

  const resetGame = () => {
    const newTable = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(Slot.EMPTY));
    setTableData(newTable);
    setWinner(null);
    setGameStatusText("Welcome to the Game Board");
  }

  return (
    <>
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/booptitle.webp"
          alt="boop title"
          width={250}
          height={100}
          priority
        />
        <h1>{gameStatusText}</h1>
        <GameBoard tableData={tableData} onCellClick={onCellClick} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <button onClick={resetGame}>Reset</button>
      </footer>
    </>
    
  );
}

export default GameManager;

