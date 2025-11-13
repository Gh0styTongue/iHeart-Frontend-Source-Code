import type { BaseConfig, CountryCode } from '@iheartradio/web.config';
import { generateGlobalConfig } from '@iheartradio/web.config';
import { createConfigContext } from '@iheartradio/web.config/react';
import { type ReactNode, useEffect } from 'react';
import { useSessionStorage } from 'usehooks-ts';

export const configFactory = generateGlobalConfig();

// Default context value to US/prod config, this can be overridden in the root loader based on headers and query params
const { Provider, useConfig } = createConfigContext(
  configFactory.config.US.production,
);

const ConfigProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: BaseConfig;
}) => {
  const [, setCountryCode] = useSessionStorage<CountryCode | null>(
    'countryCode',
    null,
  );

  useEffect(() => {
    setCountryCode(value.environment.countryCode);
  }, [value.environment.countryCode, setCountryCode]);

  return <Provider value={value}>{children}</Provider>;
};

export { ConfigProvider, useConfig };
