import { lightDark } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Button } from '@iheartradio/web.accomplice/components/button';
import {
  Dialog,
  DialogTitle,
  useDialogContainer,
} from '@iheartradio/web.accomplice/components/dialog';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Message } from '@iheartradio/web.accomplice/components/message';
import { TextField } from '@iheartradio/web.accomplice/components/text-field';
import { Loading } from '@iheartradio/web.accomplice/icons/loading';
import { useEffect, useReducer } from 'react';

import { useCreatePlaylist } from '~app/queries/playlist';
import { INPUT_MAX_LENGTH_DEFAULT } from '~app/utilities/constants';

// Either the `albumId` or `tracks` key should be set, but not both.
export type CreatePlaylistDialogProps = {
  albumId?: number;
  isOpen?: boolean;
  tracks?: number[];
};

type CreatePlaylistState = {
  albumId?: number;
  tracks?: number[];
  name: string;
};

type CreatePlaylistAction = {
  type: 'updateName';
  payload: { name: string };
};

function CreatePlaylistStateInitializer({
  albumId,
  tracks,
}: Omit<CreatePlaylistState, 'name'>) {
  return {
    albumId,
    tracks,
    name: '',
  };
}

function CreatePlaylistReducer(
  state: CreatePlaylistState,
  action: CreatePlaylistAction,
) {
  switch (action.type) {
    case 'updateName': {
      const { name } = action.payload;
      return {
        ...state,
        name,
      };
    }
  }
}

export const CreatePlaylistDialog = ({
  albumId,
  tracks,
}: CreatePlaylistDialogProps) => {
  const [state, dispatch] = useReducer(
    CreatePlaylistReducer,
    { albumId, tracks },
    CreatePlaylistStateInitializer,
  );

  const {
    mutate: createPlaylist,
    error,
    isError,
    isIdle,
    isPending,
    isSuccess,
  } = useCreatePlaylist();

  const dialog = useDialogContainer();

  useEffect(() => {
    if (isSuccess) {
      dialog.dismiss();
    }
  }, [isSuccess, dialog]);

  return (
    <Dialog>
      <Flex flexDirection="column" gap="$16">
        <Box asChild color={lightDark('$gray600', '$brandWhite')}>
          <DialogTitle>Create New Playlist</DialogTitle>
        </Box>
        <Box>
          <TextField
            isRequired
            label="Playlist Name"
            maxLength={INPUT_MAX_LENGTH_DEFAULT}
            name="name"
            onChange={value => {
              dispatch({ type: 'updateName', payload: { name: value } });
            }}
            placeholder="Enter playlist name"
          />

          <Message kind="neutral">
            {state.name.length} / {INPUT_MAX_LENGTH_DEFAULT}
          </Message>
        </Box>
        {isError ?
          <Message key={error.message} kind="error">
            {error.message}
          </Message>
        : null}
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          gap="$16"
          justifyContent="center"
        >
          <Button
            color="default"
            inline
            kind="secondary"
            onPress={() => dialog.dismiss()}
            size={{ mobile: 'small', medium: 'large' }}
            type="reset"
          >
            Cancel
          </Button>
          <Button
            color="red"
            inline
            isDisabled={isPending || state.name.trim().length === 0}
            kind="primary"
            onPress={() => {
              createPlaylist(state);
            }}
            size={{ xsmall: 'small', medium: 'large' }}
            type="submit"
          >
            {isIdle ? 'Create playlist' : <Loading size={16} />}
          </Button>
        </Box>
      </Flex>
    </Dialog>
  );
};
