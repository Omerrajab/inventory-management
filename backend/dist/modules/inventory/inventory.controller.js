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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const stock_movement_schema_1 = require("./schemas/stock-movement.schema");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    create(createProductDto) {
        return this.inventoryService.create(createProductDto);
    }
    findAll(query) {
        return this.inventoryService.findAll(query);
    }
    findOne(id) {
        return this.inventoryService.findOne(id);
    }
    update(id, updateProductDto) {
        return this.inventoryService.update(id, updateProductDto);
    }
    remove(id) {
        return this.inventoryService.remove(id);
    }
    updateStock(id, quantity, type, reason, performedBy) {
        return this.inventoryService.updateStock(id, quantity, type, reason, performedBy);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('products/:id/stock'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('quantity')),
    __param(2, (0, common_1.Body)('type')),
    __param(3, (0, common_1.Body)('reason')),
    __param(4, (0, common_1.Body)('performedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map