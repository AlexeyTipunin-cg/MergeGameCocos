import { EventTarget } from 'cc';
import { GameEvents } from '../data/GameEvents';

export class TurnsModel {

    public onTurnUpdate: EventTarget = new EventTarget();

    private playerTurns: number = 0;

    public get turns(): number {
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
    }
}