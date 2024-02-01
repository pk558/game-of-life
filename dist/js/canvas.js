var CanvasController = /** @class */ (function () {
    function CanvasController(context) {
        this.context = null;
        this.context = context;
    }
    CanvasController.prototype.DrawEmptyCell = function (cell) {
        if (this.context == null)
            return;
        this.context.clearRect(cell.x, cell.y, cell.width, cell.height);
        this.context.strokeStyle = "black";
        this.context.strokeRect(cell.x, cell.y, cell.width, cell.height);
    };
    CanvasController.prototype.DrawFilledCell = function (cell) {
        if (this.context == null)
            return;
        this.context.clearRect(cell.x, cell.y, cell.width, cell.height);
        this.context.fillStyle = "blue";
        this.context.fillRect(cell.x, cell.y, cell.width, cell.height);
    };
    return CanvasController;
}());
export { CanvasController };
