import { Button, Component, Label, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonWithLabel')
export class ButtonWithLabel extends Component {

    @property(Button)
    public button: Button;
    @property(Label)
    public text: Label;
}