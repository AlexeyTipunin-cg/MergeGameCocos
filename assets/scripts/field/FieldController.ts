import { FieldModel } from './FieldModel';
import { FieldView } from '../views/FieldView';
import { GameEvents } from '../GameEvents';
import { CellData } from '../Cell';
import { Vec3, EventTarget } from 'cc';
import { GameConfig } from '../GameConfig';
import { Field } from './Field';
import { FieldChangeData } from './FieldChangeData';
import { CellTypes } from '../CellTypes';

export class FieldController {

    private fieldModel: FieldModel;
    private fieldView: FieldView;

    public onCellDestoyed: EventTarget = new EventTarget();
    public onNoPairs: EventTarget = new EventTarget();

    constructor(fieldModel: FieldModel, fieldView: FieldView, ) {
        this.fieldModel = fieldModel;
        this.fieldView = fieldView;
        this.fieldView.onTouchField.on(GameEvents.onTouchField, this.touchedField, this);
        this.fieldView.onBombButtonClick.on(GameEvents.onCellTypeMod, this.onApplyModifier, this);
        this.fieldModel.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onCellsDestroy, this);
        this.fieldModel.onCellsCreated.on(GameEvents.onCellsCreated, this.createCells, this);
        this.fieldModel.onNoPairs.on(GameEvents.onCellsCreated, this.onNoPairsCb, this);

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

    private onCellsDestroy(fieldChangeData : FieldChangeData): void {
        this.onCellDestoyed.emit(GameEvents.onCellsDestoy, fieldChangeData.killedCells.length);
        this.fieldView.destroyCells(fieldChangeData);
    }

    private createCells(cells: CellData[]): void {
        this.fieldView.createCells(cells);
    }

    private onApplyModifier(cellType:CellTypes){
        this.fieldModel.addModifier(cellType);
    }

    private onNoPairsCb(){
        this.onNoPairs.emit(GameEvents.onNoPairs);
    }
}