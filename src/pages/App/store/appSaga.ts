import { productCategoryApi } from "apis/productCategory";
import { roleApi } from "apis/role";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  GetSelectionProductCategoriesSuccessPayload,
  GetSelectionRolesSuccessPayload,
} from "pages/App/store/store.type";
import {
  getSelectionProductCategories,
  getSelectionProductCategoriesSuccess,
  getSelectionRoles,
  getSelectionRolesSuccess,
} from "pages/App/store/appSlice";

function* getSelectionProductCategoriesSaga(): unknown {
  try {
    const response = yield call(productCategoryApi.getSelection);
    const payload: GetSelectionProductCategoriesSuccessPayload = {
      productCategoriesSelection: response.data.result,
    };

    yield put({
      type: getSelectionProductCategoriesSuccess.type,
      payload,
    });
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getSelectionRolesSaga(): unknown {
  try {
    const response = yield call(roleApi.getSelection);
    const payload: GetSelectionRolesSuccessPayload = {
      rolesSelection: response.data.result,
    };

    yield put({
      type: getSelectionRolesSuccess.type,
      payload,
    });
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* mySaga() {
  yield takeLatest(
    getSelectionProductCategories.type,
    getSelectionProductCategoriesSaga
  );
  yield takeLatest(getSelectionRoles.type, getSelectionRolesSaga);
}

export default mySaga;
