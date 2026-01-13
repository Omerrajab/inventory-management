import { SettingsService } from '../settings/settings.service';
export declare class BillingService {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    generateInvoice(sale: any): Promise<Buffer>;
    private generateTableRow;
}
