import { _decorator, Component, Label } from 'cc';
import { ButtonWithLabel } from '../ButtonWithLabel';
const { ccclass, property } = _decorator;

@ccclass('ResourceBtnView')
export class ResourceBtnView extends Component {

    @property(ButtonWithLabel)
    public button: ButtonWithLabel;
    @property(Label)
    public countText: Label;
}


