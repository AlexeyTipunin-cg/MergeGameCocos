import { _decorator, Component, Node, Button, Label, MeshCollider } from 'cc';
import { GameEvents } from '../GameEvents';
import { VictoryController } from '../VictoryController';
import { GameStates } from '../GameStates';
const { ccclass, property } = _decorator;

@ccclass('EndGamePopupView')
export class EndGamePopupView extends Component {

    @property(Button)
    private resrartButton: Button = null;
    @property(Label)
    private text: Label = null;
    private mediator: VictoryController = null;

    start() {
        this.resrartButton.node.on(Button.EventType.CLICK, this.resetGame, this);
    }

    onDestroy() {
        this.resrartButton.node.off(Button.EventType.CLICK, this.resetGame, this);
    }

    onEnable() {
        this.setText(this.mediator.gameState)
    }


    public init(mediator: VictoryController): void {
        this.mediator = mediator;
        this.mediator.onGameOver.on(GameEvents.onGameOver, this.setText, this)
    }

    private resetGame(): void {
        this.mediator.reset();
    }

    private setText(gameState: GameStates) {
        switch (gameState) {
            case GameStates.LOOSE:
                this.text.string = "Failed! Try again."
                break;
            case GameStates.WIN:
                this.text.string = "You win!"
                break;
            default:
                break;
        }
    }
}


