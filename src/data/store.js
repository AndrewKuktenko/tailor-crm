import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import createApiMiddleware from './middlewares/api';
import rootReducer from './reducers/rootReducer';
import createCustomRequestMiddleware from './middlewares/customRequest';

const apiMiddleware = createApiMiddleware();
const customRequest = createCustomRequestMiddleware(); 

export default function configureStore(initialState = {}) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk, apiMiddleware, customRequest)),
  );
}
