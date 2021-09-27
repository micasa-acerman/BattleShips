import { Layout } from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import GameManager from "./components/GameManager";
import "./App.css";
import Store from "./store/store";

const store = new Store();
function App() {
  return (
    <Layout className="layout">
      <Header>
        <Title level={4} className="title">
          Морской бой
        </Title>
      </Header>
      <Content className="site-layout-content">
        <GameManager store={store} />
      </Content>
      <Footer className="site-footer">
        Battle Of Ships ©2021 Created by Mrikaev K
      </Footer>
    </Layout>
  );
}

export default App;
