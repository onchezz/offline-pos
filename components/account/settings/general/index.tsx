import { View } from 'react-native';
import { Notifications } from './Notifications';
import { HelpSupport } from './HelpSupport';
import { AppPreferences } from './ApppPreferences';

export default function GeneralSettings() {
    return (
        <View className='px-4 py-4 gap-4'>
            <AppPreferences />
            <Notifications />
            <HelpSupport />
        </View>
    );
}
