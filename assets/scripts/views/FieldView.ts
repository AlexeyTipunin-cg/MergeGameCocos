import {
  _decorator,
  Component,
  Node,
  EventTarget,
  UITransform,
  Vec2,
  tween,
  Vec3,
  UIOpacity,
} from "cc";
import { AnimationData } from "../AnimationData";
import { Cell, CellData } from "../Cell";
import { CellPrefabsFactory } from "../CellPrefabsFactory";
import { Field } from "../field/Field";
import { FieldAnimations } from "../field/FieldAnimations";
import { FieldInput } from "../field/FieldInput";
import { GameEvents } from "../GameEvents";
import { FieldChangeData } from '../field/FieldChangeData';
import { Button, animation } from 'cc';
import { CellTypes } from '../CellTypes';
import { DisappearAnimation } from '../DisappearAnimation';
import { AnimationEvents } from '../AnimationEvents';
const { ccclass, property } = _decorator;

@ccclass("FieldView")
export class FieldView extends Component {
  @property({ type: CellPrefabsFactory })
  private cellsFactory: CellPrefabsFactory | null = null;

  @property({ type: Node })
  private fieldParent: Node = null;

  @property({ type: FieldInput })
  private input: FieldInput = null;

  @property({ type: Button })
  private bombButton: Button

  private animation: FieldAnimations = new FieldAnimations();
  private disappearAnimation: DisappearAnimation = new DisappearAnimation();

  private cellDataToView = new Map<CellData, Cell>();

  public onTouchField: EventTarget = new EventTarget();
  public onBombButtonClick: EventTarget = new EventTarget();

  start() {
    this.input.onFieldTouch.on(GameEvents.onTouchField, this.onTouchFieldCallback, this);
    this.bombButton.node.on(Button.EventType.CLICK, this.onBombButtonClickCb, this);
  }

  public resetGame(): void {
    for (const cellComponent of this.cellDataToView.values()) {
      cellComponent.node.destroy();
    }

    this.cellDataToView.clear();
  }

  private createCell(cellData: CellData): Cell {
    let cellComponent = this.cellsFactory.createCell(cellData);
    cellComponent.node.parent = this.fieldParent;
    let s: UITransform = cellComponent.getComponent(UITransform);
    cellComponent.node.setPosition(
      s.width * cellData.virtualCol,
      s.height * cellData.virtualRow
    );
    this.cellDataToView.set(cellComponent.cellData, cellComponent);
    return cellComponent;
  }

  public destroyCells(fieldChangeData: FieldChangeData) {
    this.destroyAnimation(fieldChangeData);
  }

  public createCells(cellsToCreate: CellData[]) {
    for (const cellData of cellsToCreate) {
      this.createCell(cellData);
    }
  }

  private destroyCell(cellToDestroy: CellData) {
    let cellView = this.cellDataToView.get(cellToDestroy);
    this.cellDataToView.delete(cellToDestroy);
    cellView.node.destroy();
  }

  private onBombButtonClickCb() {
    this.onBombButtonClick.emit(GameEvents.onCellTypeMod, CellTypes.BOMB);
  }

  private onTouchFieldCallback(pos: Vec3) {
    if (!this.animation.isCompleted() && !this.disappearAnimation.isDone()) {
      return;
    }

    this.onTouchField.emit(GameEvents.onTouchField, pos);
  }

  private createFieldDif(oldField: Field, newField: Field): AnimationData[][] {
    let animationData: AnimationData[][] = new Array(oldField.col);
    for (let index = 0; index < animationData.length; index++) {
      let indices = oldField.getColumnIndices(index);

      let col = [];
      animationData[index] = col;

      for (const cellIndex of indices) {
        const element = newField.cells[cellIndex];
        const oElement = oldField.cells[cellIndex];
        if (element === oElement) {
          continue;
        }

        let targetNode = this.cellDataToView.get(element).node;

        let animData: AnimationData = new AnimationData();
        animData.target = targetNode;
        animData.from = targetNode.position;
        animData.to = oldField.indexToFieldPos(cellIndex);
        col.push(animData);
      }
    }

    return animationData;
  }

  private destroyAnimation(fieldChangeData: FieldChangeData) {
    let opacityComponent = fieldChangeData.killedCells.map((value) =>
      this.cellDataToView.get(value).getComponent(UIOpacity)
    );

    this.disappearAnimation.onComplete.once(AnimationEvents.onComplete, () => this.updateField(fieldChangeData), this)
    this.disappearAnimation.playAnimation(opacityComponent);
  }

  private updateField(fieldChangeData: FieldChangeData) {
    fieldChangeData.killedCells.forEach((value) => this.destroyCell(value));
    this.createCells(fieldChangeData.createdCells);
    let animDatas = this.createFieldDif(fieldChangeData.oldField, fieldChangeData.newField);
    this.animation.animateField(1000, animDatas);
  }
}
