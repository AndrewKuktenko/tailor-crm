import get from 'lodash/get';

const initialState = {
  preprocess: false,
  settings: {
    name: '',
    type: 'file',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'IMPORT_FILE_PREPROCESS': {
      const settings = { ...state.settings };
      const preprocess = { ...action.payload };
      const originalName = get(action, 'originalName', '');

      settings.name = originalName;
      preprocess.originalName = originalName;
      preprocess.fileUrl = `${get(action, 'fileUrl', '')}/${get(action, 'key', '')}`;
      return {
        ...state,
        preprocess,
        settings,
      };
    }

    case 'CLEAN_IMPORT': {
      return initialState;
    }

    default:
      return state;
  }
};
