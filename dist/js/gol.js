var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { CanvasController } from "./canvas";
import { delay } from "./utils";
var GOLController = /** @class */ (function () {
    function GOLController(canvasId, nextStepButtonId, resumeButtonId, clearButtonId, canvasHolderElementId) {
        if (nextStepButtonId === void 0) { nextStepButtonId = null; }
        if (resumeButtonId === void 0) { resumeButtonId = null; }
        if (clearButtonId === void 0) { clearButtonId = null; }
        if (canvasHolderElementId === void 0) { canvasHolderElementId = null; }
        var _this = this;
        this.canvasController = null;
        this.cellWidth = 25;
        this.cellHeight = 25;
        this.initialized = false;
        this.rows = 128;
        this.cols = 128;
        this.gameState = false;
        this.lifeStateArray = [];
        this.updateDelayMS = 250;
        this.renderDelayMS = 25;
        this.dragPos = {
            top: 0,
            left: 0,
            x: 0,
            y: 0,
        };
        this.dragging = false;
        this.draggingMove = false;
        this.SwitchGameState = function () { return _this.gameState = !_this.gameState; };
        this.canvasId = canvasId;
        this.resumeButtonId = resumeButtonId;
        this.nextStepButtonId = nextStepButtonId;
        this.clearButtonId = clearButtonId;
        this.canvasHolderElementId = canvasHolderElementId;
    }
    GOLController.prototype.Clear = function () {
        this.lifeStateArray = [];
        for (var i = 0; i < this.rows; i++) {
            var rowArray = [];
            for (var j = 0; j < this.cols; j++) {
                rowArray.push(new Cell(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight, i, j));
            }
            this.lifeStateArray.push(rowArray);
        }
        this.Render();
    };
    GOLController.prototype.DragRelease = function (ev) {
        this.dragging = false;
        this.draggingMove = false;
        this.canvasHolderElement.style.cursor = 'grab';
        this.canvasHolderElement.style.removeProperty('user-select');
    };
    GOLController.prototype.DragClick = function (ev) {
        if (this.dragging)
            return;
        this.draggingMove = false;
        if (this.canvasHolderElement == null)
            return;
        this.dragPos.left = this.canvasHolderElement.scrollLeft;
        this.dragPos.top = this.canvasHolderElement.scrollTop;
        this.dragPos.x = ev.clientX;
        this.dragPos.y = ev.clientY;
        this.canvasHolderElement.style.cursor = 'grabbing';
        this.canvasHolderElement.style.userSelect = 'none';
        this.dragging = true;
    };
    GOLController.prototype.DragMove = function (ev) {
        if (!this.dragging)
            return;
        this.draggingMove = true;
        var dx = ev.clientX - this.dragPos.x;
        var dy = ev.clientY - this.dragPos.y;
        // Scroll the element
        this.canvasHolderElement.scrollTop = this.dragPos.top - dy;
        this.canvasHolderElement.scrollLeft = this.dragPos.left - dx;
    };
    GOLController.prototype.CellClick = function (ev) {
        if (this.canvasElement == null || this.draggingMove)
            return;
        var canvasBoundsRect = this.canvasElement.getBoundingClientRect();
        var _a = [ev.clientX - canvasBoundsRect.left, ev.clientY - canvasBoundsRect.top], x = _a[0], y = _a[1];
        var _b = [Math.floor(y / this.cellHeight), Math.floor(x / this.cellWidth)], row = _b[0], col = _b[1];
        if (this.lifeStateArray[row][col].alive && this.gameState)
            return;
        this.lifeStateArray[row][col].alive = !this.lifeStateArray[row][col].alive;
        if (!this.gameState)
            this.Render();
    };
    GOLController.prototype.Setup = function () {
        var _this = this;
        this.canvasElement = document.getElementById(this.canvasId);
        if (this.canvasElement != null) {
            this.canvasElement.width = this.cols * this.cellWidth;
            this.canvasElement.height = this.rows * this.cellHeight;
            this.canvasContext = this.canvasElement.getContext('2d');
            this.canvasElement.onclick = function (ev) { return _this.CellClick(ev); };
            this.canvasElement.addEventListener('mousedown', function (ev) { return _this.DragClick(ev); });
            this.canvasElement.addEventListener('mousemove', function (ev) { return _this.DragMove(ev); });
            this.canvasElement.addEventListener('mouseup', function (ev) { return _this.DragRelease(ev); });
        }
        if (this.canvasHolderElementId != null)
            this.canvasHolderElement = document.getElementById(this.canvasHolderElementId);
        if (this.resumeButtonId != null)
            this.resumeButton = document.getElementById(this.resumeButtonId);
        if (this.nextStepButtonId != null)
            this.nextStepButton = document.getElementById(this.nextStepButtonId);
        if (this.clearButtonId != null)
            this.clearButton = document.getElementById(this.clearButtonId);
        if (this.canvasContext == null)
            return;
        this.canvasController = new CanvasController(this.canvasContext);
        this.Clear();
        if (this.resumeButton != null) {
            this.resumeButton.onclick = function () {
                _this.SwitchGameState();
                if (_this.resumeButton == null)
                    return;
                if (_this.gameState)
                    _this.resumeButton.innerText = "⏸️";
                else
                    _this.resumeButton.innerText = "▶️";
            };
        }
        if (this.nextStepButton != null) {
            this.nextStepButton.onclick = function () {
                _this.Update();
                _this.Render();
            };
        }
        if (this.clearButton != null) {
            this.clearButton.onclick = function () {
                _this.Clear();
            };
        }
        this.initialized = true;
    };
    GOLController.prototype.Start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialized) {
                            console.error('Initialization failed, cannot start');
                            return [2 /*return*/];
                        }
                        this.Render();
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 5];
                        if (!!this.gameState) return [3 /*break*/, 3];
                        return [4 /*yield*/, delay(this.renderDelayMS)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this.Render();
                        this.Update();
                        return [4 /*yield*/, delay(this.updateDelayMS)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GOLController.prototype.Render = function () {
        var _a, _b;
        for (var i = 0; i < this.lifeStateArray.length; i++) {
            for (var j = 0; j < this.lifeStateArray[i].length; j++) {
                if (this.lifeStateArray[i][j].alive)
                    (_a = this.canvasController) === null || _a === void 0 ? void 0 : _a.DrawFilledCell(this.lifeStateArray[i][j]);
                else
                    (_b = this.canvasController) === null || _b === void 0 ? void 0 : _b.DrawEmptyCell(this.lifeStateArray[i][j]);
            }
        }
    };
    GOLController.prototype.Update = function () {
        var cellsToKill = [];
        var cellsToBringBackToLife = [];
        for (var i = 0; i < this.lifeStateArray.length; i++) {
            for (var j = 0; j < this.lifeStateArray[i].length; j++) {
                var cell = this.lifeStateArray[i][j];
                var neighboursAlive = this.CalculateNeighboursAlive(cell);
                if (neighboursAlive < 2 && cell.alive)
                    cellsToKill.push(cell);
                else if (neighboursAlive == 3 && !cell.alive)
                    cellsToBringBackToLife.push(cell);
                else if (neighboursAlive > 3 && cell.alive)
                    cellsToKill.push(cell);
            }
        }
        for (var j = 0; j < cellsToBringBackToLife.length; j++) {
            this.lifeStateArray[cellsToBringBackToLife[j].row][cellsToBringBackToLife[j].col].alive = true;
        }
        for (var k = 0; k < cellsToKill.length; k++) {
            this.lifeStateArray[cellsToKill[k].row][cellsToKill[k].col].alive = false;
        }
    };
    // 2 neighbours is for alive cell to keep alive, 3 cells is for dead cell to keep back to life
    GOLController.prototype.CalculateNeighboursAlive = function (cell) {
        var neighborhood = [];
        var neighboursAlive = 0;
        //left top corner
        if (cell.row > 0 && cell.col > 0)
            neighborhood.push(this.lifeStateArray[cell.row - 1][cell.col - 1].alive);
        //middle top
        if (cell.row > 0)
            neighborhood.push(this.lifeStateArray[cell.row - 1][cell.col].alive);
        //right top corner
        if (cell.row > 0 && (cell.col + 1) < this.cols)
            neighborhood.push(this.lifeStateArray[cell.row - 1][cell.col + 1].alive);
        //middle left
        if (cell.col > 0)
            neighborhood.push(this.lifeStateArray[cell.row][cell.col - 1].alive);
        //middle right
        if ((cell.col + 1) < this.cols)
            neighborhood.push(this.lifeStateArray[cell.row][cell.col + 1].alive);
        //left bottom corner
        if ((cell.row + 1) < this.rows && cell.col > 0)
            neighborhood.push(this.lifeStateArray[cell.row + 1][cell.col - 1].alive);
        //middle bottom
        if ((cell.row + 1) < this.rows)
            neighborhood.push(this.lifeStateArray[cell.row + 1][cell.col].alive);
        //right bottom corner
        if ((cell.row + 1) < this.rows && (cell.col + 1) < this.cols)
            neighborhood.push(this.lifeStateArray[cell.row + 1][cell.col + 1].alive);
        for (var i = 0; i < neighborhood.length; i++) {
            if (neighborhood[i] === true)
                neighboursAlive++;
        }
        return neighboursAlive;
    };
    return GOLController;
}());
export { GOLController };
var Cell = /** @class */ (function () {
    function Cell(x, y, w, h, row, col) {
        this.width = w;
        this.height = w;
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
        this.alive = false;
    }
    return Cell;
}());
export { Cell };
