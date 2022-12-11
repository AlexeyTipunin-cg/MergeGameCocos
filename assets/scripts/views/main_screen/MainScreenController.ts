import { MainScreenView } from './MainScreenView';
import { FieldModel } from '../../field/FieldModel';
import { GameEvents } from '../../data/GameEvents';
import { GameConfig } from '../../config/GameConfig';
import { Button, Vec3 } from 'cc';
import { FieldChangeData } from '../../field/FieldChangeData';
import { CellData } from '../../data/CellData';
import { CellTypes } from '../../data/CellTypes';
import { ResourcesModel } from '../../models/ResourcesModel';
import { ResourceTypes } from '../../data/ResourceItem';
export class MainScreenController {
    private fieldModel: FieldModel;
    private resourcesModel: ResourcesModel;
    private mainScreenView: MainScreenView = null;

    constructor(fieldModel: FieldModel, resourcesModel: ResourcesModel, mainScreenView: MainScreenView) {
        this.fieldModel = fieldModel;
        this.resourcesModel = resourcesModel;
        this.mainScreenView = mainScreenView;

        this.mainScreenView.fieldView.onTouchField.on(GameEvents.onTouchField, this.touchedField, this);;
        this.fieldModel.onCellsDestoy.on(GameEvents.onCellsDestoy, this.onCellsDestroy, this);
        this.fieldModel.onCellsCreated.on(GameEvents.onCellsCreated, this.createCells, this);

        this.mainScreenView.onShuffleBtnClick.on(Button.EventType.CLICK, this.onShuffleBtnClick, this);
        this.resourcesModel.subscribe(ResourceTypes.Shuffle, this.onSuffleApplied.bind(this));

        this.mainScreenView.onBombBtnClick.on(Button.EventType.CLICK, this.onBombBtnClick, this);
        this.resourcesModel.subscribe(ResourceTypes.Bomb, this.onBombApplied.bind(this))
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
        this.mainScreenView.fieldView.destroyCells(fieldChangeData);
    }

    private createCells(cells: CellData[]): void {
        this.mainScreenView.fieldView.createCells(cells);
    }

    private onBombApplied(count: number) {
        this.fieldModel.addModifier(CellTypes.BOMB);
        this.mainScreenView.updateBombCount(count);
    }

    private onBombBtnClick() {
        this.resourcesModel.spendResource(ResourceTypes.Bomb)
    }

    private onSuffleApplied(count: number) {
        this.fieldModel.shuffle();
        this.mainScreenView.updateShuffleCount(count);
    }

    private onShuffleBtnClick() {
        this.resourcesModel.spendResource(ResourceTypes.Shuffle)
    }
}