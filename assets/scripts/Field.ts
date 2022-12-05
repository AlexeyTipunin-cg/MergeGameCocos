import { _decorator, Node, Vec3, Vec2 } from 'cc';

export class Field {

    private cellWidth: number;
    private cellHeight: number;
    public row: number;
    private col: number;

    public cells: Node[] = [];

    constructor(width, height, row, col) {
        this.cellWidth = width;
        this.cellHeight = height;
        this.row = row;
        this.col = col;
    }


    public getCell(pos: Vec3): Node {
        let index = this.screenPosToIndex(pos);
        return this.cells[index];
    }

    public indexToXY(index: number): Vec2 {
        let y = Math.floor(index / this.col);
        let x = Math.floor(index % this.col);
        return new Vec2(x, y);
    }



    public removeCell(pos: Vec3): void {
        let index = this.screenPosToIndex(pos);
        this.cells[index] = null;
    }



    public screenPosToIndex(pos: Vec3) {
        let y = Math.floor(pos.y / this.cellHeight);
        let x = Math.floor(pos.x / this.cellWidth);
        console.log("x---->" + x);
        console.log("y---->" + y);
        let index = y * this.row + x;
        return index;
    }
}


