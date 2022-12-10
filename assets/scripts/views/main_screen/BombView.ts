import { _decorator, Component, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BombView')
export class BombView extends Component {

    @property(Button)
    public button: Button;
    @property(Label)
    public countText: Label;
}


