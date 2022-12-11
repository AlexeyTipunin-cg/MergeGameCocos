import { EventTarget } from "cc";
import { GameEvents } from "../data/GameEvents";
import { GameConfig } from '../GameConfig';

export class ShuffleModel {
  public onResourceUpdate: EventTarget = new EventTarget();
  private _resourceCount: number = 0;
  private gameConfig: GameConfig = null;

  public setConfig(gameConfig: GameConfig): void {
    this.gameConfig = gameConfig;
  }

  public init() {
    this.shuffles = this.gameConfig.shufflesCount;
  }

  public get shuffles(): number {
    return this._resourceCount;
  }

  private set shuffles(count: number) {
    this._resourceCount = count;
    this.onResourceUpdate.emit(GameEvents.onShuffle, this.shuffles);
  }

  public makeShaffle(): void {
    if (this.shuffles > 0) {
      this.shuffles--;
    }
  }
}
