import { Vec3 } from "cc";
import { Cell } from "./Cell";
import { Field } from "./field/Field";

export class SimpleCellStrategy {

    public calculateKilledCells(field: Field, clickedCellIndex: number): number[] {

        let visited = new Array(field.cells.length);
        visited.fill(false);


        let indexArray: number[] = [clickedCellIndex];
        let res = []
        while (indexArray.length > 0) {

            let curIndex = indexArray.pop();
            if (visited[curIndex]) continue;
            if (field.cells[curIndex] === null) continue;
            if (field.cells[curIndex].type !== field.cells[clickedCellIndex].type) continue;

            res.push(curIndex);

            visited[curIndex] = true;
            let nn = this.findNeibours(field, curIndex);
            indexArray = indexArray.concat(nn);
        }

        if (res.length > 1) {
            return res;
        }

        return [];
    }

    private findNeibours(field: Field, index: number): number[] {
        let neigh = []
        let length = field.cells.length;
        let low = index - field.row;
        if (low >= 0) {
            neigh.push(low);
        }
        let up = index + field.row;
        if (up < length) {
            neigh.push(up);
        }

        if ((index % field.row) != 0) {
            let left = index - 1;
            neigh.push(left);
        }

        if ((index + 1) % field.row != 0) {
            let right = index + 1;
            neigh.push(right);
        }

        return neigh;
    }

}