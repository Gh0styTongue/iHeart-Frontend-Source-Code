import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import {
  MenuContent,
  MenuItem,
  MenuTrigger,
} from '@iheartradio/web.accomplice/components/menu';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { View } from '@iheartradio/web.accomplice/components/view';
import { ChevronDown } from '@iheartradio/web.accomplice/icons/chevron-down';
import { UserSettings } from '@iheartradio/web.accomplice/icons/user-settings';
import { useRef, useState } from 'react';
import { Form } from 'react-router';
import { $path } from 'safe-routes';

import { useConfig } from '~app/contexts/config';
import { useUser } from '~app/contexts/user';

function getUserName(userName = '') {
  if (userName.includes('@')) {
    return userName;
  }
  const splitName = userName.split(' ');
  const firstName = splitName[0];
  if (splitName.length > 1) {
    const lastName = splitName.at(-1);
    const lastInitial = lastName?.[0];
    if (lastInitial) {
      return `${firstName} ${lastInitial}.`;
    }
  }
  return firstName;
}

function truncateName(text: string, maxLength: number) {
  if (text && text.length > maxLength) {
    return `${text.slice(0, maxLength - 3)}...`;
  }
  return text;
}

export function AuthSettings() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { urls } = useConfig();
  const user = useUser();
  const settingsLink = new URL('/settings', urls.account).toString();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <MenuTrigger
        isOpen={menuIsOpen}
        onOpenChange={open => setMenuIsOpen(open)}
      >
        <Button
          color="transparent"
          css={{ aspectRatio: 'auto' }}
          kind="tertiary"
          size={{ mobile: 'icon', large: 'small' }}
          textColor={lightDark(vars.color.gray600, vars.color.brandWhite)}
        >
          <View isHidden={{ mobile: false, large: true }}>
            <UserSettings size={24} />
          </View>
          <View isHidden={{ mobile: true, large: false }}>
            <Flex alignItems="center" flexDirection="row" gap={vars.space[4]}>
              <UserSettings size={24} />
              <Text as="span" css={{ whiteSpace: 'nowrap' }} kind="button-2">
                {truncateName(getUserName(user?.name ?? user.email), 15)}
              </Text>
              <ChevronDown size={16} />
            </Flex>
          </View>
        </Button>
        <MenuContent placement="bottom">
          <MenuItem data-test="settings" href={settingsLink} target="_blank">
            Settings
          </MenuItem>
          <MenuItem
            onAction={() => {
              if (formRef.current) {
                formRef.current.submit();
              }
            }}
          >
            Log Out
          </MenuItem>
        </MenuContent>
      </MenuTrigger>
      <Form
        action={$path('/logout')}
        method="POST"
        ref={formRef}
        reloadDocument
      />
    </>
  );
}
