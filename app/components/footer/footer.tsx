import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Separator } from '@iheartradio/web.accomplice/components/separator';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { AdChoices } from '@iheartradio/web.accomplice/icons/ad-choices';
import { Facebook } from '@iheartradio/web.accomplice/icons/facebook';
import { Instagram } from '@iheartradio/web.accomplice/icons/instagram';
import { PrivacyChoices } from '@iheartradio/web.accomplice/icons/privacy-choices';
import { Threads } from '@iheartradio/web.accomplice/icons/threads';
import { TikTok } from '@iheartradio/web.accomplice/icons/tiktok';
import { XFormerlyKnownAsTwitter } from '@iheartradio/web.accomplice/icons/x-formerly-known-as-twitter';
import { YouTube } from '@iheartradio/web.accomplice/icons/youtube';

import { useConfig } from '~app/contexts/config';

import { FooterLink } from './footer-link';
import { FooterSocial } from './footer-social';

function Copyright() {
  return (
    <Text
      color={lightDark(vars.color.gray450, vars.color.brandWhite)}
      kind="caption-4"
    >
      © {new Date().getFullYear()} iHeartMedia, Inc.
    </Text>
  );
}

export function Footer() {
  const { urls } = useConfig();
  return (
    <Flex
      asChild
      data-test="footer"
      flexDirection="column"
      gap={vars.space[16]}
      paddingBottom={vars.space[32]}
      paddingTop={vars.space[40]}
      paddingX={{
        mobile: vars.space[16],
        large: vars.space[32],
      }}
    >
      <footer>
        <Separator
          backgroundColor={lightDark(vars.color.gray200, vars.color.gray500)}
        />
        <Flex
          alignItems={{
            mobile: 'flex-start',
            large: 'center',
          }}
          flexDirection={{
            mobile: 'column',
            large: 'row',
          }}
          gap={{
            mobile: vars.space[16],
            large: vars.space[4],
          }}
        >
          <Text
            color={lightDark(vars.color.gray450, vars.color.brandWhite)}
            kind="caption-4"
          >
            Follow iHeartRadio on:
          </Text>
          <Flex asChild gap={vars.space[4]} margin="0">
            <ul>
              <FooterSocial
                icon={Facebook}
                link={urls.social?.facebook ?? ''}
                name="facebook"
              />
              <FooterSocial
                icon={XFormerlyKnownAsTwitter}
                link={urls.social?.twitter ?? ''}
                name="x"
              />
              <FooterSocial
                icon={Instagram}
                link={urls.social?.instagram ?? ''}
                name="instagram"
              />
              <FooterSocial
                icon={Threads}
                link={urls.social?.threads ?? ''}
                name="threads"
              />
              <FooterSocial
                icon={TikTok}
                link={urls.social?.tiktok ?? ''}
                name="tiktok"
              />
              <FooterSocial
                icon={YouTube}
                link={urls.social?.youtube ?? ''}
                name="youtube"
              />
            </ul>
          </Flex>
        </Flex>
        <Flex
          alignItems={{ mobile: 'flex-start', large: 'center' }}
          flexDirection={{
            mobile: 'column',
            large: 'row',
          }}
          gap={{
            mobile: vars.space[16],
            large: vars.space[24],
          }}
        >
          <Box
            display={{
              mobile: 'none',
              large: 'block',
            }}
          >
            <Copyright />
          </Box>
          <Flex
            alignItems="center"
            asChild
            flexDirection="row"
            flexWrap="wrap"
            gap={{
              mobile: vars.space[16],
              large: vars.space[24],
            }}
            margin="0"
          >
            <ul>
              <FooterLink link={urls.help ?? ''}>Help</FooterLink>
              <FooterLink link={urls.advertise ?? ''}>Advertise</FooterLink>
              <FooterLink link={urls.privacy ?? ''}>Privacy Policy</FooterLink>
              <FooterLink link={urls.terms ?? ''}>Terms of Use</FooterLink>
              <FooterLink link={urls.optout ?? ''}>
                <Flex alignItems="center" gap="$8">
                  Your Privacy Choices <PrivacyChoices />
                </Flex>
              </FooterLink>
              <FooterLink link={urls.adChoices ?? ''}>
                <Flex gap={vars.space[4]}>
                  AdChoices
                  <AdChoices
                    fill={lightDark(vars.color.gray450, vars.color.brandWhite)}
                    size={16}
                  />
                </Flex>
              </FooterLink>
            </ul>
          </Flex>
          <Box
            display={{
              mobile: 'block',
              large: 'none',
            }}
          >
            <Copyright />
          </Box>
        </Flex>
      </footer>
    </Flex>
  );
}
