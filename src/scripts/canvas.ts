import { Cell } from "./gol";

export class CanvasController{
    public context: CanvasRenderingContext2D | null = null;

    constructor(context: CanvasRenderingContext2D){
        this.context = context;
    }

    public DrawEmptyCell(cell: Cell){
        if(this.context == null)
            return;

        this.context.clearRect(cell.x, cell.y, cell.width, cell.height);
        
        this.context.strokeStyle = "black";

        this.context.strokeRect(cell.x, cell.y, cell.width, cell.height);
    }

    public DrawFilledCell(cell: Cell){
        if(this.context == null)
            return;

        this.context.clearRect(cell.x, cell.y, cell.width, cell.height);

        this.context.fillStyle = "blue";

        this.context.fillRect(cell.x, cell.y, cell.width, cell.height);
    }
}