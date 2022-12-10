import { EventTarget } from "cc";
import { GameEvents } from "./GameEvents";

export class ScoreModel {
  public onScoreUpdate: EventTarget = new EventTarget();
  private playerScore: number = 0;

  public get score(): number {
    return this.playerScore;
  }

  public setScore(value: number) {
    this.playerScore += value;
    this.onScoreUpdate.emit(GameEvents.onScoreUpdate, this.playerScore);
  }

  public reset() {
    this.playerScore = 0;
    this.onScoreUpdate.emit(GameEvents.onScoreUpdate, this.playerScore);
  }
}
