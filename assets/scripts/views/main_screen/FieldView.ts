import { _decorator, Component, Node, EventTarget, UITransform, Vec3, UIOpacity, TweenSystem } from 'cc';
import { AnimationData } from "../../animation/AnimationData";
import { Cell } from "../Cell";
import { CellData } from "../../data/CellData";
import { CellPrefabsFactory } from "../../CellPrefabsFactory";
import { Field } from "../../field/Field";
import { FieldAnimations } from "../../animation/FieldAnimations";
import { FieldInput } from "../../field/FieldInput";
import { GameEvents } from "../../data/GameEvents";
import { FieldChangeData } from '../../field/FieldChangeData';
import { DisappearAnimation } from '../../animation/DisappearAnimation';
import { AnimationEvents } from '../../animation/AnimationEvents';
const { ccclass, property } = _decorator;

@ccclass("FieldView")
export class FieldView extends Component {
  @property({ type: CellPrefabsFactory })
  private cellsFactory: CellPrefabsFactory | null = null;

  @property({ type: Node })
  private fieldParent: Node = null;

  @property({ type: FieldInput })
  private input: FieldInput = null;

  private animation: FieldAnimations = new FieldAnimations();
  private disappearAnimation: DisappearAnimation = new DisappearAnimation();

  private cellDataToView = new Map<CellData, Cell>();
  public onTouchField: EventTarget = new EventTarget();

  start() {
    this.input.onFieldTouch.on(GameEvents.onTouchField, this.onTouchFieldCallback, this);
  }

  onDestroy() {
    TweenSystem.instance.ActionManager.removeAllActions();
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

  private onTouchFieldCallback(pos: Vec3) {
    if (!this.animation.isCompleted() || !this.disappearAnimation.isDone()) {
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
        animData.to = newField.indexToFieldPos(cellIndex);
        col.push(animData);
      }
    }

    return animationData;
  }

  private createFieldDifGeneric(oldField: Field, newField: Field): AnimationData[] {
    let animationData: AnimationData[] = [];
    for (let index = 0; index < newField.cellsCount; index++) {
      const element = newField.cells[index];
      let targetNode = this.cellDataToView.get(element).node;
      let currentIndex = newField.screenPosToIndex(targetNode.position);

      if (index == currentIndex) {
        continue;
      }

      let animData: AnimationData = new AnimationData();
      animData.target = targetNode;
      animData.from = targetNode.position;
      animData.to = newField.indexToFieldPos(index);

      animationData.push(animData);
    }

    return animationData
  }

  private destroyAnimation(fieldChangeData: FieldChangeData) {
    let opacityComponent = fieldChangeData.killedCells.map((value) =>
      this.cellDataToView.get(value).getComponent(UIOpacity)
    );

    this.disappearAnimation.onComplete.once(AnimationEvents.onComplete, () => this.updateField(fieldChangeData), this)
    this.disappearAnimation.playAnimation(opacityComponent);
  }

  private updateField(fieldChangeData: FieldChangeData) {
    if (fieldChangeData.createdCells.length == 0 && fieldChangeData.killedCells.length == 0) {
      let animDatas = this.createFieldDifGeneric(fieldChangeData.oldField, fieldChangeData.newField);
      this.animation.animateShuffle(1000, animDatas);
    } else {
      fieldChangeData.killedCells.forEach((value) => this.destroyCell(value));
      this.createCells(fieldChangeData.createdCells);
      let animDatas = this.createFieldDif(fieldChangeData.oldField, fieldChangeData.newField);
      this.animation.animateField(1000, animDatas);
    }

  }
}
