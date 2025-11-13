import { slugify } from '@iheartradio/web.utilities/string/slugify';
import { isEmpty, isNonNullish } from 'remeda';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

const brandedArtistSlugSchema = z
  .union([
    z
      .string({
        required_error: 'Artist Slug is required',
        invalid_type_error: 'Artist Slug must be a string',
      })
      .refine(
        n => {
          const v = Number(n);
          return !Number.isNaN(v) && n.trim().length > 0;
        },
        { message: 'Invalid Artist Slug format' },
      ),
    z
      .string({
        required_error: 'Artist Slug is required',
        invalid_type_error: 'Artist Slug must be a string',
      })
      .regex(/[\w-]+-\d+/, 'Invalid Artist Slug format'),
  ])
  .brand('ArtistSlug');

export type ArtistSlug = z.infer<typeof brandedArtistSlugSchema>;

export const artistSlugSchema = brandedArtistSlugSchema
  .transform(original => {
    const segments = original.split('-');
    const slug =
      original.includes('-') ?
        original.slice(0, original.lastIndexOf('-'))
      : undefined;
    const id = Number(segments.at(-1));
    return { id, slug, original };
  })
  .pipe(
    z.object({
      id: z.number().gte(0).finite().safe(),
      slug: z.string().optional(),
      original: z.string().brand('ArtistSlug'),
    }),
  );

export function parseArtistSlug(x: unknown) {
  const result = artistSlugSchema.safeParse(x);
  if (!result.success) {
    const validationError = fromError(result.error);
    console.error(`Invalid Artist Slug: "${x}";`, validationError.message);
  }
  return result;
}

export function assertValidArtistSlug(x: unknown): asserts x is ArtistSlug {
  const result = artistSlugSchema.safeParse(x);
  if (!result.success) {
    const validationError = fromError(result.error);
    console.error(`Invalid Artist Slug: "${x}";`, validationError.toString());
    throw new Error(`Invalid Artist Slug: "${x}"`);
  }
}

export function makeArtistSlug(
  name: undefined | null,
  id: undefined | null,
): undefined;
export function makeArtistSlug(
  name: string | undefined | null,
  id: string | number | undefined | null,
): string;
export function makeArtistSlug(
  name: string | undefined | null,
  id: string | number | undefined | null,
): string | undefined {
  const segments = [name ? slugify(name) : undefined, id].filter(isNonNullish);
  return isEmpty(segments) ? undefined : segments.join('-');
}
