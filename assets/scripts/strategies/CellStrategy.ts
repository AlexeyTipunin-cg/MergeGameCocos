import { Field } from '../field/Field';
export interface CellStrategy {
    getCellsToDestroy(fild: Field, targetCell: number): number[];
}
