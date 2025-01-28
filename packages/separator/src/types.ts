import type { SlottableViewProps, ViewRef } from '@method-inc/types';

type RootProps = SlottableViewProps & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

type RootRef = ViewRef;

export type { RootProps, RootRef };
