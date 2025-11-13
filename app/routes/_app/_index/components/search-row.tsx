import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { Search } from '@iheartradio/web.accomplice/icons/search';
import { useNavigate } from 'react-router';
import { $path } from 'safe-routes';

import { Routes } from '~app/utilities/constants';

export function SearchRow() {
  const navigate = useNavigate();

  return (
    <Flex
      direction="row"
      justifyContent="center"
      paddingX={{ mobile: '$16', medium: '$32' }}
      paddingY={{ mobile: '$16', medium: '$24' }}
    >
      <Flex
        alignItems="center"
        gap={vars.space[12]}
        justifyContent="space-around"
      >
        <Text color={lightDark('$gray600', '$brandWhite')} kind="subtitle-2">
          Looking for something specific?
        </Text>
        <Button
          color="default"
          kind="secondary"
          onPress={() =>
            navigate($path(Routes.Search), {
              state: { prevPage: Routes.Home },
            })
          }
          size={{ mobile: 'small', medium: 'large' }}
        >
          <Search size={18} />
          Search
        </Button>
      </Flex>
    </Flex>
  );
}
