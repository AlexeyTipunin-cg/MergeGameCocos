import { Vec3 } from "cc";
import { Cell } from "./Cell";
import { Field } from "./Field";

export class SimpleStrategy {

    public calculateKilledCells(field: Field, pos: Vec3) {
        let index = field.posToIndex(pos);

        let visited = new Array(field.cells.length);
        visited.fill(false);


        let indexArray: number[] = [index];
        let res = []
        while (indexArray) {

            let curIndex = indexArray.pop();
            if (visited[curIndex]) continue;
            if (field.cells[curIndex].getComponent(Cell).cellType !== field.cells[index].getComponent(Cell).cellType) continue;

            res.push(curIndex);

            visited[curIndex] = true;
            let nn = this.findNeibours(field, curIndex);
            indexArray.concat(nn);
        }

        return res;
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