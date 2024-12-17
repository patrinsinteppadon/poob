export enum Slot {
    RED = 'r',
    BLUE = 'b',
    EMPTY = 'x',
  }

export enum TokenType {
  KITTEN = 'kitten',
  CHONKER = 'chonker'
}

export interface InputHistory {
  rowIndex: number;
  colIndex: number;
  player: Slot.RED | Slot.BLUE;
  token: TokenType;
}