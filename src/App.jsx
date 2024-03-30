import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Link,
  NavLink,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/Login';
import ContactPage from './pages/Contact';
import BookPage from './pages/Books';
import HeaderDefault from './components/Header';
import FooterDefault from './components/Footer';
import Home from './pages/Home';
import RegisterPage from './pages/Register';
import { callFetchAccount, callLogout } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction, doLogoutAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import NotFound404Page from './pages/NotFound404';
import AdminPage from './pages/Admin';
import ProtectedRoutes from './components/ProtectedRoutes';
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd';
import { AppstoreAddOutlined, BorderOutlined, DashboardOutlined, FileOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SlidersOutlined, UnorderedListOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import User_CRUD from './pages/User_CRUD';
import Book_CRUD from './pages/Book_CRUD';
import Order from './pages/Order';
import History from './pages/History';
import Profile from './components/Profile';
import Order_CRUD from './pages/Order_CRUD';
import { useParams } from 'react-router-dom';
const { Header, Footer, Sider, Content } = Layout;

const LayoutDefault = () => {
  return (
    <>
      <div className='layout-app'>
        <div>
          <HeaderDefault />
        </div>
      </div>
      <div className='main'>
        <Outlet />
      </div>
      <div>
        <FooterDefault />
      </div>
    </>
  )
}



const LayoutAdmin = () => {
  const user = useSelector(state => state.account.user)
  const [currentKeyPage, setCurrentKeyPage] = useState("/")
  const userFullName = user.fullName
  console.log(user.fullName)
  console.log(user)
  const [collapsed, setCollapsed] = useState(false);
  const isAdminRoute = window.location.pathname.startsWith("/admin")
  const userRole = user.role;
  const dispatch = useDispatch()

  const handleLogout = async () => {

    const res = await callLogout();

    if (res) {
      dispatch(doLogoutAction())
      message.success("Logout successfully!")
      navi("/")
    }
  }
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const handleOpenProfileModal = () => {
    setOpenProfileModal(true)
  }
  const items = [
    {
      label: <Link to={"/"} style={{ cursor: "pointer" }}>
        Home page</Link>,
      key: 'homePage',
    },
    {
      label: <div
        onClick={handleOpenProfileModal}

        style={{ cursor: "pointer" }}
      >Profile</div>,
      key: 'profile',
    },
    {
      label: <Link to={"/history"}
        style={{ cursor: "pointer" }}>
        Orders</Link>,
      key: 'orders',
    },
    {
      label: <label style={{ cursor: "pointer" }}
        onClick={() => handleLogout()}>Logout</label>,
      key: 'logout2',
    }
  ]
  const menuProps = {
    items,
  }
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
  return (
    <>
      {isAdminRoute && userRole === "ADMIN" ? (
        <>
          <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}
              style={{
                backgroundColor: "#fff"
              }}>
              {/* <div className='admin__logo'>E-Books</div> */}
              {!collapsed ? (<div style={{ height: "60px" }}>
                <Link className={"admin__logo"} to={"/admin"}>Admin</Link>
              </div>) : (
                <>
                  <div className={"admin__logo"} style={{ height: "60px", width: "60px", paddingLeft: "20px" }}>

                  </div>
                </>
              )}

              <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                // selectedKeys={[location.pathname]}
                items={[
                  {
                    key: '/admin',
                    icon: <HomeOutlined />,
                    label: <NavLink to={"/admin"}>Dash board</NavLink>,
                  },
                  {
                    key: '/admin/user',
                    icon: <UserOutlined />,
                    label: 'Manage users',
                    children: [
                      {
                        key: '2-1',
                        icon: <AppstoreAddOutlined />,
                        label: <NavLink to={"/admin/user"}>CRUD</NavLink>,
                      },
                      // {
                      //   key: '2-2',
                      //   icon: <BorderOutlined />,
                      //   label: 'unFunctional',
                      // },
                    ]

                  },
                  {
                    key: '/admin/book',
                    icon: <FileOutlined />,
                    label: <NavLink to={"/admin/book"}>Manage books</NavLink>,
                  },
                  {
                    key: '/admin/orders',
                    icon: <UnorderedListOutlined />,
                    label: <NavLink to={"/admin/orders"}>Manage orders</NavLink>,
                  },
                ]}
              />
            </Sider>
            <Layout>
              <Header
                style={{
                  padding: 0,
                  backgroundColor: "#fff",
                }}
              >
                <div className='df jcsb'>
                  <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined style={{ scale: "1.2" }} /> : <MenuFoldOutlined style={{ scale: "1.2" }} />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: '16px',
                      width: 64,
                      height: 64,
                    }}
                  />

                  <div className="admin__header__info">

                    <Dropdown className='aic' menu={menuProps} placement="bottomRight">
                      {userFullName ?
                        (<Button>
                          <Avatar src={urlAvatar}></Avatar>
                          {userFullName}
                          {/* <UserOutlined className="admin__header__info__icon" /> */}
                        </Button>)
                        : (<Button><UserOutlined className="admin__header__info__icon" /></Button>)}

                    </Dropdown>
                  </div>
                </div>

              </Header>
              <Content className='admin__main pb-30'>
                <Profile openProfileModal={openProfileModal}
                  setOpenProfileModal={setOpenProfileModal}
                />
                <Outlet />
              </Content>

            </Layout>
          </Layout>
          <FooterDefault />
        </>

      ) : (
        <>
          <main className='main'>
            <Outlet />
          </main>
        </>
      )}

    </>
  )
}

export function App() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  const isLoading = useSelector(state => state.account.isLoading)
  console.log(isAuthenticated)
  const getAccount = async () => {

    if (
      window.location.pathname === "/login"
      || window.location.pathname === "/register"
    ) {
      return;
    }
    else {

      const res = await callFetchAccount();
      if (res && res.data) {
        // console.log(res)
        dispatch(doGetAccountAction(res.data))
      }
    }

  }

  useEffect(() => {
    getAccount()
    const pathName = window.location.pathname
    console.log(pathName)

  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutDefault />,
      errorElement: <NotFound404Page />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "contacts",
          element: <ContactPage />
        },
        {
          path: "book/:slug",
          element: <BookPage />
        },
        {
          path: "order",
          element:
            <Order />
        },
        {
          path: "history",
          element:
            <History />
        },
      ]
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound404Page />,
      children: [
        {
          index: true,
          element:
            <ProtectedRoutes>
              <AdminPage />
            </ProtectedRoutes>,
        },
        {
          path: "user",
          element:
            <ProtectedRoutes>
              <User_CRUD />
            </ProtectedRoutes>,
        },
        {
          path: "book",
          element:
            <ProtectedRoutes>
              <Book_CRUD />
            </ProtectedRoutes>,
        },
        {
          path: "orders",
          element:
            <ProtectedRoutes>
              <Order_CRUD />
            </ProtectedRoutes>,
        },


      ]
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />
    }
  ]);

  return (
    <>
      {isLoading === false
        || window.location.pathname === "/login"
        || window.location.pathname === "/register"
        || window.location.pathname === "/"
        // || (isLoading === true && isAuthenticated === false && window.location.pathname === "/admin")
        ? (
          <RouterProvider router={router} />
        ) : (
          // <Loading />
          <RouterProvider router={router} />
        )}
    </>
  )
}
