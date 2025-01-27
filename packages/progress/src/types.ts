import { SlottableViewProps, ViewRef } from '@rnr-method/types';

type RootProps = SlottableViewProps & {
  value?: number | null | undefined;
  max?: number;
  getValueLabel?(value: number, max: number): string;
};

type IndicatorProps = SlottableViewProps;

type RootRef = ViewRef;
type IndicatorRef = ViewRef;

export type { IndicatorProps, IndicatorRef, RootProps, RootRef };
