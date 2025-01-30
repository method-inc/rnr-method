'use client';

import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as ToastPrimitive from '@method-inc/toast';

const Toast = () => {
  const [open, setOpen] = React.useState(false);
  const [seconds, setSeconds] = React.useState(3);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (open) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setOpen(false);
            if (interval) {
              clearInterval(interval);
            }
            return 3;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
      setSeconds(3);
    }

    if (interval && !open) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [open, seconds]);

  return (
    <>
      {open && (
        <View className='px-4 absolute w-full'>
          <ToastPrimitive.Root
            type='foreground'
            open={open}
            onOpenChange={setOpen}
            className='opacity-95 bg-secondary border-border flex-row justify-between items-center p-4 rounded-xl'
          >
            <View className='gap-1.5'>
              <ToastPrimitive.Title className='text-foreground text-3xl'>
                Here is a toast
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className='text-foreground text-lg'>
                It will disappear in {seconds} seconds
              </ToastPrimitive.Description>
            </View>
            <View className='gap-2'>
              <ToastPrimitive.Action className='border border-primary px-4 py-2'>
                <Text className='text-foreground'>Action</Text>
              </ToastPrimitive.Action>
              <ToastPrimitive.Close className='border border-primary px-4 py-2'>
                <Text className='text-foreground'>Close</Text>
              </ToastPrimitive.Close>
            </View>
          </ToastPrimitive.Root>
        </View>
      )}
      <View className='flex-1 justify-center items-center p-6 gap-12'>
        <Pressable onPress={() => setOpen((prev) => !prev)}>
          <Text className='text-foreground text-xl'>Show Toast</Text>
        </Pressable>
      </View>
    </>
  );
};

Toast.displayName = 'Toast';

export { Toast };
