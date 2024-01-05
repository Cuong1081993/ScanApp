import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import axios from "axios";
import { Menu, Layout, Button } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  HomeOutlined,
  AndroidOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { public_api } from "./env";

import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";
import {
  getToken,
  getUser,
  removeUserSession,
  setUserSession,
} from "./utils/common";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Setting/Profile";
import App1 from "./pages/Config/index.js";
import NotFound from "./pages/NotFound";
import App2 from "./pages/App2";
import ChangePassword from "./pages/Setting/ChangePassword";
import ErrorPage from "./pages/ErrMobile.js";
import Config from "./pages/Config/index.js";
import NhapHang from "./pages/NhapHang/index.js";
import XuatHang from "./pages/XuatHang/index.js";
import KiemTra from "./pages/KiemTra/index.js";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [showMenu, setShowMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!token || !user) {
      return;
    }
    axios
      .post(`${public_api}/auth/verifyToken`, { id: user._id, token: token })
      .then((response) => {
        // setUserSession(response.data.token, response.data.user);
        setAuthLoading(false);
        if (!response.data.success) {
          removeUserSession();
        }
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(false);
      });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }

  const handleLogout = () => {
    removeUserSession();
    window.location.replace("/login");
    // history('/Login');
  };

  return windowWidth <= 768 ? (
    <ErrorPage />
  ) : (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        {token && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <h2 style={{ color: "white", paddingLeft: "37px" }}>{user.role}</h2>
            <Menu mode="inline" theme="dark">
              {user.role === "Admin" && (
                <Menu.Item icon={<HomeOutlined />} key="dashboardMain">
                  <NavLink to="/dashboard"> Dashboard</NavLink>
                </Menu.Item>
              )}

              {user.role === "User" && (
                <Menu.SubMenu icon={<AndroidOutlined />} title="App1">
                  <Menu.Item key="config">
                    <NavLink to="/app1/config">Config</NavLink>
                  </Menu.Item>
                  <Menu.Item key="nhap-hang">
                    <NavLink to="/app1/nhaphang">Nhap Hang</NavLink>
                  </Menu.Item>
                  <Menu.Item key="xuat-hang">
                    <NavLink to="/app1/xuathang">Xuat Hang</NavLink>
                  </Menu.Item>
                  <Menu.Item key="kiem-tra">
                    <NavLink to="/app1/kiemtra">Kiem Tra</NavLink>
                  </Menu.Item>
                </Menu.SubMenu>
              )}

              {user.role === "User" && (
                <Menu.Item icon={<AndroidOutlined />} key="app2">
                  <NavLink to="/app2"> App 2</NavLink>
                </Menu.Item>
              )}
              {user.role === "User" && (
                <Menu.Item icon={<AndroidOutlined />} key="app3">
                  <NavLink to="/app2"> App 3</NavLink>
                </Menu.Item>
              )}
              <Menu.SubMenu icon={<SettingOutlined />} title="Setting">
                <Menu.Item key="profile">
                  <NavLink to="/setting/profile">Profile</NavLink>
                </Menu.Item>
                <Menu.Item key="change-password">
                  <NavLink to="/setting/change-password">
                    Change Password
                  </NavLink>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Sider>
        )}

        <Layout className="site-layout">
          {/* Header */}
          {token && (
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <div className="header-content">
                <h2 style={{ color: "white" }}>{/*Your App Name*/}</h2>
                <div className="user-info">
                  <span style={{ color: "white" }}>Welcome {user.name} !</span>
                  <Button
                    type="link"
                    onClick={handleLogout}
                    style={{ color: "white" }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </Header>
          )}

          {/* Content */}
          <Content>
            <Routes>
              <Route path="*" element={<Login />} />
              <Route element={<PublicRoutes />}>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route element={<PrivateRoutes />}>
                <Route index path="/dashboard" element={<Dashboard />} />
                <Route path="/setting/profile" element={<Profile />} />
                <Route
                  path="/setting/change-password"
                  element={<ChangePassword />}
                />
                <Route path="/app1" element={<App1 />} />
                <Route path="/app1/nhaphang" element={<NhapHang />} />
                <Route path="/app1/xuathang" element={<XuatHang />} />
                <Route path="/app1/kiemtra" element={<KiemTra />} />
                <Route path="/app1/config" element={<Config />} />
                <Route path="/app2" element={<App2 />} />
              </Route>
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
