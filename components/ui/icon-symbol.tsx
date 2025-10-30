// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
// prettier-ignore
const MAPPING = {
  // Original icons
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',

  // POS System icons
  'magnifyingglass': 'search',
  'cart': 'shopping-cart',
  'cart.fill': 'shopping-cart',
  'plus': 'add',
  'plus.circle': 'add-circle',
  'plus.circle.fill': 'add-circle',

  // Tab navigation icons for POS
  'creditcard': 'payment',
  'creditcard.fill': 'payment',
  'doc.text': 'description',
  'doc.text.fill': 'description',
  'cube.box': 'inventory',
  'cube.box.fill': 'inventory',
  'chart.bar': 'bar-chart',
  'chart.bar.fill': 'bar-chart',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'list.bullet': 'list',
  'list.bullet.rectangle': 'list-alt',

  // Additional useful POS icons
  'dollarsign.circle': 'monetization-on',
  'dollarsign.circle.fill': 'monetization-on',
  'bag': 'shopping-bag',
  'bag.fill': 'shopping-bag',
  'receipt': 'receipt',
  'printer': 'print',
  'scanner': 'qr-code-scanner',
  'creditcard.and.123': 'credit-card',
  'banknote': 'money',
  'person': 'person',
  'person.fill': 'person',
  'account.circle': 'account-circle',
  'account.circle.fill': 'account-circle',
  'gear': 'settings',
  'gear.fill': 'settings',
  'clock': 'schedule',
  'clock.fill': 'schedule',
  'checkmark.circle': 'check-circle',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle': 'cancel',
  'xmark.circle.fill': 'cancel',
  'info.circle': 'info',
  'info.circle.fill': 'info',
  'exclamationmark.triangle': 'warning',
  'exclamationmark.triangle.fill': 'warning',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
    name,
    size = 24,
    color,
    style,
}: {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
    weight?: SymbolWeight;
}) {
    return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
