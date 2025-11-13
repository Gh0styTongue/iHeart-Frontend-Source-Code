import { globalConfig } from './configs/index.js';
import { createConfig } from './create-config.js';
import { globalConfigSchema } from './schemas/index.js';

export const generateGlobalConfig = () => {
  return createConfig(globalConfig, globalConfigSchema);
};
