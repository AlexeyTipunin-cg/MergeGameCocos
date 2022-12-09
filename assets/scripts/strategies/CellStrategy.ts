import { Field } from '../field/Field';
export interface CellStrategy {
    getDestroyedCells(fild: Field, targetCell: number): number[];
}
