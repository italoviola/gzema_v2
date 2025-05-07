import { useDispatch } from 'react-redux';
import {
  replacePart,
  initialState as partInitialState,
} from 'state/part/partSlice';
import { editApp, initialState as appInitialState } from 'state/app/appSlice';

export const useSetNewFile = () => {
  const dispatch = useDispatch();

  const setNewFile = () => {
    dispatch(
      replacePart({
        ...partInitialState,
      }),
    );
    dispatch(
      editApp({
        ...appInitialState,
      }),
    );
  };

  return setNewFile;
};
