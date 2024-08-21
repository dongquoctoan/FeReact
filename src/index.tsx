import "antd/dist/antd.less";
import "styles/global.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "pages/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "configs/configureStore";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, message } from "antd";
import viVN from "antd/lib/locale/vi_VN";
import moment from "moment";
import "moment/locale/vi";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

message.config({
  maxCount: 3,
});

root.render(
  <React.StrictMode>
    <ConfigProvider locale={viVN}>
      <Provider store={store}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <App />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
