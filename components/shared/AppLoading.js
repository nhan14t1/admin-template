import { Spin } from "antd";

const AppLoading = ({ loading }) => {
  return <Spin spinning={loading} fullscreen />;
}

export default AppLoading;