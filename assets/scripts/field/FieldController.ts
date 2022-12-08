import { FieldModel } from './FieldModel';
import { FieldView } from '../views/FieldView';
import { GameEvents } from '../GameEvents';
import { CellData } from '../Cell';
import { Vec3, EventTarget } from 'cc';
import { GameConfig } from '../GameConfig';
import { Field } from './Field';

export class FieldController {

    private fieldModel: FieldModel;
    private fieldView: FieldView;

    public onCellDestoyed: EventTarget = new EventTarget()

    constructor(fieldModel: FieldModel, fieldView: FieldView) {
        this.fieldModel = fieldModel;
        this.fieldView = fieldView;
        this.fieldView.onTouchField.on(GameEvents.onTouchField, this.touchedField, this);
        this.fieldModel.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onCellsDestroy, this);
        this.fieldModel.onCellsCreated.on(GameEvents.onCellsCreated, this.createCells, this)
    }

    public createField(gameConfig: GameConfig): void {
        this.fieldModel.startGame(gameConfig)
    }

    public resetField(): void {
        this.fieldView.resetGame();
    }

    private touchedField(pos: Vec3): void {
        this.fieldModel.onTouch(pos);
    }

    private onCellsDestroy(killedCells: CellData[], createdCells: CellData[], oldField: Field, newField: Field): void {
        this.onCellDestoyed.emit(GameEvents.onCellsDestoy, killedCells.length);
        this.fieldView.destroyCells(killedCells, createdCells, oldField, newField);
    }

    private createCells(cells: CellData[]): void {
        this.fieldView.createCells(cells);
    }
}