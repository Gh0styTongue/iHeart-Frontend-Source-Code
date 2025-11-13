import { forwardRef } from 'react';
import { VisuallyHidden } from 'react-aria';
import {
  type SearchFieldProps as PrimitiveProps,
  Input,
  Label,
  SearchField as RAComponent,
} from 'react-aria-components';

import { CancelFilled } from '../../icons/cancel-filled.js';
import { Loading } from '../../icons/loading.js';
import { Search } from '../../icons/search.js';
import { Button } from '../button/index.js';
import { Flex } from '../flex/index.js';
import {
  buttonStyle,
  closeIconStyle,
  inputStyle,
  searchFieldStyle,
} from './search-field.css.js';

export type SearchFieldProps = PrimitiveProps & {
  placeholder?: string;
  isLoading?: boolean;
};

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(
    { placeholder, isLoading = false, ...rest }: SearchFieldProps,
    ref,
  ) {
    return (
      <RAComponent
        className={searchFieldStyle}
        data-loading={isLoading}
        data-test="accomplice-search-field"
        {...rest}
      >
        <VisuallyHidden>
          <Label>{placeholder}</Label>
        </VisuallyHidden>
        <Flex gridArea="icon" paddingX="$12">
          {isLoading ?
            <Loading />
          : <Search />}
        </Flex>
        <Input className={inputStyle} placeholder={placeholder} ref={ref} />
        <Button
          className={buttonStyle}
          color="default"
          kind="tertiary"
          size="icon"
        >
          <CancelFilled className={closeIconStyle} />
        </Button>
      </RAComponent>
    );
  },
);
