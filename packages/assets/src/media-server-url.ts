import type {
  AnchorDirection,
  CatalogId,
  CatalogType,
  GravityRegion,
  ImageFormat,
  Macro,
  MergeComposite,
} from './types.js';

function quoteWrap(s: string) {
  return `"${s}"`;
}

const baseUrl = 'https://i.iheart.com';

// Mapping object of all the ops, in order to keep track of which ops have been applied
const OPS = Object.freeze({
  Anchor: 'anchor',
  BC: 'bc',
  Blur: 'blur',
  BoxMerge: 'boxmerge',
  Contain: 'contain',
  Cover: 'cover',
  Crop: 'crop',
  CropExact: 'cropexact',
  CropI: 'cropi',
  Duotone: 'duotone',
  Dup: 'dup',
  Fit: 'fit',
  FitWithin: 'fitwithin',
  Flood: 'flood',
  Format: 'format',
  Gradient2: 'gradient2',
  Gravity: 'gravity',
  Grey: 'grey',
  Grid: 'grid',
  Load: 'load',
  Max: 'max',
  MaxContain: 'maxcontain',
  Merge: 'merge',
  New: 'new',
  Pluck: 'pluck',
  Quality: 'quality',
  Ratio: 'ratio',
  Resize: 'resize',
  ResizeI: 'resizei',
  Run: 'run',
  Scale: 'scale',
  Smush: 'smush',
  Swap: 'swap',
  Tile: 'tile',
} as const);

// The op values as an array
const OP_VALUES = Object.freeze(Object.values(OPS)) as OP[];

type OPS_KEY = keyof typeof OPS;
type OP = (typeof OPS)[OPS_KEY];

interface MediaServerURLOptions {
  cacheable?: boolean;
  ops?: string[];
  url: string | URL;
}

function toURL(x: string) {
  if (URL.canParse(x)) {
    return new URL(x);
  } else {
    throw new TypeError(`Cannot create URL from: "${x}"`);
  }
}

export class MediaServerURL {
  cacheable: boolean;
  ops: string[];
  url: URL;

  static fromURL(
    url: MediaServerURL | URL | string | undefined,
  ): MediaServerURL {
    if (url instanceof MediaServerURL) {
      return url.clone();
    }

    if (typeof url === 'string') {
      url = toURL(url);
    }

    if (!(url instanceof URL)) {
      console.trace('bad url');
      throw new TypeError(`Cannot create MediaServerURL from "${url}"`);
    }

    // External URL
    if (
      url?.hostname &&
      url.hostname !== 'i.iheart.com' &&
      url.hostname !== 'i-stg.iheart.com'
    ) {
      const base64Encoded = btoa(url.toString());
      url = new URL(['v3', 'url', base64Encoded].join('/'), baseUrl);
    }

    return new MediaServerURL({ url });
  }

  static fromCatalog({ type, id }: { type: CatalogType; id: CatalogId }) {
    const url = new URL(['v3', 'catalog', type, id].join('/'), baseUrl);
    return new MediaServerURL({ url });
  }

  static forUser({ id }: { id: number }) {
    const url = new URL(['v3', 'user', id, 'profile'].join('/'), baseUrl);
    return new MediaServerURL({ url });
  }

  constructor({ cacheable = true, url, ops = [] }: MediaServerURLOptions) {
    this.cacheable = cacheable;

    this.ops = [...ops];

    this.url = new URL(url);

    if (this.url.searchParams.has('ops')) {
      const existingOps = decodeURIComponent(this.url.searchParams.get('ops')!);
      const parsedOps = existingOps
        .split('),')
        .map(x => {
          const [key, value] = x.split('(');
          if (OP_VALUES.includes(key as OP)) {
            return `${key}(${value.endsWith(')') ? value.slice(0, -1) : value})`;
          }
        })
        .filter(v => v !== undefined);
      this.ops = [...parsedOps, ...this.ops];

      this.url.searchParams.delete('ops');
    }
  }

  /**
   * Whether or not this MediaServerURL has a particular op applied
   *
   * @param x the op to lookup
   * @returns boolean
   */
  hasOp(x: OP): boolean {
    return this.ops.some(op => op.startsWith(x));
  }

