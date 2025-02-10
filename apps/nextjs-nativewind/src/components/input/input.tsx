import * as React from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@method-inc/utils';
import * as Label from '@method-inc/label';
import { ExclamationTriangleIcon } from 'react-native-heroicons/solid';
import { OneOfOrNothing } from '@method-inc/types';

export type InputProps = TextInputProps & { label: string; hideLabel?: boolean } & OneOfOrNothing<{
    error: string;
    helperText: string;
  }>;

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, hideLabel, error, helperText, ...props }, ref) => {
    return (
      <View className='gap-1'>
        <Label.Text className={cn('text-base font-normal', hideLabel && 'sr-only')}>
          {label}
        </Label.Text>
        <View className='flex-row items-center gap-1'>
          {error && (
            <ExclamationTriangleIcon
              size='16'
              color='#b10000'
            />
          )}
          {(helperText || error) && (
            <Text
              className={cn(
                'text-sm font-normal text-text-helper',
                error && 'text-feedback-error-dark'
              )}
            >
              {helperText || error}
            </Text>
          )}
        </View>

        <TextInput
          ref={ref}
          className={cn(
            'inline-flex rounded border h-12 px-4',
            'bg-white border-slate-600',
            'font-normal text-text-input font-Gotham text-base tracking-tight',
            'placeholder:text-text-placeholder',
            'focus:outline-none focus:border-states-focus focus:border-2  focus:shadow-focused',
            'hover:shadow-sm hover:border-2 hover:border-states-hover-dark',
            'disabled:bg-states-disabled-background disabled:border-states-disabled-stroke placeholder:text-states-disabled-text',
            props.editable === false && 'opacity-50 web:cursor-not-allowed',
            error && 'border-feedback-error-dark',
            className
          )}
          {...props}
        />
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
