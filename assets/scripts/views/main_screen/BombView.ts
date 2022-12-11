import { _decorator, Component, Label } from 'cc';
import { ButtonWithLabel } from '../ButtonWithLabel';
const { ccclass, property } = _decorator;

@ccclass('BombView')
export class BombView extends Component {

    @property(ButtonWithLabel)
    public button: ButtonWithLabel;
    @property(Label)
    public countText: Label;
}


