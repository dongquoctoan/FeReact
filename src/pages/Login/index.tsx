import React, { useState } from "react";
import { Alert, Button, Card, Checkbox, Form, Input } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import authApi from "apis/auth";
import { isValidEmail, isValidPhoneNumber } from "utils/validate";
import { LoginData } from "constants/types/auth.type";
import { useDispatch } from "react-redux";
import { login } from "pages/App/store/appSlice";
import { useNavigate } from "react-router-dom";
import { DEFAULT } from "routes/route.constant";
import styles from "pages/Login/Login.module.css";
import mainLogo from "assets/images/logo.png";

type FormLoginData = {
  accessValue: string;
  password: string;
};

const loginSchema = Yup.object().shape({
  accessValue: Yup.string().required(
    "Email/Số điện thoại/Tên đăng nhập không được để trống."
  ),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // self state
  const [loginError, setLoginError] = useState<string>("");

  const initFormLoginData: FormLoginData = {
    accessValue: "",
    password: "",
  };

  const formLogin = useFormik({
    initialValues: initFormLoginData,
    validationSchema: loginSchema,
    onSubmit: async (data) => {
      const loginData: LoginData = {
        password: data.password,
      };
      if (isValidEmail(data.accessValue)) {
        loginData.email = data.accessValue;
      } else if (isValidPhoneNumber(data.accessValue)) {
        loginData.phone = data.accessValue;
      } else {
        loginData.username = data.accessValue;
      }

      try {
        await authApi.login(loginData);
        dispatch(login());
        navigate(DEFAULT);
      } catch (error: any) {
        setLoginError(error.response.data.error.message);
      }
    },
  });

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.logo}>
          <img src={mainLogo} alt="logo" />
        </span>
        {/* <span className={styles.title}>Shop Music</span> */}
      </div>
      <div className={styles.description}>
        <span>
          Shop music là một cửa hàng chuyên cung cấp các loại đồ nhạc cụ cho
          người chơi nhạc.
        </span>
      </div>
      <div className={styles.form}>
        <Card>
          {loginError && (
            <Alert message={loginError} type="error" className={styles.error} />
          )}
          <Form onFinish={formLogin.handleSubmit}>
            <Form.Item
              validateStatus={
                formLogin.errors.accessValue && formLogin.touched.accessValue
                  ? "error"
                  : ""
              }
              help={
                formLogin.touched.accessValue && formLogin.errors.accessValue
              }
            >
              <Input
                placeholder="Email/Số điện thoại/Tên đăng nhập"
                name="accessValue"
                value={formLogin.values.accessValue}
                onChange={formLogin.handleChange}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Mật khẩu"
                type="password"
                name="password"
                value={formLogin.values.password}
                onChange={formLogin.handleChange}
              />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Button block type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form>
        </Card>
      </div>
      <div className={styles.copyright}>
        <span>© 2023 Developed by Brothers</span>
      </div>
    </section>
  );
};

export default Login;
