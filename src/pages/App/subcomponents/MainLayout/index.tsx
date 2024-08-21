import { RootState } from "configs/configureStore";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { LOGIN } from "routes/route.constant";
import Header from "pages/App/subcomponents/MainLayout/subcomponents/Header";
import SideBar from "pages/App/subcomponents/MainLayout/subcomponents/SideBar";
import authApi from "apis/auth";
import {
  getSelectionProductCategories,
  getSelectionRoles,
  login,
  logout,
} from "pages/App/store/appSlice";
import styles from "pages/App/subcomponents/MainLayout/style.module.css";

const MainLayout: FC = () => {
  const { isLogged } = useSelector((state: RootState) => state.appSlice);
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);

  const dispatch = useDispatch();

  useEffect(() => {
    // handleCheckToken();
    dispatch(getSelectionProductCategories());
    dispatch(getSelectionRoles());
  }, []);

  const handleCheckToken = async () => {
    try {
      await authApi.checkToken();
      dispatch(login());
      setIsCheckingToken(false);
    } catch (error) {
      dispatch(logout());
      setIsCheckingToken(false);
    }
  };

  // if (isCheckingToken) {
  //   return null;
  // }

  // if (!isLogged) {
  //   return <Navigate to={LOGIN} replace />;
  // }

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.body}>
        <SideBar />
        <div className={styles.content}>
          <Outlet />
          <div className={styles.copyright}>
            <span>© 2023 Developed by Brothers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
