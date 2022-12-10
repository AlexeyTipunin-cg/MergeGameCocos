import { Button, Component, EventTarget, Label, _decorator } from 'cc';
import { GameEvents } from '../../GameEvents';
const { ccclass, property } = _decorator;

@ccclass('ShuffleView')
export class ShuffleView extends Component {

    @property(Button)
    public button: Button;
    @property(Label)
    public countText: Label;
}