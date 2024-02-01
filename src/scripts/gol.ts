import { CanvasController } from "./canvas";
import { delay } from "./utils";

export class GOLController {
    private canvasController: CanvasController | null = null;

    private canvasId: string;
    private canvasElement: HTMLCanvasElement | null;
    private canvasContext: CanvasRenderingContext2D | null;
    
    private canvasHolderElementId: string;
    private canvasHolderElement: HTMLDivElement | null;


    private resumeButtonId: string | null;
    private resumeButton: HTMLButtonElement | null;

    private clearButtonId: string | null;
    private clearButton: HTMLButtonElement | null;

    private nextStepButtonId: string | null;
    private nextStepButton: HTMLButtonElement | null;

    private cellWidth: number = 25; 
    private cellHeight: number = 25; 
    private initialized: boolean = false;

    public rows: number = 128;
    public cols: number = 128;


    public gameState: boolean = false;
    public lifeStateArray: Array<Array<Cell>> = [];
    public updateDelayMS: number = 250;
    public renderDelayMS: number = 25;

    private dragPos: { top: number, left: number, x: number, y: number } = {
        top: 0,
        left: 0,
        x: 0,
        y: 0,
    }
    private dragging: boolean = false;
    private draggingMove: boolean = false;

    constructor(canvasId: string, nextStepButtonId: string | null = null, resumeButtonId: string | null = null, clearButtonId: string | null = null, canvasHolderElementId: string | null = null){
        this.canvasId = canvasId;
        this.resumeButtonId = resumeButtonId;
        this.nextStepButtonId = nextStepButtonId;
        this.clearButtonId = clearButtonId;
        this.canvasHolderElementId = canvasHolderElementId;
    }

    public Clear(): void {
        this.lifeStateArray = [];

        for(let i = 0; i < this.rows; i++){
            const rowArray: Array<Cell> = [];
            
            for(let j = 0; j < this.cols; j++){
                rowArray.push(new Cell(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight, i, j));
            }

            this.lifeStateArray.push(rowArray)
        }

        this.Render();
    }

    public SwitchGameState = (): boolean => this.gameState = !this.gameState; 

    private DragRelease(ev: MouseEvent): void {
        this.dragging = false;
        this.draggingMove = false;

        this.canvasHolderElement.style.cursor = 'grab';
        this.canvasHolderElement.style.removeProperty('user-select');
    }

    private DragClick(ev: MouseEvent): void {
        if(this.dragging)
            return;
        
        this.draggingMove = false;

        if(this.canvasHolderElement == null)
            return;

        this.dragPos.left = this.canvasHolderElement.scrollLeft;
        this.dragPos.top = this.canvasHolderElement.scrollTop;
        this.dragPos.x = ev.clientX;
        this.dragPos.y = ev.clientY;

        this.canvasHolderElement.style.cursor = 'grabbing';
        this.canvasHolderElement.style.userSelect = 'none';

        this.dragging = true;
    }

    private DragMove(ev: MouseEvent): void {
        if(!this.dragging)
            return;

        this.draggingMove = true;

        const dx = ev.clientX - this.dragPos.x;
        const dy = ev.clientY - this.dragPos.y;

        // Scroll the element
        this.canvasHolderElement.scrollTop = this.dragPos.top - dy;
        this.canvasHolderElement.scrollLeft = this.dragPos.left - dx;
    }

    private CellClick(ev: MouseEvent): void {
        if(this.canvasElement == null || this.draggingMove)
            return;

        const canvasBoundsRect: DOMRect = this.canvasElement.getBoundingClientRect();

        const [x, y]: [number, number] = [ev.clientX - canvasBoundsRect.left, ev.clientY - canvasBoundsRect.top];

        const [row, col]: [number, number] = [Math.floor(y / this.cellHeight), Math.floor(x / this.cellWidth)];

        if(this.lifeStateArray[row][col].alive && this.gameState)
            return;

        this.lifeStateArray[row][col].alive = !this.lifeStateArray[row][col].alive;

        if(!this.gameState)
            this.Render();
    }

