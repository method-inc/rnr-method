import * as Menubar from '@radix-ui/react-menubar';
import {
  useAugmentedRef,
  useControllableState,
  useIsomorphicLayoutEffect,
} from '@rn-primitives/hooks';
import * as Slot from '@rn-primitives/slot';
import type { PressableRef, TextRef, ViewRef } from '@rn-primitives/types';
import { EmptyGestureResponderEvent } from '@rn-primitives/utils';
import * as React from 'react';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import type {
  MenubarCheckboxItemProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarItemIndicatorProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarMenuProps,
  MenubarOverlayProps,
  MenubarPortalProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarRootProps,
  MenubarSeparatorProps,
  MenubarSubContentProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps,
} from './types';

const RootContext = React.createContext<MenubarRootProps | null>(null);

const Root = React.forwardRef<ViewRef, MenubarRootProps>(
  ({ asChild, value, onValueChange, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <RootContext.Provider value={{ value, onValueChange }}>
        <Menubar.Root value={value} onValueChange={onValueChange}>
          <Component ref={ref} {...viewProps} />
        </Menubar.Root>
      </RootContext.Provider>
    );
  }
);

Root.displayName = 'RootWebMenubar';

function useRootContext() {
  const context = React.useContext(RootContext);
  if (!context) {
    throw new Error('Menubar compound components cannot be rendered outside the Menubar component');
  }
  return context;
}

const MenuContext = React.createContext<MenubarMenuProps | null>(null);

const Menu = React.forwardRef<ViewRef, MenubarMenuProps>(
  ({ asChild, value, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <MenuContext.Provider value={{ value }}>
        <Menubar.Menu value={value}>
          <Component ref={ref} {...viewProps} />
        </Menubar.Menu>
      </MenuContext.Provider>
    );
  }
);

Menu.displayName = 'MenuWebMenubar';

function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error('Menubar compound components cannot be rendered outside the Menubar component');
  }
  return context;
}

const Trigger = React.forwardRef<PressableRef, MenubarTriggerProps>(
  ({ asChild, disabled = false, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { value: menuValue } = useMenuContext();
    const { value } = useRootContext();

    useIsomorphicLayoutEffect(() => {
      if (augmentedRef.current) {
        const augRef = augmentedRef.current as unknown as HTMLDivElement;
        augRef.dataset.state = value && menuValue === value ? 'open' : 'closed';
      }
    }, [value && menuValue]);

    useIsomorphicLayoutEffect(() => {
      if (augmentedRef.current) {
        const augRef = augmentedRef.current as unknown as HTMLDivElement;
        if (disabled) {
          augRef.dataset.disabled = 'true';
        } else {
          augRef.dataset.disabled = undefined;
        }
      }
    }, [disabled]);

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Menubar.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={augmentedRef} disabled={disabled} {...props} />
      </Menubar.Trigger>
    );
  }
);

Trigger.displayName = 'TriggerWebMenubar';

function Portal({ forceMount, container, children }: MenubarPortalProps) {
  return <Menubar.Portal forceMount={forceMount} container={container} children={children} />;
}

const Overlay = React.forwardRef<PressableRef, MenubarOverlayProps>(
  ({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} {...props} />;
  }
);

Overlay.displayName = 'OverlayWebMenubar';

const MenubarContentContext = React.createContext<{
  close: () => void;
} | null>(null);

const Content = React.forwardRef<ViewRef, MenubarContentProps>(
  (
    {
      asChild = false,
      forceMount,
      align,
      side,
      sideOffset,
      alignOffset = 0,
      avoidCollisions = true,
      insets,
      loop,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      collisionBoundary,
      sticky,
      hideWhenDetached,
      ...props
    },
    ref
  ) => {
    const itemRef = React.useRef<HTMLDivElement>(null);

    function close() {
      itemRef.current?.click();
    }

    const Component = asChild ? Slot.View : View;
    return (
      <MenubarContentContext.Provider value={{ close }}>
        <Menubar.Content
          forceMount={forceMount}
          alignOffset={alignOffset}
          avoidCollisions={avoidCollisions}
          collisionPadding={insets}
          loop={loop}
          onCloseAutoFocus={onCloseAutoFocus}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onInteractOutside={onInteractOutside}
          collisionBoundary={collisionBoundary}
          sticky={sticky}
          hideWhenDetached={hideWhenDetached}
          align={align}
          side={side}
          sideOffset={sideOffset}
        >
          <Component ref={ref} {...props} />
          <Menubar.Item
            ref={itemRef}
            aria-hidden
            style={{ position: 'fixed', top: 0, left: 0, zIndex: -999999999 }}
            aria-disabled
            tabIndex={-1}
            hidden
          />
        </Menubar.Content>
      </MenubarContentContext.Provider>
    );
  }
);

