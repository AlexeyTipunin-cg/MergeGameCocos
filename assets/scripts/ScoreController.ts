import { EventTarget } from 'cc';
import { GameEvents } from './GameEvents';

export class ScoreController {

    public onScoreUpdate: EventTarget = new EventTarget();
    private playerScore: number = 0;

    public get score(): number {
        return this.playerScore;
    }

    public setScore(value: number) {
        this.playerScore += value;
        this.onScoreUpdate.emit(GameEvents.onScoreUpdate, this.playerScore);
    }
}