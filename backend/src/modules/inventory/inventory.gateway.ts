import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class InventoryGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('InventoryGateway');

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway Initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void {
        this.server.emit('msgToClient', payload);
    }

    notifyStockUpdate(productId: string, newQuantity: number) {
        if (this.server) {
            this.server.emit('stockUpdated', { productId, newQuantity });
        }
    }

    notifyNewNotification() {
        if (this.server) {
            this.server.emit('newNotification');
        }
    }
}

