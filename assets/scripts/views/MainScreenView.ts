import { _decorator, Component, Node, Button } from 'cc';
import { FieldView } from './FieldView';
import { ScoreView } from './ScoreView';
import { TurnsCounterView } from './TurnsCounterView';
const { ccclass, property } = _decorator;

@ccclass('MainScreenView')
export class MainScreenView extends Component {

    private fieldView: FieldView;
    private scoreView: ScoreView;
    private TurnsCounterView: TurnsCounterView;
    private bombBtn: Button;



}


