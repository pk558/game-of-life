import { GOLController } from "./gol";
var gol = new GOLController('canvas', 'nextStepButton', 'resumeButton', 'clearButton', 'canvasHolder');
gol.Setup();
gol.Start();
