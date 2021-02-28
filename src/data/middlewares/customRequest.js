import axios from 'axios';
import get from 'lodash/get';

export default () => () => (next) => async (action) => {
  if (!action) return false;
  const endpoint = get(action, 'payload.endpoint');
  const isCustom = get(action, 'payload.custom', false);
  const method = get(action, 'payload.method');
  const headers = get(action, 'payload.headers', null);
  const body = get(action, 'payload.body');
  const params = get(action, 'payload.params', null);
  const onSuccess = get(action, 'onSuccess', () => {});
  const onFailed = get(action, 'onFailed', () => {});

  if (!isCustom) {
    return next(action);
  }


  try {
    const res = await axios({
      url: endpoint,
      method,
      headers,
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
