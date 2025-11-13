import type { User, UserType } from '@iheartradio/web.config';

export const getNewRelicCustomAttributes = ({
  appVersion,
  requestInfo,
  SHORT_COMMIT,
  user,
  userType,
}: {
  appVersion?: string;
  requestInfo?: {
    isMobile?: boolean;
    hints?: {
      theme?: string;
    };
  };
  SHORT_COMMIT?: string;
  user?: User;
  userType?: UserType;
}) => {
  return {
    accountType: user?.accountType ?? '',
    appVersion: appVersion ?? '',
    isAnonymous: user?.isAnonymous ?? '',
    isMobile: requestInfo?.isMobile ?? '',
    profileId: user?.profileId ? String(user.profileId) : '',
    marketName: user?.marketName ?? '',
    shortCommit: SHORT_COMMIT ?? '',
    theme: requestInfo?.hints?.theme ?? '',
    userType: userType ?? '',
  };
};
