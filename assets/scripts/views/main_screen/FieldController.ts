import { MainScreenView } from './MainScreenView';
import { FieldModel } from '../../models/FieldModel';
import { GameEvents } from '../../data/GameEvents';
import { GameConfig } from '../../config/GameConfig';
import { Button, Vec3 } from 'cc';
import { FieldChangeData } from '../../field/FieldChangeData';
import { CellData } from '../../data/CellData';
import { CellTypes } from '../../data/CellTypes';
import { ResourcesModel } from '../../models/ResourcesModel';
import { ResourceTypes } from '../../data/ResourceItem';
export class FieldController {
    private fieldModel: FieldModel;
    private resourcesModel: ResourcesModel;
    private mainScreenView: MainScreenView = null;

    constructor(fieldModel: FieldModel, resourcesModel: ResourcesModel, mainScreenView: MainScreenView) {
        this.fieldModel = fieldModel;
        this.resourcesModel = resourcesModel;
        this.mainScreenView = mainScreenView;

        this.mainScreenView.fieldView.onTouchField.on(GameEvents.onTouchField, this.touchedField, this);;
        this.fieldModel.onCellsDestoy.on(GameEvents.onFieldUpdate, this.onCellsDestroy, this);
        this.fieldModel.onCellsCreated.on(GameEvents.onCellsCreated, this.createCells, this);

        this.mainScreenView.onShuffleBtnClick.on(Button.EventType.CLICK, this.onShuffleBtnClick, this);
        this.resourcesModel.listenResource(ResourceTypes.Shuffle, GameEvents.onResourceSpend, this.onSuffleApplied.bind(this));
        this.resourcesModel.listenResource(ResourceTypes.Shuffle, GameEvents.onResourceUpdated, this.onShuffleCountUpdated.bind(this));

        this.mainScreenView.onBombBtnClick.on(Button.EventType.CLICK, this.onBombBtnClick, this);
        this.resourcesModel.listenResource(ResourceTypes.Bomb, GameEvents.onResourceSpend, this.onBombApplied.bind(this));
        this.resourcesModel.listenResource(ResourceTypes.Bomb, GameEvents.onResourceUpdated, this.onBombCountUpdated.bind(this));

        this.mainScreenView.onPairBtnClick.on(Button.EventType.CLICK, this.onPairBtnClick, this);
        this.resourcesModel.listenResource(ResourceTypes.Pair, GameEvents.onResourceSpend, this.onPairsApplied.bind(this));
        this.resourcesModel.listenResource(ResourceTypes.Pair, GameEvents.onResourceUpdated, this.onPairCountUpdated.bind(this));

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
    }

    private onBombCountUpdated(count: number) {
        this.mainScreenView.updateBombCount(count);
    }

    private onBombBtnClick() {
        this.resourcesModel.spendResource(ResourceTypes.Bomb, 1)
    }

    private onShuffleCountUpdated(count: number) {
        this.mainScreenView.updateShuffleCount(count);
    }

    private onSuffleApplied(count: number) {
        this.fieldModel.shuffle();

    }

    private onShuffleBtnClick() {
        this.resourcesModel.spendResource(ResourceTypes.Shuffle, 1)
    }

    private onPairsApplied(count: number) {
        this.fieldModel.changeFieldBehaviour()
    }

    private onPairCountUpdated(count: number) {
        this.mainScreenView.updatePairCount(count);
    }

    private onPairBtnClick() {
        this.resourcesModel.spendResource(ResourceTypes.Pair, 1)
    }
}