Content.displayName = 'ContentWebMenubar';

function useMenubarContentContext() {
  const context = React.useContext(MenubarContentContext);
  if (!context) {
    throw new Error(
      'MenubarContent compound components cannot be rendered outside the MenubarContent component'
    );
  }
  return context;
}

const Item = React.forwardRef<PressableRef, MenubarItemProps>(
  (
    {
      asChild,
      textValue,
      closeOnPress = true,
      onPress: onPressProp,
      onKeyDown: onKeyDownProp,
      ...props
    },
    ref
  ) => {
    const { close } = useMenubarContentContext();

    function onKeyDown(ev: React.KeyboardEvent) {
      onKeyDownProp?.(ev);
      if (ev.key === 'Enter' || ev.key === ' ') {
        onPressProp?.(EmptyGestureResponderEvent);
        if (closeOnPress) {
          close();
        }
      }
    }

    function onPress(ev: GestureResponderEvent) {
      onPressProp?.(ev);
      if (closeOnPress) {
        close();
      }
    }

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Menubar.Item
        textValue={textValue}
        disabled={props.disabled ?? undefined}
        onSelect={closeOnPress ? undefined : onSelected}
        asChild
      >
        <Component
          ref={ref}
          // @ts-expect-error web only
          onKeyDown={onKeyDown}
          onPress={onPress}
          {...props}
        />
      </Menubar.Item>
    );
  }
);

Item.displayName = 'ItemWebMenubar';

const Group = React.forwardRef<ViewRef, MenubarGroupProps>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.View : View;
  return (
    <Menubar.Group asChild>
      <Component ref={ref} {...props} />
    </Menubar.Group>
  );
});

Group.displayName = 'GroupWebMenubar';

const Label = React.forwardRef<TextRef, MenubarLabelProps>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.Text : Text;
  return (
    <Menubar.Label asChild>
      <Component ref={ref} {...props} />
    </Menubar.Label>
  );
});

Label.displayName = 'LabelWebMenubar';

const CheckboxItem = React.forwardRef<PressableRef, MenubarCheckboxItemProps>(
  (
    {
      asChild,
      checked,
      onCheckedChange,
      textValue,
      disabled = false,
      closeOnPress = true,
      onPress: onPressProp,
      onKeyDown: onKeyDownProp,
      ...props
    },
    ref
  ) => {
    function onKeyDown(ev: React.KeyboardEvent) {
      onKeyDownProp?.(ev);
      if (ev.key === 'Enter' || ev.key === ' ') {
        onPressProp?.(EmptyGestureResponderEvent);
        onCheckedChange?.(!checked);
        if (closeOnPress) {
          close();
        }
      }
    }

    function onPress(ev: GestureResponderEvent) {
      onPressProp?.(ev);
      onCheckedChange?.(!checked);
      if (closeOnPress) {
        close();
      }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Menubar.CheckboxItem
        textValue={textValue}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onSelect={closeOnPress ? undefined : onSelected}
        disabled={disabled ?? undefined}
        asChild
      >
        <Component
          ref={ref}
          // @ts-expect-error web only
          onKeyDown={onKeyDown}
          onPress={onPress}
          role='button'
          {...props}
        />
      </Menubar.CheckboxItem>
    );
  }
);

CheckboxItem.displayName = 'CheckboxItemWebMenubar';

const MenubarRadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

