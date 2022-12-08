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
import { FieldAnimations } from "../field/FieldAnimations";
import { FieldInput } from "../field/FieldInput";
import { GameEvents } from "../GameEvents";
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

  private cellDataToView = new Map<CellData, Cell>();

  public onTouchField: EventTarget = new EventTarget();

  start() {
    this.input.onFieldTouch.on(GameEvents.onTouchField, this.onTouchFieldCallback, this);
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
      s.width * cellData.col,
      s.height * cellData.row
    );
    this.cellDataToView.set(cellComponent.cellData, cellComponent);
    return cellComponent;
  }

  public destroyCells(cellsToDestroy: CellData[]) {
    this.destroyAnimation(cellsToDestroy);
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
    if (!this.animation.isCompleted()) {
      return;
    }

    this.onTouchField.emit(GameEvents.onTouchField, pos);
  }

  // private createFieldDif(
  //   oldField: CellData[],
  //   newField: CellData[]
  // ): AnimationData[][] {
  //   let animationData: AnimationData[][] = new Array(this.fieldData.col);
  //   for (let index = 0; index < this.fieldData.col; index++) {
  //     let indices = this.fieldData.getColumnIndices(index);

  //     let col = [];
  //     animationData[index] = col;

  //     for (const cellIndex of indices) {
  //       const element = newField[cellIndex];
  //       const oElement = oldField[cellIndex];
  //       if (element === oElement) {
  //         continue;
  //       }

  //       let targetNode = this.cellDataToView.get(element).node;

  //       let animData: AnimationData = new AnimationData();
  //       animData.target = targetNode;
  //       animData.from = targetNode.position;
  //       animData.to = this.fieldData.indexToFieldPos(cellIndex);
  //       col.push(animData);
  //     }
  //   }

  //   return animationData;
  // }

  private destroyAnimation(killedCells: CellData[]) {
    let opacityComponent = killedCells.map((value) =>
      this.cellDataToView.get(value).getComponent(UIOpacity)
    );

    let alpha = new Vec2(255);
    tween(alpha).to(0.2, { x: 0 }, {
      onUpdate: (target) => {
        for (const opComponent of opacityComponent) {
          opComponent.opacity = (target as Vec2).x;
        }
      },
    }
    )
      .call(() => {
        killedCells.forEach((value) => this.destroyCell(value));
      })
      .start();
  }
}
