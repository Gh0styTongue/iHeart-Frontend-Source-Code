import { Outlet } from 'react-router';

export { AppErrorBoundary as ErrorBoundary } from '~app/components/error/app-error-boundary';
export { headers } from '~app/defaults.server';

export default function App() {
  return <Outlet />;
}