  /**
   * Remove all ops by name
   *
   * @param x the op to lookup
   * @returns MediaServerURL
   */
  removeOps(x: OP) {
    this.ops = this.ops.filter(op => !op.startsWith(x));
    return this;
  }

  /** Convert the `MediaServerURL` to a `URL`. All ops will be applied to the URL before it is
   * converted. */
  toURL() {
    if (this.ops.length > 0) {
      this.url.searchParams.set('ops', this.ops.join(','));
    }

    if (this.cacheable && !this.url.searchParams.has('cacheable')) {
      this.url.searchParams.append('cacheable', 'true');
    }

    return this.url;
  }

  /** Convert the `MediaServerURL` to a string. All ops will be applied to the URL before it is
   * converted. */
  toString() {
    return this.toURL().toString();
  }

  /**
   * Clone the `MediaServerURL` instance.
   *
   * You can use this to do things like applying some ops to a URL, clone it, and apply additional
   * ops to each separately.
   */
  clone() {
    const clonedURL = new URL(this.url);
    clonedURL.search = '';
    return new MediaServerURL({
      url: clonedURL,
      ops: this.ops,
    });
  }

  /**
   * Remove all existing ops.
   */
  clear() {
    this.url.searchParams.delete('ops');
    this.ops = [];
    return this;
  }

  /**
   * Load an image into the processing stack
   */
  private static _load(url: string | URL) {
    const href = url instanceof URL ? url.toString() : url;
    return `${OPS.Load}("${href}")`;
  }

  load(url: string | URL) {
    this.ops.push(MediaServerURL._load(url));
    return this;
  }

  /**
   * Adds a cacheable param to the image url, which allows the browser to cache the image asset.
   */
  setCacheable(cacheable: boolean) {
    this.cacheable = cacheable;

    return this;
  }

  /**
   * Resize image exactly as specified.
   *
   * When one dimension is 0, the aspect ratio is locked and the image is scaled only based on the
   * dimension specified.
   */
  private static _resize(width: number = 0, height: number = 0) {
    return `${OPS.Resize}(${[width, height].join(',')})`;
  }

