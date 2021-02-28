export const importFilePreSigned = ({ file: { file }, onError = () => {}, onSuccess = () => {} }) => (dispatch) => {
  dispatch({
    type: 'IMPORT_FILE_PRE_SIGNED',
    payload: {
      endpoint: 'api/v1/import/pre-signed',
      method: 'GET',
      params: {
        sourceType: file.type,
      },
    },
    onSuccess: (data) => {
      const { fields, url } = data;
      const form = new FormData();
      Object.keys(fields).forEach((key) => {
        form.append(key, fields[key]);
      });
      form.append('file', file);

      dispatch({
        type: 'UPLOAD_FILE_TO_S3',
        payload: {
          custom: true,
          endpoint: url,
          method: 'POST',
          body: form,
        },
        onSuccess: () => {
          dispatch({
            type: 'IMPORT_FILE_PREPROCESS',
            payload: {
              endpoint: 'api/v1/import/preprocess',
              method: 'POST',
              body: {
                key: fields.Key,
              },
            },
            onFailed: (error) => onError(error),
            onSuccess: (res) => onSuccess(res),
            fileUrl: url,
            originalName: file.name,
            key: fields.Key,
          });
        },
        onFailed: (error) => onError(error),
      });
    },
    onFailed: (error) => onError(error),
  });
};

export const createImport = (data, onSuccess = () => {}, onError = () => {}) => (dispatch) => {
  dispatch({
    type: 'CREATE_IMPORT',
    payload: {
      endpoint: 'api/v1/import',
      method: 'POST',
      body: data,
    },
    onSuccess,
    onError,
  });
};

export const clearImport = () => (dispatch) => {
  dispatch({
    type: 'CLEAN_IMPORT',
    data: {},
  });
};
