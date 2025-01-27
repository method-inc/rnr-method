import * as Slot from '@rnr-method/slot';
import type { SlottableViewProps, ViewRef } from '@rnr-method/types';
import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

type RootProps = Omit<SlottableViewProps, 'style'> & {
  ratio?: number;
  style?: ViewStyle;
};

type RootRef = ViewRef;

const Root = React.forwardRef<RootRef, RootProps>(
  ({ asChild, ratio = 1, style, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} style={[style, { aspectRatio: ratio }]} {...props} />;
  }
);

Root.displayName = 'RootAspectRatio';

export { Root };
export type { RootProps, RootRef };
