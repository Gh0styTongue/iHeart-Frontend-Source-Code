import {
  isEmpty,
  isNonNullish,
  isNullish,
  isPlainObject,
  pickBy,
} from 'remeda';

import type { Theme } from '../contexts/theme.js';
import type {
  BreakpointObject,
  BreakpointObjectWithDefault,
  ConditionalVariant,
  CSSVarFunction,
} from '../types.js';

export function joinClassnames(classNames: (string | undefined | null)[]) {
  return classNames.filter(Boolean).join(' ');
}

export function logUnknownProps(
  props: Record<string, unknown>,
  componentName?: string,
) {
  if (isEmpty(props)) return;

  console.warn(
    `The following props are not handled by "rainbowSprinkles()"${
      componentName ? 'component: ' + componentName : ''
    }:`,
    props,
  );
}

function toStringOrUndefined(x: unknown) {
  if (isNullish(x)) return undefined;
  if (typeof x === 'string') return x;
  if (typeof x === 'number') return String(x);

  throw new TypeError(
    `Type of ${x} (${typeof x}) could not be safely converted to a string`,
  );
}

export function getResponsiveVar<
  T extends string | number | Partial<BreakpointObject<unknown>> | undefined,
>(
  responsiveVars: T,
  varMap: BreakpointObjectWithDefault<CSSVarFunction>,
): Record<string, string | null | undefined> {
  if (isNullish(responsiveVars)) return {};

  const isPrimitive =
    typeof responsiveVars === 'string' || typeof responsiveVars === 'number';

  if (isPrimitive) {
    return {
      [varMap.default]: toStringOrUndefined(responsiveVars),
    };
  }

  return pickBy(
    {
      [varMap.xsmall]: toStringOrUndefined(responsiveVars?.xsmall),
      [varMap.small]: toStringOrUndefined(responsiveVars?.small),
      [varMap.shmedium]: toStringOrUndefined(responsiveVars?.shmedium),
      [varMap.medium]: toStringOrUndefined(responsiveVars?.medium),
      [varMap.large]: toStringOrUndefined(responsiveVars?.large),
      [varMap.xlarge]: toStringOrUndefined(responsiveVars?.xlarge),
      [varMap.xxlarge]: toStringOrUndefined(responsiveVars?.xxlarge),
    },
    val => isNonNullish(val),
  );
}

export function getFallbackVars(
  breakpointName: keyof BreakpointObject<unknown>,
  varMap: BreakpointObject<CSSVarFunction>,
): [string, ...string[]] {
  const orderedBreakpoints: ReadonlyArray<keyof BreakpointObject<unknown>> = [
    'xsmall',
    'small',
    'shmedium',
    'medium',
    'large',
    'xlarge',
    'xxlarge',
  ] as const;

  const varsWithFallbacks: string[] = [];

  for (const bp of orderedBreakpoints) {
    varsWithFallbacks.push(varMap[bp]);

    if (bp === breakpointName) {
      // Break out of the loop once we hit the specified breakpoint
      break;
    }
  }

  // This is coerced to a tuple because it is guaranteed to have at least one value (which is needed when using the result to define styles)
  return varsWithFallbacks.toReversed() as [string, ...string[]];
}

export function variantsToDataAttrs(variantProps: object) {
  const dataAttrs: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(variantProps)) {
    dataAttrs[`data-variant-${key}`] = value || undefined;
  }

  return dataAttrs;
}

export type ThemeVariant<Values> = ConditionalVariant<Theme, Values>;

export function getThemeVariant<T>(
  variantProp: ThemeVariant<T>,
  condition: Theme,
) {
  return isPlainObject(variantProp) ? variantProp[condition] : variantProp;
}
