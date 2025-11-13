import { IllustratedMessage } from '@iheartradio/web.accomplice/components/illustrated-message';
import { ErrorOutline } from '@iheartradio/web.accomplice/icons/error-outline';
import { Radio } from '@iheartradio/web.accomplice/icons/radio';

import { useErrorContext } from '../hooks/error-context.js';
import type { CTAIconItem, CTAItemData } from '../types/cta-props.js';
import { ErrorCTA, ErrorCTAMap } from './app-error.utils.js';

interface CTAItemProps {
  cta: CTAItemData;
}

export function CTAItem(props: CTAItemProps) {
  const { cta } = props;

  const Component = ErrorCTAMap[cta.block];

  if (!Component) {
    console.warn(
      `CTA block ${cta.block} does not have an associated component`,
    );

    return null;
  }

  return <Component {...cta.props} />;
}

export function getErrorIcon({ icon }: { icon: CTAIconItem }) {
  switch (icon) {
    case 'error-outline': {
      return ErrorOutline;
    }
    case 'radio': {
      return Radio;
    }
  }
}

export const AppError = () => {
  const {
    errorSource: { title, description, cta: ctaItems, icon },
  } = useErrorContext();

  return (
    <IllustratedMessage
      cta={
        <ErrorCTA>
          {ctaItems.map((cta, index) => {
            return <CTAItem cta={cta} key={`${index}-${cta.block}`} />;
          })}
        </ErrorCTA>
      }
      description={description}
      icon={getErrorIcon({ icon })}
      title={title}
    />
  );
};
