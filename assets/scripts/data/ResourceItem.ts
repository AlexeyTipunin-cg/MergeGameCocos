import { EventTarget } from 'cc';
import { GameEvents } from './GameEvents';

export class ResourceItem {
    public onUpdate: EventTarget = new EventTarget();
    public type: ResourceTypes;
    public name: string;

    private _count: number;
    public get count(): number {
        return this._count;
    }
    public set count(v: number) {
        this._count = v;
        this.onUpdate.emit(GameEvents.onResourceUpdated, this._count);
    }

    public spend(count: number) {
        this.count -= count;
        this.onUpdate.emit(GameEvents.onResourceSpend, this._count);
    }
}

export enum ResourceTypes {
    Shuffle,
    Bomb,
    Pair
}