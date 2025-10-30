import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class Payment extends Model {
    static table = 'payments';
    static associations = {
        sales: { type: 'belongs_to' as const, key: 'sale_id' },
    };

    @field('external_id') externalId!: string;
    @field('sale_id') saleId!: string;
    @field('amount') amount!: number;
    @field('method') method?: string;
    @field('note') note?: string;
    @field('payment_date') paymentDate?: number;
    @field('details') details?: string;
    @field('status') status?: string;
    @readonly @date('created_at') createdAt!: Date;
    @date('updated_at') updatedAt!: Date;
}
