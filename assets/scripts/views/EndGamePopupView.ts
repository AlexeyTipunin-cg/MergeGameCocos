import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EndGamePopupView')
export class EndGamePopupView extends Component {

    @property(Button)
    private resrartButton: Button = null;
    @property(Label)
    private text: Label = null;

    private setText(isWin:boolean){
        if (isWin) {
            this.text.string = "You win!"
        }else{
            this.text.string = "Failed! Try again."
        }
    }
}


