"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let InventoryGateway = class InventoryGateway {
    server;
    logger = new common_1.Logger('InventoryGateway');
    afterInit(server) {
        this.logger.log('WebSocket Gateway Initialized');
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleMessage(client, payload) {
        this.server.emit('msgToClient', payload);
    }
    notifyStockUpdate(productId, newQuantity) {
        if (this.server) {
            this.server.emit('stockUpdated', { productId, newQuantity });
        }
    }
    notifyNewNotification() {
        if (this.server) {
            this.server.emit('newNotification');
        }
    }
};
exports.InventoryGateway = InventoryGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], InventoryGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('msgToServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], InventoryGateway.prototype, "handleMessage", null);
exports.InventoryGateway = InventoryGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], InventoryGateway);
//# sourceMappingURL=inventory.gateway.js.map