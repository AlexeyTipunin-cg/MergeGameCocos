import { GameConfig } from '../config/GameConfig';
import { ResourceTypes, ResourceItem } from '../data/ResourceItem';
import { GameEvents } from '../data/GameEvents';

export class ResourcesModel {
  private resources = new Map<ResourceTypes, ResourceItem>();

  private gameConfig: GameConfig = null;

  public setConfig(gameConfig: GameConfig): void {
    this.gameConfig = gameConfig;
  }

  public init() {
    this.resources.clear();

    let shuffle = new ResourceItem();
    shuffle.type = ResourceTypes.Shuffle
    shuffle.count = this.gameConfig.shufflesCount;
    shuffle.name = "Shuffle";

    let bomb = new ResourceItem();
    bomb.type = ResourceTypes.Shuffle
    bomb.count = this.gameConfig.bombsCount;
    bomb.name = "Bomb";

    this.resources.set(ResourceTypes.Shuffle, shuffle);
    this.resources.set(ResourceTypes.Bomb, bomb);
  }

  public reset() {
    this.resources.get(ResourceTypes.Shuffle).count = this.gameConfig.shufflesCount;
    this.resources.get(ResourceTypes.Bomb).count = this.gameConfig.bombsCount;
  }

  public getResCount(resType: ResourceTypes): number {
    return this.resources.get(resType).count;
  }

  public getResName(resType: ResourceTypes): string {
    return this.resources.get(resType).name;
  }

  public spendResource(resType: ResourceTypes): void {
    let item = this.resources.get(resType);
    if (item.count > 0) {
      item.count--;
    }
  }

  public subscribe(resType: ResourceTypes, cb: (count: number) => void): void {
    this.resources.get(resType).onUpdate.on(GameEvents.onResourceSpend, cb)
  }

  public unsubscribe(resType: ResourceTypes, cb: (count: number) => void): void {
    this.resources.get(resType).onUpdate.off(GameEvents.onResourceSpend, cb)
  }
}
