import { Component, Label, _decorator } from 'cc';
import { ButtonWithLabel } from '../ButtonWithLabel';
const { ccclass, property } = _decorator;

@ccclass('ShuffleView')
export class ShuffleView extends Component {

    @property(ButtonWithLabel)
    public button: ButtonWithLabel;
    @property(Label)
    public countText: Label;
}