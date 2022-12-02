import { _decorator, Component, Node, Prefab, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class Field {

    private width: number;
    private height: number;
    private row: Number;
    private col: Number;

    public cells: Node[] = [];

    constructor(width, height, row, col) {
        this.width = width;
        this.height = height;
        this.row = row;
        this.col = col;
    }


    public getCell(pos: Vec3): Node {
        let cellWidth = 171;
        let cellHeight = 192;
        let y = Math.floor(pos.y/cellHeight );
        let x = Math.floor(pos.x/cellWidth) ;
        console.log("x---->" + x);
        console.log("y---->" + y);

        if (this.cells[y* 9 + x] != null) {
            this.cells[y* 9 + x].destroy();
            this.cells[y* 9 + x] = null;
        }

        return this.cells[y* 9 + x];
        
    }
}


