import { toKebabCase } from 'remeda';
import { z } from 'zod';

const GetMarketSlugSchema = z.object({
  city: z
    .string()
    .transform(arg => arg.replaceAll(' ', '').toLocaleLowerCase())
    .optional(),
  stateAbbreviation: z
    .string()
    .transform(arg => arg.toLocaleLowerCase())
    .optional(),
  displayName: z
    .string()
    .transform(arg => toKebabCase(arg.toLocaleLowerCase()))
    .optional(),
  marketId: z.number(),
});

type GetMarketSlugProps = z.infer<typeof GetMarketSlugSchema>;

export const getMarketSlug = (market: GetMarketSlugProps) => {
  const { city, stateAbbreviation, displayName, marketId } =
    GetMarketSlugSchema.parse(market);

  return city && stateAbbreviation ?
      `${city.replaceAll(' ', '').toLowerCase()}-${stateAbbreviation.toLowerCase()}-${marketId}`
    : `${displayName}-${marketId}`;
};
