"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const inventory_controller_1 = require("./inventory.controller");
const inventory_service_1 = require("./inventory.service");
const product_schema_1 = require("./schemas/product.schema");
const stock_movement_schema_1 = require("./schemas/stock-movement.schema");
const inventory_gateway_1 = require("./inventory.gateway");
const notifications_module_1 = require("../notifications/notifications.module");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: stock_movement_schema_1.StockMovement.name, schema: stock_movement_schema_1.StockMovementSchema },
            ]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [inventory_controller_1.InventoryController],
        providers: [inventory_service_1.InventoryService, inventory_gateway_1.InventoryGateway],
        exports: [inventory_service_1.InventoryService, inventory_gateway_1.InventoryGateway],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map