    public Setup(){
        this.canvasElement = document.getElementById(this.canvasId) as HTMLCanvasElement;
        
        if(this.canvasElement != null){
            this.canvasElement.width = this.cols * this.cellWidth;
            this.canvasElement.height = this.rows * this.cellHeight;

            this.canvasContext = this.canvasElement.getContext('2d');

            this.canvasElement.onclick = (ev: MouseEvent) => this.CellClick(ev); 
                
            this.canvasElement.addEventListener('mousedown', (ev: MouseEvent) => this.DragClick(ev));
            this.canvasElement.addEventListener('mousemove', (ev: MouseEvent) => this.DragMove(ev));
            this.canvasElement.addEventListener('mouseup', (ev: MouseEvent) => this.DragRelease(ev));
        }
        
        if(this.canvasHolderElementId != null)
            this.canvasHolderElement = document.getElementById(this.canvasHolderElementId) as HTMLDivElement;

        if(this.resumeButtonId != null)
            this.resumeButton = document.getElementById(this.resumeButtonId) as HTMLButtonElement;

        if(this.nextStepButtonId != null)
            this.nextStepButton = document.getElementById(this.nextStepButtonId) as HTMLButtonElement;
        
        if(this.clearButtonId != null)
            this.clearButton = document.getElementById(this.clearButtonId) as HTMLButtonElement;

        if(this.canvasContext == null)
            return;

        this.canvasController = new CanvasController(this.canvasContext);
    
        this.Clear();

        if(this.resumeButton != null){
            this.resumeButton.onclick = () => {
                this.SwitchGameState();
                
                if(this.resumeButton == null)
                    return;

                if(this.gameState)
                    this.resumeButton.innerText = "⏸️"
                else
                    this.resumeButton.innerText = "▶️"
            }
        }
    
        if(this.nextStepButton != null){
            this.nextStepButton.onclick = () => {
                this.Update();
                this.Render();
            }
        }

        if(this.clearButton != null){
            this.clearButton.onclick = () => {
                this.Clear();
            }
        }

        this.initialized = true;
    }

    public async Start(){
        if(!this.initialized){
            console.error('Initialization failed, cannot start');
            return;
        }
        this.Render();

        while(true){
            if(!this.gameState){
                await delay(this.renderDelayMS);
    
                continue;
            }
            
            this.Render();
            this.Update();
    
            await delay(this.updateDelayMS);
        }
    }

    private Render(): void{
        for(let i = 0; i < this.lifeStateArray.length; i++){
            for(let j = 0; j < this.lifeStateArray[i].length; j++){
                if(this.lifeStateArray[i][j].alive)
                    this.canvasController?.DrawFilledCell(this.lifeStateArray[i][j]);
                else
                    this.canvasController?.DrawEmptyCell(this.lifeStateArray[i][j]);
            }
        }
    }

    private Update(): void {
        const cellsToKill: Array<Cell> = [];
        const cellsToBringBackToLife: Array<Cell> = [];
    
        for(let i = 0; i < this.lifeStateArray.length; i++){
            for(let j = 0; j < this.lifeStateArray[i].length; j++){
                const cell: Cell = this.lifeStateArray[i][j];
                const neighboursAlive: number = this.CalculateNeighboursAlive(cell);
    
                if(neighboursAlive < 2 && cell.alive)
                    cellsToKill.push(cell);
                else if(neighboursAlive == 3 && !cell.alive)
                    cellsToBringBackToLife.push(cell);
                else if(neighboursAlive > 3 && cell.alive)
                    cellsToKill.push(cell);
            } 
        }
    
        for(let j = 0; j < cellsToBringBackToLife.length; j++){
            this.lifeStateArray[cellsToBringBackToLife[j].row][cellsToBringBackToLife[j].col].alive = true;
        }
        for(let k = 0; k < cellsToKill.length; k++){
            this.lifeStateArray[cellsToKill[k].row][cellsToKill[k].col].alive = false;
        }
    
    }

    // 2 neighbours is for alive cell to keep alive, 3 cells is for dead cell to keep back to life
private CalculateNeighboursAlive(cell: Cell): number {
    const neighborhood: Array<boolean> = [];

    let neighboursAlive = 0;

    //left top corner
    if(cell.row > 0 && cell.col > 0)
        neighborhood.push(this.lifeStateArray[cell.row - 1][cell.col - 1].alive);
    //middle top
    if(cell.row > 0)
        neighborhood.push(this.lifeStateArray[cell.row - 1][cell.col].alive);
    //right top corner
    if(cell.row > 0 && (cell.col + 1) < this.cols)
        neighborhood.push(this.lifeStateArray[cell.row - 1][cell.col + 1].alive);
    //middle left
    if(cell.col > 0)
        neighborhood.push(this.lifeStateArray[cell.row][cell.col - 1].alive);
    //middle right
    if((cell.col + 1) < this.cols)
        neighborhood.push(this.lifeStateArray[cell.row][cell.col + 1].alive);
    //left bottom corner
    if((cell.row + 1) < this.rows && cell.col > 0)
        neighborhood.push(this.lifeStateArray[cell.row + 1][cell.col - 1].alive);
    //middle bottom
    if((cell.row + 1) < this.rows)
        neighborhood.push(this.lifeStateArray[cell.row + 1][cell.col].alive);
    //right bottom corner
    if((cell.row + 1) < this.rows && (cell.col + 1) < this.cols)
        neighborhood.push(this.lifeStateArray[cell.row + 1][cell.col + 1].alive);

    for(let i = 0; i < neighborhood.length; i++){
        if(neighborhood[i] === true)
            neighboursAlive++;
    }

    return neighboursAlive;
}
}

export class Cell{
    public width: number;
    public height: number;
    public row: number;
    public col: number;
    public x: number;
    public y: number;
    public alive: boolean;

    constructor(x: number, y: number, w: number, h: number, row: number, col: number){
        this.width = w;
        this.height = w;
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
        this.alive = false;
    }
}