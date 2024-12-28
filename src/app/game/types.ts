export enum Slot {
    RED = 'r',
    BLUE = 'b',
    EMPTY = 'x',
  }

export enum TokenType {
  KITTEN = 'kitten',
  CHONKER = 'chonker'
}

export enum GameStatusMessages {
  WELCOME = "Welcome to the Game Board",
  RED_PLAYER_TURN = "It is Red Player's turn",
  BLUE_PLAYER_TURN = "It is Blue Player's turn",
}

export interface InputHistory {
  rowIndex: number;
  colIndex: number;
  player: Slot.RED | Slot.BLUE;
  token: TokenType;
}