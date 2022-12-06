import { _decorator, Component, Node } from 'cc';
import { FieldController } from './FieldController';
import { FieldInput } from './FieldInput';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {

    @property(FieldController)
    private fieldController: FieldController;

    start() {
        this.fieldController.startGame();
    }
}


