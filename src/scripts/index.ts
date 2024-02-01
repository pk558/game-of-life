import { GOLController } from "./gol";

const gol = new GOLController('canvas', 'nextStepButton', 'resumeButton', 'clearButton', 'canvasHolder');
gol.Setup();
gol.Start();