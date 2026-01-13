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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require('pdfkit');
const settings_service_1 = require("../settings/settings.service");
let BillingService = class BillingService {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async generateInvoice(sale) {
        const settings = await this.settingsService.getSettings();
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            doc.fillColor('#444444')
                .fontSize(20)
                .text(settings?.companyName || 'ANTIGRAVITY INVENTORY', 50, 50)
                .fontSize(10)
                .text(settings?.address.split(',').slice(0, 2).join(',') || '123 Modern Tech Park, Hinjewadi', 200, 50, { align: 'right' })
                .text(settings?.address.split(',').slice(2).join(',') || 'Pune, Maharashtra - 411057', 200, 65, { align: 'right' })
                .text(`GSTIN: ${settings?.gstin || '27AAAAA0000A1Z5'}`, 200, 80, { align: 'right' })
                .moveDown();
            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 100).lineTo(550, 100).stroke();
            doc.fontSize(12).text(`TAX INVOICE`, 50, 115, { underline: true });
            doc.fontSize(10)
                .text(`Invoice No: ${sale.invoiceNumber}`, 50, 135)
                .text(`Date: ${new Date(sale.createdAt).toLocaleDateString('en-IN')}`, 50, 150)
                .text(`Payment: ${sale.paymentMethod} (${sale.paymentStatus})`, 50, 165);
            const customer = sale.customerId;
            const customerX = 300;
            doc.fontSize(10)
                .text('BILL TO:', customerX, 115, { underline: true })
                .text(customer?.name || 'Walk-in Customer', customerX, 135)
                .text(customer?.address || '-', customerX, 150)
                .text(`GSTIN: ${customer?.gstin || 'URD'}`, customerX, 165)
                .text(`State: ${customer?.state || '-'}`, customerX, 180);
            doc.moveDown();
            const tableTop = 230;
            const colHSN = 50;
            const colItem = 110;
            const colQty = 260;
            const colRate = 310;
            const colGst = 360;
            const colGstAmt = 410;
            const colTotal = 480;
            doc.fontSize(10).font('Helvetica-Bold');
            this.generateTableRow(doc, tableTop, 'HSN', 'Description', 'Qty', 'Rate', 'GST%', 'GST Amt', 'Total');
            doc.strokeColor('#aaaaaa').lineWidth(0.5).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            doc.font('Helvetica');
            let i;
            let currentY = tableTop + 25;
            for (i = 0; i < sale.items.length; i++) {
                const item = sale.items[i];
                const basePrice = item.price;
                this.generateTableRow(doc, currentY, item.productId?.hsnCode || '-', item.name, item.quantity.toString(), `₹${basePrice.toFixed(2)}`, `${item.gstRate}%`, `₹${item.gstAmount.toFixed(2)}`, `₹${item.subtotal.toFixed(2)}`);
                currentY += 20;
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }
            }
            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, currentY).lineTo(550, currentY).stroke();
            const summaryY = currentY + 20;
            doc.fontSize(10)
                .text(`Total Amount before Tax:`, 350, summaryY)
                .text(`₹${(sale.totalAmount - sale.taxAmount).toFixed(2)}`, 500, summaryY, { align: 'right' })
                .text(`CGST:`, 350, summaryY + 15)
                .text(`₹${(sale.cgst || 0).toFixed(2)}`, 500, summaryY + 15, { align: 'right' })
                .text(`SGST:`, 350, summaryY + 30)
                .text(`₹${(sale.sgst || 0).toFixed(2)}`, 500, summaryY + 30, { align: 'right' })
                .text(`IGST:`, 350, summaryY + 45)
                .text(`₹${(sale.igst || 0).toFixed(2)}`, 500, summaryY + 45, { align: 'right' })
                .fontSize(12).font('Helvetica-Bold')
                .text(`GRAND TOTAL:`, 350, summaryY + 65)
                .text(`₹${sale.totalAmount.toFixed(2)}`, 500, summaryY + 65, { align: 'right' });
            doc.fontSize(10).font('Helvetica-Oblique')
                .text('Thank you for your business!', 50, 750, { align: 'center', width: 500 });
            doc.end();
        });
    }
    generateTableRow(doc, y, hsn, item, qty, rate, gst, gstAmt, total) {
        doc.fontSize(9)
            .text(hsn, 50, y, { width: 60 })
            .text(item, 110, y, { width: 140 })
            .text(qty, 260, y, { width: 40, align: 'right' })
            .text(rate, 310, y, { width: 50, align: 'right' })
            .text(gst, 360, y, { width: 40, align: 'right' })
            .text(gstAmt, 410, y, { width: 60, align: 'right' })
            .text(total, 480, y, { width: 70, align: 'right' });
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], BillingService);
//# sourceMappingURL=billing.service.js.map