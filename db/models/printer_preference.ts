import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class PrinterPreference extends Model {
    static table = 'printer_preferences';

    @field('device_id') deviceId!: string;
    @text('name') name!: string;
    @field('service_uuid') serviceUuid!: string;
    @field('characteristic_uuid') characteristicUuid!: string;
    @field('saved_at') savedAt!: number;
    @field('auto_print') autoPrint!: boolean;
    @field('auto_connect') autoConnect!: boolean;
}
