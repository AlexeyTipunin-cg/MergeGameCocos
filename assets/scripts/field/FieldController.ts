import { FieldModel } from './FieldModel';
import { FieldView } from '../views/main_screen/FieldView';
import { GameEvents } from '../GameEvents';
import { CellData } from "../CellData";
import { Vec3, EventTarget } from 'cc';
import { GameConfig } from '../GameConfig';
import { Field } from './Field';
import { FieldChangeData } from './FieldChangeData';
import { CellTypes } from '../CellTypes';
import { ShuffleModel } from '../SuffleModel';

export class FieldController {

    private fieldModel: FieldModel;
    private fieldView: FieldView;
    private shuffleModel: ShuffleModel;

    public onCellDestoyed: EventTarget = new EventTarget();
    public onNoPairs: EventTarget = new EventTarget();

    constructor(fieldModel: FieldModel, shuffleModel: ShuffleModel, fieldView: FieldView) {
        this.fieldModel = fieldModel;
        this.fieldView = fieldView;
        this.shuffleModel = shuffleModel;
        this.fieldView.onTouchField.on(GameEvents.onTouchField, this.touchedField, this);
        // this.fieldView.onBombButtonClick.on(GameEvents.onCellTypeMod, this.onApplyModifier, this);
        this.fieldModel.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onCellsDestroy, this);
        this.fieldModel.onCellsCreated.on(GameEvents.onCellsCreated, this.createCells, this);
        this.fieldModel.onNoPairs.on(GameEvents.onCellsCreated, this.onNoPairsCb, this);
        this.shuffleModel.onResourceUpdate.on(GameEvents.onShuffle, this.onShufflesUpdate, this);

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

    private onCellsDestroy(fieldChangeData: FieldChangeData): void {
        this.onCellDestoyed.emit(GameEvents.onCellsDestoy, fieldChangeData.killedCells.length);
        this.fieldView.destroyCells(fieldChangeData);
    }

    private createCells(cells: CellData[]): void {
        this.fieldView.createCells(cells);
    }

    private onApplyModifier(cellType: CellTypes) {
        this.fieldModel.addModifier(cellType);
    }

    private onShufflesUpdate(){
        this.fieldModel.shuffle();
    }

    private onNoPairsCb() {
        this.onNoPairs.emit(GameEvents.onNoPairs);
    }
}