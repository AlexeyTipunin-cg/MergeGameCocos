import { EventTarget } from 'cc';
import { GameEvents } from './GameEvents';

export class TurnsController {

    public onTurnUpdate: EventTarget = new EventTarget();
    public onGameOver: EventTarget = new EventTarget();

    private playerTurns: number = 0;

    public get score(): number {
        return this.playerTurns;
    }

    public setTurns(value: number) {
        this.playerTurns = value;
        this.onTurnUpdate.emit(GameEvents.onTurnUpdate, this.playerTurns);
    }

    public decreaseTurns() {
        if (this.playerTurns == 0) {
            return;
        }

        this.playerTurns--;
        this.onTurnUpdate.emit(GameEvents.onTurnUpdate, this.playerTurns);

        if (this.playerTurns == 0) {
            this.onGameOver.emit(GameEvents.onGameFailed);
        }
    }
}