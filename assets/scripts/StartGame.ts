import { _decorator, Component, Canvas } from "cc";
import { GameConfig } from "./config/GameConfig";
import { GameViewsStorage } from './views/GameViewsStorage';
import { GameController } from './controllers/GameController';
const { ccclass, property } = _decorator;

@ccclass("StartGame")
export class StartGame extends Component {
  @property(GameConfig)
  private gameConfig: GameConfig = null;
  @property(GameViewsStorage)
  private gameViewsStorage: GameViewsStorage = null

  private gameController: GameController = null

  start() {
    this.gameController = new GameController(this.gameConfig, this.gameViewsStorage);
    this.gameController.startGame();
  }

}
