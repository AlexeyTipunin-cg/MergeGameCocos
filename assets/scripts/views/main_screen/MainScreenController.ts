import { MainScreenView } from './MainScreenView';
import { ScoreModel } from '../../ScoreModel';
import { TurnsModel } from '../../TurnsModel';
import { FieldModel } from '../../field/FieldModel';
import { GameEvents } from '../../GameEvents';
import { ShuffleModel } from '../../SuffleModel';
import { GameConfig } from '../../GameConfig';
import { Vec3, EventTarget } from 'cc';
import { FieldChangeData } from '../../field/FieldChangeData';
import { CellData } from '../../CellData';
import { CellTypes } from '../../CellTypes';
export class MainScreenController {
    private fieldModel: FieldModel;
    private scoreModel: ScoreModel;
    private turnsModel: TurnsModel;
    private shuffleModel: ShuffleModel;
    private mainScreenView: MainScreenView = null;

    public onCellDestoyed: EventTarget = new EventTarget();
    public onNoPairs: EventTarget = new EventTarget();


    constructor(fieldModel: FieldModel, scoreModel: ScoreModel, turnsModel: TurnsModel, shuffleModel: ShuffleModel, mainScreenView: MainScreenView) {
        this.fieldModel = fieldModel;
        this.scoreModel = scoreModel;
        this.turnsModel = turnsModel;
        this.shuffleModel = shuffleModel
        this.mainScreenView = mainScreenView;
        this.mainScreenView.fieldView.onTouchField.on(GameEvents.onTouchField, this.touchedField, this);
        // this.fieldView.onBombButtonClick.on(GameEvents.onCellTypeMod, this.onApplyModifier, this);
        this.fieldModel.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onCellsDestroy, this);
        this.fieldModel.onCellsCreated.on(GameEvents.onCellsCreated, this.createCells, this);
        this.fieldModel.onNoPairs.on(GameEvents.onCellsCreated, this.onNoPairsCb, this);
        this.shuffleModel.onShuffleUpdate.on(GameEvents.onShuffle, this.onShufflesUpdate, this);
    }


    public createField(gameConfig: GameConfig): void {
        this.fieldModel.startGame(gameConfig)
    }

    public resetField(): void {
        this.mainScreenView.fieldView.resetGame();
    }

    private touchedField(pos: Vec3): void {
        this.fieldModel.onTouch(pos);
    }

    private onCellsDestroy(fieldChangeData: FieldChangeData): void {
        this.onCellDestoyed.emit(GameEvents.onCellsDestoy, fieldChangeData.killedCells.length);
        this.mainScreenView.fieldView.destroyCells(fieldChangeData);
    }

    private createCells(cells: CellData[]): void {
        this.mainScreenView.fieldView.createCells(cells);
    }

    private onApplyModifier(cellType: CellTypes) {
        this.fieldModel.addModifier(cellType);
    }

    private onShufflesUpdate() {
        this.fieldModel.shuffle();
    }

    private onNoPairsCb() {
        this.onNoPairs.emit(GameEvents.onNoPairs);
    }
}