import axios from 'axios';
import get from 'lodash/get';

export default () => () => (next) => async (action) => {
  if (!action) return false;
  const endpoint = get(action, 'payload.endpoint');
  const isCustom = get(action, 'payload.custom', false);
  const method = get(action, 'payload.method');
  const body = get(action, 'payload.body');
  const params = get(action, 'payload.params', null);
  const onSuccess = get(action, 'onSuccess', () => {});
  const onFailed = get(action, 'onFailed', () => {});

  const apiHost = process.env.REACT_APP_API_URL;

  if (isCustom) {
    return next(action);
  }

  if (get(action, 'data')) return next(action);

  try {
    const res = await axios({
      url: `${apiHost}/${endpoint}`,
      method,
      data: body,
      params,
    });

    const data = get(res, 'data');
    if (onSuccess) onSuccess(data);

    return next({
      ...action,
      payload: data,
    });
  } catch (err) {
    if (onFailed) return onFailed(err);
    return false;
  }
};
