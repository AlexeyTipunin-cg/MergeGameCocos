import { EventTarget } from "cc";
import { GameEvents } from "./GameEvents";

export class ShuffleController {
  public onShuffleUpdate: EventTarget = new EventTarget();
  private _shuffles: number = 0;

  public get shuffles(): number {
    return this.shuffles;
  }

  public setShuffles(value: number) {
    this._shuffles = value;

  }

  public makeShaffle() {
    this._shuffles--;
    this.onShuffleUpdate.emit(GameEvents.onShuffle, this.shuffles);
  }
}