  resize(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._resize(width, height));
    return this;
  }

  /**
   * Alias of `resize()`.
   *
   * Resize image exactly as specified.
   *
   * When one dimension is 0, the aspect ratio is locked and the image is scaled only based on the
   * dimension specified.
   */
  private static _scale(width: number = 0, height: number = 0) {
    return `${OPS.Scale}(${[width, height].join(',')})`;
  }
  scale(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._scale(width, height));
    return this;
  }

  /**
   * If there are multiple images in the processing pipeline, only resize the current image
   *
   * @param width width
   * @param height height
   * @returns MediaServerURL
   */
  private static _resizei(width: number, height: number) {
    return `${OPS.ResizeI}(${[width, height].join(',')})`;
  }

  resizei(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._resizei(width, height));
    return this;
  }

  /**
   * Cover takes an image and makes sure that pixels from that image cover the entire box you
   * specify. This is great if you don't mind losing a little bit of the image to make sure your
   * space is totally filled.
   *
   * It is highly recommended to use `gravity()` and/or `anchor()` in conjunction with `cover()` or
   * `fit()` to ensure the important content of the image is visible.
   */
  private static _cover(width: number, height: number) {
    return `${OPS.Cover}(${[width, height].join(',')})`;
  }
  cover(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._cover(width, height));
    return this;
  }

  /**
   * Alias of `cover()`
   *
   * Crops an image to fill the entire box you specify.
   *
   * It is highly recommended to use `gravity()` and/or `anchor()` in conjunction with `cover()` or
   * `fit()` to ensure the important content of the image is visible.
   */
  private static _fit(width: number, height: number) {
    return `${OPS.Fit}(${[width, height].join(',')})`;
  }
  fit(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._fit(width, height));
    return this;
  }

  /**
   * Contain is the opposite of cover.
   * Instead of making sure that your space is covered regardless of image loss, it makes sure that
   * your space is filled as best as it can be without losing any image data at all.
   *
   * Any extra space will be filled with content-aware color.
   */
  private static _contain(width: number, height: number) {
    return `${OPS.Contain}(${[width, height].join(',')})`;
  }

  contain(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._contain(width, height));
    return this;
  }

  /**
   * Alias for `contain`
   *
   * @param width width
   * @param height height
   * @returns MediaServerURL
   */
  private static _fitwithin(width: number, height: number) {
    return `${OPS.FitWithin}(${[width, height].join(',')})`;
  }
  fitwithin(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._fitwithin(width, height));
    return this;
  }

  /**
   * Locks the image to the aspect ratio provided by `width` and `height`, and fills the space
   * like `cover()`;
   *
   * It is highly recommended to use `gravity()` and/or `anchor()` in conjunction with `cover()` or
   * `fit()` to ensure the important content of the image is visible.
   *
   * @param width width
   * @param height height
   * @returns MediaServerURL
   */
  private static _max(width: number, height: number) {
    return `${OPS.Max}(${[width, height].join(',')})`;
  }
  max(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._max(width, height));
    return this;
  }

  /**
   * Locks the image to the aspect ratio provided by `width` and `height`, but contains the entire
   * image in the box specified
   *
   * @param width number
   * @param height number
   * @returns MediaServerURL
   */
  private static _maxcontain(width: number, height: number) {
    return `${OPS.MaxContain}(${[width, height].join(',')})`;
  }
  maxcontain(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._maxcontain(width, height));
    return this;
  }

  /**
   * Crops the image to the pixel dimensions specified by `width` and `height`
   *
   * @param width number
   * @param height number
   * @returns MediaServerURL
   */
  private static _crop(width: number, height: number) {
    return `${OPS.Crop}(${[width, height].join(',')})`;
  }
  crop(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._crop(width, height));
    return this;
  }

  /**
   * If there are multiple images in the processing pipeline, crops only the current image to the
   * pixel dimension specified by `width` and `height`
   *
   * @param width number
   * @param height number
   * @returns MediaServerURL
   */
  private static _cropi(width: number, height: number) {
    return `${OPS.CropI}(${[width, height].join(',')})`;
  }
  cropi(width: number = 0, height: number = 0) {
    this.ops.push(MediaServerURL._cropi(width, height));
    return this;
  }

  /**
   * Like `crop()` but also takes in an origin of where to begin the crop.
   *
   * @param x origin horizontal
   * @param y origin vertical
   * @param width number
   * @param height number
   * @returns MediaServerURL
   */
  private static _cropexact(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    return `${OPS.CropExact}(${[x, y, width, height].join(',')})`;
  }
  cropexact(
    x: number = 0,
    y: number = 0,
    width: number = 0,
    height: number = 0,
  ) {
    this.ops.push(MediaServerURL._cropexact(x, y, width, height));
    return this;
  }

  /**
   * Specify the aspect ratio of the image.
   */
  private static _ratio(horizontal: number, vertical: number) {
    return `${OPS.Ratio}(${[horizontal, vertical].join(',')})`;
  }
  ratio(horizontal: number, vertical: number) {
    this.ops.push(MediaServerURL._ratio(horizontal, vertical));
    return this;
  }

  // All Colors and Effects ops operate on the "current" image in the processing stack,
  // so the temporal portion is included in the symbol key
  private static _blur(radius: number) {
    return `${OPS.Blur}(${radius})`;
  }
  blur(radius: number) {
    this.ops.push(MediaServerURL._blur(radius));
    return this;
  }

  private static _grey() {
    return `${OPS.Grey}()`;
  }
  grey() {
    this.ops.push(MediaServerURL._grey());
    return this;
  }

  private static _bc(brightness: number, contrast: number) {
    return `${OPS.BC}(${[brightness, contrast].join(',')})`;
  }
  bc(brightness: number, contrast: number) {
    this.ops.push(MediaServerURL._bc(brightness, contrast));
    return this;
  }

  private static _duotone(color1: string, color2: string) {
    return `${OPS.Duotone}(${[color1, color2].map(quoteWrap).join(',')})`;
  }
  duotone(color1: string, color2: string) {
    this.ops.push(MediaServerURL._duotone(color1, color2));
    return this;
  }

  private static _flood(color: string) {
    return `${OPS.Flood}(${quoteWrap(color)})`;
  }
  flood(color: string) {
    this.ops.push(MediaServerURL._flood(color));
    return this;
  }

  private static _gradient2(color1: string, color2: string, rotation: number) {
    return `${OPS.Gradient2}(${quoteWrap(color1)},${quoteWrap(color2)},${rotation})`;
  }
  gradient2(color1: string, color2: string, rotation: number) {
    this.ops.push(MediaServerURL._gradient2(color1, color2, rotation));
    return this;
  }

  private static _gravity(region: GravityRegion) {
    return `${OPS.Gravity}(${quoteWrap(region)})`;
  }
  gravity(region: GravityRegion) {
    this.ops.push(MediaServerURL._gravity(region));
    return this;
  }

  private static _anchor(x: number, y: number) {
    return `${OPS.Anchor}(${[x, y].join(',')})`;
  }
  anchor(x: number, y: number) {
    this.ops.push(MediaServerURL._anchor(x, y));
    return this;
  }

  private static _smush() {
    return `${OPS.Smush}()`;
  }
  smush() {
    this.ops.push(MediaServerURL._smush());
    return this;
  }

  private static _dup() {
    return `${OPS.Dup}()`;
  }
  dup() {
    this.ops.push(MediaServerURL._dup());
    return this;
  }

  private static _swap() {
    return `${OPS.Swap}()`;
  }
  swap() {
    this.ops.push(MediaServerURL._swap());
    return this;
  }

  private static _new() {
    return `${OPS.New}()`;
  }
  new() {
    this.ops.push(MediaServerURL._new());
    return this;
  }

  private static _merge(composite: MergeComposite) {
    return `${OPS.Merge}(${quoteWrap(composite)})`;
  }
  merge(composite: MergeComposite) {
    this.ops.push(MediaServerURL._merge(composite));
    return this;
  }

  private static _boxmerge(
    composite: MergeComposite,
    anchors: Partial<Record<AnchorDirection, string>>,
  ) {
    const stringifiedAnchors = Object.entries(anchors)
      .map(([k, v]) => k + ':' + v)
      .join(',');
    return `${OPS.BoxMerge}(${[
      quoteWrap(composite),
      quoteWrap(stringifiedAnchors),
    ].join(',')})`;
  }
  boxmerge(
    composite: MergeComposite,
    anchors: Partial<Record<AnchorDirection, string>>,
  ) {
    this.ops.push(MediaServerURL._boxmerge(composite, anchors));
    return this;
  }

  private static _pluck(index: number) {
    return `${OPS.Pluck}(${index})`;
  }
  pluck(index: number) {
    this.ops.push(MediaServerURL._pluck(index));
    return this;
  }

  private static _tile(cols: number, rows: number) {
    return `${OPS.Tile}(${[cols, rows].join(',')})`;
  }
  tile(cols: number, rows: number) {
    this.ops.push(MediaServerURL._tile(cols, rows));
    return this;
  }

  private static _grid(
    cols: number,
    rows: number,
    offset: number,
    padding: number,
    gap: number,
  ) {
    return `${OPS.Grid}(${[cols, rows, offset, padding, gap].join(',')})`;
  }
  grid(
    cols: number,
    rows: number,
    offset: number,
    padding: number,
    gap: number,
  ) {
    this.ops.push(MediaServerURL._grid(cols, rows, offset, padding, gap));
    return this;
  }

  private static _format(...formats: ImageFormat[]) {
    return `${OPS.Format}(${formats.map(quoteWrap).join(',')})`;
  }
  format(...formats: ImageFormat[]) {
    this.ops.push(MediaServerURL._format(...formats));
    return this;
  }

  /**
   * Set the image quality for codecs that support it. For lossless codecs this command will do nothing.
   */
  private static _quality(value: number) {
    return `${OPS.Quality}(${value})`;
  }
  quality(value: number) {
    this.ops.push(MediaServerURL._quality(value));
    return this;
  }

  private static _run(macro: Macro) {
    return `${OPS.Run}(${quoteWrap(macro)})`;
  }
  run(macro: Macro) {
    this.ops.push(MediaServerURL._run(macro));
    return this;
  }
}