const RadioGroup = React.forwardRef<ViewRef, MenubarRadioGroupProps>(
  ({ asChild, value, onValueChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <MenubarRadioGroupContext.Provider value={{ value, onValueChange }}>
        <Menubar.RadioGroup value={value} onValueChange={onValueChange} asChild>
          <Component ref={ref} {...props} />
        </Menubar.RadioGroup>
      </MenubarRadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroupWebMenubar';

function useMenubarRadioGroupContext() {
  const context = React.useContext(MenubarRadioGroupContext);
  if (!context) {
    throw new Error(
      'MenubarRadioGroup compound components cannot be rendered outside the MenubarRadioGroup component'
    );
  }
  return context;
}

const RadioItem = React.forwardRef<PressableRef, MenubarRadioItemProps>(
  (
    {
      asChild,
      value,
      textValue,
      closeOnPress = true,
      onPress: onPressProp,
      onKeyDown: onKeyDownProp,
      ...props
    },
    ref
  ) => {
    const { onValueChange } = useMenubarRadioGroupContext();
    const { close } = useMenubarContentContext();

    function onKeyDown(ev: React.KeyboardEvent) {
      onKeyDownProp?.(ev);
      if (ev.key === 'Enter' || ev.key === ' ') {
        onValueChange?.(value);
        onPressProp?.(EmptyGestureResponderEvent);
        if (closeOnPress) {
          close();
        }
      }
    }

    function onPress(ev: GestureResponderEvent) {
      onValueChange?.(value);
      onPressProp?.(ev);
      if (closeOnPress) {
        close();
      }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Menubar.RadioItem
        value={value}
        textValue={textValue}
        disabled={props.disabled ?? undefined}
        onSelect={closeOnPress ? undefined : onSelected}
        asChild
      >
        <Component
          ref={ref}
          // @ts-expect-error web only
          onKeyDown={onKeyDown}
          onPress={onPress}
          {...props}
        />
      </Menubar.RadioItem>
    );
  }
);

RadioItem.displayName = 'RadioItemWebMenubar';

const ItemIndicator = React.forwardRef<ViewRef, MenubarItemIndicatorProps>(
  ({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Menubar.ItemIndicator forceMount={forceMount} asChild>
        <Component ref={ref} {...props} />
      </Menubar.ItemIndicator>
    );
  }
);

ItemIndicator.displayName = 'ItemIndicatorWebMenubar';

const Separator = React.forwardRef<ViewRef, MenubarSeparatorProps>(
  ({ asChild, decorative, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Menubar.Separator asChild>
        <Component ref={ref} {...props} />
      </Menubar.Separator>
    );
  }
);

Separator.displayName = 'SeparatorWebMenubar';

const MenubarSubContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

const Sub = React.forwardRef<ViewRef, MenubarSubProps>(
  ({ asChild, defaultOpen, open: openProp, onOpenChange: onOpenChangeProp, ...props }, ref) => {
    const [open = false, onOpenChange] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChangeProp,
    });
    const Component = asChild ? Slot.View : View;
    return (
      <MenubarSubContext.Provider value={{ open, onOpenChange }}>
        <Menubar.Sub open={open} onOpenChange={onOpenChange}>
          <Component ref={ref} {...props} />
        </Menubar.Sub>
      </MenubarSubContext.Provider>
    );
  }
);

Sub.displayName = 'SubWebMenubar';

function useSubContext() {
  const context = React.useContext(MenubarSubContext);
  if (!context) {
    throw new Error(
      'MenubarSub compound components cannot be rendered outside the MenubarSub component'
    );
  }
  return context;
}

const SubTrigger = React.forwardRef<PressableRef, MenubarSubTriggerProps>(
  ({ asChild, textValue, disabled = false, onPress: onPressProp, ...props }, ref) => {
    const { onOpenChange } = useSubContext();

    function onPress(ev: GestureResponderEvent) {
      onOpenChange(true);
      onPressProp?.(ev);
    }

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Menubar.SubTrigger disabled={disabled ?? undefined} textValue={textValue} asChild>
        <Component ref={ref} onPress={onPress} {...props} />
      </Menubar.SubTrigger>
    );
  }
);

SubTrigger.displayName = 'SubTriggerWebMenubar';

const SubContent = React.forwardRef<ViewRef, MenubarSubContentProps>(
  ({ asChild = false, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Menubar.Portal>
        <Menubar.SubContent forceMount={forceMount}>
          <Component ref={ref} {...props} />
        </Menubar.SubContent>
      </Menubar.Portal>
    );
  }
);

Content.displayName = 'ContentWebMenubar';

export {
  CheckboxItem,
  Content,
  Group,
  Item,
  ItemIndicator,
  Label,
  Menu,
  Overlay,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
  useMenuContext,
  useRootContext,
  useSubContext,
};

function onSelected(ev: Event) {
  ev.preventDefault();
}
