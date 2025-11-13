import { Flex } from '@iheartradio/web.accomplice/components/flex';
import {
  type SelectFieldProps,
  SelectField as Select,
} from '@iheartradio/web.accomplice/components/select-field';
import { Text } from '@iheartradio/web.accomplice/components/text';

export function CarouselSelect({
  children,
  sectionTitle,
  ...props
}: SelectFieldProps<{ key: string; value: string; label: string }> & {
  sectionTitle?: string;
}) {
  const css = {
    width: 'auto',
    maxWidth: {
      xsmall: '16rem',
      medium: '100%',
    },
    paddingRight: {
      small: '$8',
      touch: '$0',
    },
  };

  return sectionTitle ?
      <Flex
        alignItems="center"
        gap="$8"
        justifyContent={{ mobile: 'space-between', large: 'flex-start' }}
        width="100%"
      >
        <Text as="h3" kind={{ mobile: 'h4', large: 'h3' }}>
          {sectionTitle}
        </Text>
        <Select css={css} {...props}>
          {children}
        </Select>
      </Flex>
    : <Select css={css} {...props}>
        {children}
      </Select>;
}
