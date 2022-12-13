import { CellTypes } from "../../data/CellTypes";
import { FieldChangeData } from '../../field/FieldChangeData';

export interface IFieldStrategy {
    onTouch(index: number, cellType: CellTypes): FieldChangeData | null;
}