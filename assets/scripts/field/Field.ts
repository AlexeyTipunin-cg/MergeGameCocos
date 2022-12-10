import { _decorator, Node, Vec3, Vec2 } from "cc";
import { CellData } from "../Cell";

export class Field {
  private cellWidth: number;
  public cellHeight: number;
  public row: number;
  public col: number;

  public cells: CellData[] = [];

  constructor(cellWidth: number, cellHeight: number, row: number, col: number) {
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.row = row;
    this.col = col;
  }

  public get sizeX(): number {
    return this.col;
  }

  public get sizeY(): number {
    return this.row;
  }

  public get cellsCount(): number{
    return this.cells.length;
  }

  public getCell(pos: Vec3): CellData {
    let index = this.screenPosToIndex(pos);
    return this.cells[index];
  }

  public indexToXY(index: number): Vec2 {
    let y = Math.floor(index / this.col);
    let x = Math.floor(index % this.col);
    return new Vec2(x, y);
  }

  public XYToindex(x: number, y: number): number {
    return y * this.row + x;
  }

  public getColumnIndices(columnIndex: number): number[] {
    let arrCol = [];
    for (let index = columnIndex; index < this.cells.length; index += this.col) {
      arrCol.push(index);
    }

    return arrCol;
  }

  public removeCell(pos: Vec3): void {
    let index = this.screenPosToIndex(pos);
    this.cells[index] = null;
  }

  public indexToFieldPos(index: number) {
    let y = Math.floor(index / this.col);
    let x = Math.floor(index % this.col);
    return new Vec3(x * this.cellWidth, y * this.cellHeight);
  }

  public screenPosToIndex(pos: Vec3) {
    let y = Math.floor(pos.y / this.cellHeight);
    let x = Math.floor(pos.x / this.cellWidth);
    let index = y * this.row + x;
    return index;
  }
}
