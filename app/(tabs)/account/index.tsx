import { currentUser$ } from '@/db/services/userService';

import { withObservables } from '@nozbe/watermelondb/react';
import AccountScreenComponent from './pos-account';
import { activeSession$, isAuthenticated$ } from '@/db/services/sessionsService';

const enhance = withObservables([], () => ({
    activeSession: activeSession$,
    user: currentUser$,
    isAuthenticated: isAuthenticated$,
}));

const AccountScreen = enhance(AccountScreenComponent);

export default AccountScreen;
