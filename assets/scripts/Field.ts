import { _decorator, Node, Vec3 } from 'cc';

export class Field {

    private width: number;
    private height: number;
    private row: number;
    private col: number;

    public cells: Node[] = [];

    constructor(width, height, row, col) {
        this.width = width;
        this.height = height;
        this.row = row;
        this.col = col;
    }


    public getCell(pos: Vec3): Node {
        let index = this.posToIndex(pos);
        return this.cells[index];
    }

    public removeCell(pos: Vec3): void {
        let index = this.posToIndex(pos);
        this.cells[index] = null;
    }

    private posToIndex(pos: Vec3) {
        let cellWidth = 171;
        let cellHeight = 192;
        let y = Math.floor(pos.y / this.height);
        let x = Math.floor(pos.x / this.width);
        console.log("x---->" + x);
        console.log("y---->" + y);
        let index = y * this.row + x;
        return index;
    }
}


