import { EventTarget } from "cc";
import { GameEvents } from "./GameEvents";
import { GameConfig } from './GameConfig';

export class ShuffleModel {
  public onShuffleUpdate: EventTarget = new EventTarget();
  private _shuffles: number = 0;
  private gameConfig: GameConfig = null;

  public setConfig(gameConfig: GameConfig): void {
    this.gameConfig = gameConfig;
  }

  public init() {
    this.shuffles = this.gameConfig.shufflesCount;
  }

  public get shuffles(): number {
    return this._shuffles;
  }

  private set shuffles(count: number) {
    this._shuffles = count;
    this.onShuffleUpdate.emit(GameEvents.onShuffle, this.shuffles);
  }



  public makeShaffle(): void {
    this.shuffles--;
  }
}
