import { CellData } from "../CellData";
import { Field } from './Field';
export class FieldChangeData {
    public readonly killedCells: CellData[];
    public readonly createdCells: CellData[];
    public readonly oldField: Field;
    public readonly newField: Field;

    constructor(killedCells: CellData[], createdCells: CellData[], oldField: Field, newField: Field) {
        this.killedCells = killedCells;
        this.createdCells = createdCells;
        this.oldField = oldField;
        this.newField = newField;
    }
}