import { all } from "redux-saga/effects";
import appSaga from "pages/App/store/appSaga";

export default function* rootSaga() {
  yield all([appSaga()]);
}
