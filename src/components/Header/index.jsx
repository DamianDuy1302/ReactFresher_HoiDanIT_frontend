import { Avatar, Badge, Button, Drawer, Dropdown, Input, Popover, Space, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import { Form, Link, useNavigate } from "react-router-dom";
import { DownOutlined, LogoutOutlined, MenuOutlined, ProfileOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons"
import "../../styles/styles.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
import "./styles.css"
import Profile from "../Profile";
const HeaderDefault = () => {
    const user = useSelector(state => state.account.user)
    const userFullName = user.fullName
    const role = user.role
    console.log(user)
    console.log(role)
    const dispatch = useDispatch()
    const navi = useNavigate()
    const [show, setShow] = useState(true);
    const [openProfileModal, setOpenProfileModal] = useState(false)
    const handleSubmit = () => {

    }
    const carts = useSelector(state => state.order.carts)
    console.log(carts)
    const handleLogout = async () => {
        const res = await callLogout();
        if (res) {

            dispatch(doLogoutAction())
            message.success("Logout successfully!")
            navi("/")
        }

    }
    const handleLogin = () => {
        navi("/login")
    }

    window.addEventListener("resize", (e) => {
        if (e.target.innerWidth >= 767.98) {
            setOpen(false)
        }
    })
    const handleOpenProfileModal = () => {
        setOpenProfileModal(true)
    }
    var items = [
        {
            label: <div
                onClick={handleOpenProfileModal}

                style={{ cursor: "pointer" }}
            >Profile</div>,
            key: 'profile',
        },
        {
            label: <div onClick={() => { navi("/history") }}
                style={{ cursor: "pointer" }}
            >Orders</div>,
            key: 'orders',
        },
        {
            label: <div style={{ cursor: "pointer" }}
                onClick={() => handleLogout()}>Logout</div>,
            key: 'logout',
        }
    ]


    const items2 = [
        {
            label: <Link style={{ cursor: "pointer" }}
                to={"/login"}>Login</Link>,
            key: 'login',
        }
    ]
    const items3 = [
        {
            label: <Link to={"/admin"} style={{ cursor: "pointer" }}
            >Manage page</Link>,
            key: 'managePage',
        },
        {
            label: <div
                onClick={handleOpenProfileModal}

                style={{ cursor: "pointer" }}
            >Profile</div>,
            key: 'profile',
        },
        {
            label: <div onClick={() => { navi("/history") }}
                style={{ cursor: "pointer" }}
            >Orders</div>,
            key: 'orders',
        },
        {
            label: <div style={{ cursor: "pointer" }}
                onClick={() => handleLogout()}>Logout</div>,
            key: 'logout',
        }
    ]
    if (userFullName === "") {
        items = items2
    }
    if (userFullName !== "" && role === "ADMIN") {
        items = items3
    }
    const menuProps = {
        items
    }

    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('left');
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleLoadProductList = () => {
        return (<>

            <div className="cart-preview">
                <div className="cart-preview_content">

                    {carts?.map((item, index) => {
                        return (
                            <div key={`book-${index}`} className="book">
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail.thumbnail}`}></img>
                                <div className="book-name">{item?.detail?.mainText}</div>
                                <div className="book-price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(item?.detail?.price)}
                                </div>
                            </div>
                        )

                    })}

                </div>
                <div className="cart-preview_footer">
                    <button onClick={() => {
                        navi("/order")
                    }}>Go to cart</button>
                </div>
            </div>
        </>)
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;
    return (
        <>
            <div className="header">
                <div className="header__left">
                    <div className="header__logo">
                        <Link to={"/"}>E-Books</Link>
                    </div>
                </div>


                <div className="header__right">
                    <div className="df f1 aic">
                        <div className="header__search f1 minWidth787show">
                            <form onSubmit={handleSubmit}>
                                <input placeholder="Key word..."></input>
                                <button type="submit"><SearchOutlined /></button>
                            </form>
                        </div>
                        <div className="header__cart">
                            <Popover
                                placement="bottomRight" title={"Product list"} content={handleLoadProductList} arrow={true}>
                                <Badge onClick={() => { navi("/order") }} size="small" count={carts?.length ?? 0} overflowCount={10}>
                                    < ShoppingCartOutlined style={{ fontSize: '26px', color: '#005b96', cursor: "pointer" }} />
                                </Badge>
                            </Popover>

                        </div>

                    </div>

                    {(userFullName !== "") ? (
                        <>
                            <div className="header__info">
                                <Dropdown menu={menuProps} placement="bottomRight">
                                    {userFullName ?
                                        (<Button>
                                            <Avatar className="avatar" src={urlAvatar}></Avatar>
                                            {userFullName}
                                            {/* <UserOutlined className="header__info__icon" /> */}
                                        </Button>
                                        )
                                        : (<UserOutlined className="header__info__icon" />)}

                                </Dropdown>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="header__info">
                                <Dropdown menu={menuProps} placement="bottomRight">
                                    <UserOutlined className="header__info__icon" />
                                </Dropdown>
                            </div>
                        </>
                    )}

                    <div className="header__buttonDrawer">
                        <Button onClick={showDrawer}>
                            <MenuOutlined />
                        </Button>
                    </div>
                    <div>
                        <Drawer
                            title={`${userFullName}`}
                            placement={placement}
                            closable={false}
                            onClose={onClose}
                            open={open}
                            key={placement}
                            className="drawer"
                        >
                            {userFullName === "" ?
                                (<>
                                    <div className="drawer__title h-60 df aic">
                                        <div><Link to={"/login"}>Login</Link></div>
                                        <div><Link to={"/register"}>Register</Link></div>
                                    </div>
                                </>) : (<></>)}
                            {role === "ADMIN" ? (
                                <>

                                    <div>
                                        <Link to={"/admin"} style={{ cursor: "pointer" }}
                                        >Manage page</Link>
                                    </div>

                                    <div style={{ cursor: "pointer" }}
                                    >Profile</div>
                                    <div style={{ cursor: "pointer" }}
                                        onClick={() => handleLogout()}>Logout</div>

                                </>
                            ) : (
                                <>
                                    <div className="header__search f1 maxWidth787show">
                                        <form onSubmit={handleSubmit}>
                                            <input placeholder="Key word..."></input>
                                            <button type="submit"><SearchOutlined /></button>
                                        </form>
                                    </div>

                                    <Link >
                                        <div className="header__drawer__content aic df jcsb">
                                            <div>Cart</div>
                                            <Badge count={show ? 25 : 0} overflowCount={10} />
                                        </div>
                                    </Link>
                                    <Link >
                                        <div className="header__drawer__content aic df jcsb">
                                            <div>Cart</div>
                                        </div>
                                    </Link>
                                    <Link >
                                        <div className="header__drawer__content aic df jcsb">
                                            <div>Cart</div>

                                        </div>
                                    </Link>
                                </>
                            )}


                        </Drawer>
                    </div>
                </div>




            </div >
            <Profile openProfileModal={openProfileModal}
                setOpenProfileModal={setOpenProfileModal}
            />
        </>
    )
}
export default HeaderDefault;