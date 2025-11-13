import { invariant } from '@epic-web/invariant';
import { isServer } from '@iheartradio/web.api';
import {
  type CreateWebAPIClientOptions,
  type WebAPIClient,
  createWebAPIClient,
} from '@iheartradio/web.api/webapi';
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isDeepEqual } from 'remeda';

const WebApiClientContext = createContext<WebAPIClient | null>(null);

const DefaultWebApiClientOptions: CreateWebAPIClientOptions = {};

export function WebApiClientProvider({
  children,
  options = DefaultWebApiClientOptions,
}: {
  children: React.ReactNode;
  options?: CreateWebAPIClientOptions;
}) {
  const [webApiClient, setWebApiClient] = useState(() =>
    getWebApiClient(options),
  );
  const optionsRef = useRef<CreateWebAPIClientOptions>(options);

  useEffect(() => {
    const { current: currentOptions } = optionsRef;
    if (!isDeepEqual(options, currentOptions)) {
      optionsRef.current = {
        ...currentOptions,
        ...options,
      };

      setWebApiClient(makeWebApiClient(currentOptions));
    }
  }, [options]);

  return (
    <WebApiClientContext.Provider
      value={useMemo(() => webApiClient, [webApiClient])}
    >
      {children}
    </WebApiClientContext.Provider>
  );
}

export function useWebApiClient() {
  const webApiClient = use(WebApiClientContext);
  invariant(
    webApiClient,
    'useWebApiClient must be used within WebApiClientProvider',
  );
  return webApiClient;
}

function makeWebApiClient(options: CreateWebAPIClientOptions = {}) {
  return createWebAPIClient(options);
}

let webapiClient: WebAPIClient | undefined;

export function getWebApiClient(options?: CreateWebAPIClientOptions) {
  if (isServer) {
    return makeWebApiClient(options);
  }

  if (!webapiClient) {
    webapiClient = makeWebApiClient(options);
  }

  return webapiClient;
}
