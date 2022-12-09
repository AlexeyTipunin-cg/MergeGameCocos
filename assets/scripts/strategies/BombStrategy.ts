import { Field } from "../field/Field";
import { CellStrategy } from './CellStrategy';

export class BombStrategy implements CellStrategy {

    public getDestroyedCells(field: Field, clickedCellIndex: number): number[] {

        let cellToKill = this.getRadius(field, clickedCellIndex, 1);

        return cellToKill;
    }

    private getRadius(field: Field, clickedIndex: number, radius: number): number[] {
        let xy = field.indexToXY(clickedIndex);
        let cells = [];
        for (let y = xy.y - radius; y <= xy.y + radius; y++) {

            for (let x = xy.x - radius; x <= xy.x + radius; x++) {
                let index = field.XYToindex(x, y);
                let vec = field.indexToXY(index);

                if (index >= 0 && index < field.cells.length && vec.y == y) {
                    cells.push(index)
                }
            }
        }
        return cells;
    }

}