import "./styles.css"
import { DeleteOutlined, LoadingOutlined, SmileOutlined } from "@ant-design/icons"
import { Button, Col, Divider, Empty, Form, Input, InputNumber, Radio, Result, Row, Steps, message, notification } from "antd"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doDeleteCartAction, doPlaceOrderAction, doUpdateCartAction } from "../../redux/order/orderSlice";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom"
import { callPlaceOrder } from "../../services/api";
import Link from "antd/es/typography/Link";
const Order = () => {
    const carts = useSelector(state => state.order.carts)
    const user = useSelector(state => state.account.user)
    const navi = useNavigate()
    console.log(user)
    console.log(carts)
    const [tmpPrice, setTmpPrice] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    // const [disabled, setDisabled] = useState(true)
    const dispatch = useDispatch()
    useEffect(() => {
        let tmp1 = 0
        let tmp2 = 0
        carts.map(item => {
            tmp1 += item?.detail?.price * item?.quantity
            tmp2 += item?.detail?.price * item?.quantity
        })
        // if (carts.length === 0) {
        //     setCurrentStep(0)
        // }

        setTmpPrice(tmp1)
        setTotalPrice(tmp2)
    }, [carts])

    const handleChangeQuantity = (value, item) => {
        console.log(value)
        console.log(item)
        if (value < 1) return

        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: parseInt(value), _id: item?._id, detail: item }))
        }
    }
    const handleDeleteCart = (id) => {
        console.log(id)
        dispatch(doDeleteCartAction({ _id: id }))
    }
    const backStep = () => {

        setCurrentStep(currentStep - 1)


    }

    const handleSubmit = async (e) => {
        setIsLoading(true)
        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id
            }
        })
        const data = {
            name: e.fullName,
            address: e.address,
            phone: e.phone,
            totalPrice: totalPrice,
            detail: detailOrder,
        }

        setTimeout(async () => {
            const res = await callPlaceOrder(data)
            if (res && res.data) {
                message.success("Order successfully!")
                dispatch(doPlaceOrderAction())
                setCurrentStep(3)
            }
            else {
                notification.error({
                    message: "Something went wrong!",
                    description: res.message
                })
            }
            setIsLoading(false)
        }, 1500)


    }
    const handleSubmit1 = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setCurrentStep(2)
        }, 1500)

    }
    return (
        <>

            <div className="order-page">
                <Row>
                    <Col span={24}>
                        <Steps
                            style={{ backgroundColor: "#fff", padding: "10px", marginBottom: "16px" }}
                            size="small"
                            current={currentStep}
                            items={[
                                {
                                    title: 'Order',
                                },
                                {
                                    title: 'Payment',
                                },
                                {
                                    title: 'Confirmed',
                                },
                            ]}
                        />
                    </Col>
                </Row>
                {(currentStep !== 3) ? (<>
                    <Row gutter={20} className="">

                        <>

                        </>
                        {currentStep == 1 ? (<>

                            {carts.length > 0 ? (<Col md={18} sm={24} xs={24} className="order-list">
                                {carts.map((item, index) => {
                                    return (
                                        <Row gutter={6}
                                            key={`book-${index}`}
                                            className="book">
                                            <Col span={4}>
                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail.thumbnail}`}></img>

                                            </Col>

                                            <Col span={8} className="book-name">
                                                {item?.detail?.mainText}

                                            </Col>
                                            <Col span={10} className="book-price">
                                                <div>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(item?.detail?.price)}

                                                    <div className="book-quantity">

                                                        {/* <span>Quantity</span> */}
                                                        <InputNumber
                                                            // disabled={isLoading}
                                                            onChange={(value) => {
                                                                handleChangeQuantity(value, item)

                                                            }}
                                                            defaultValue={item.quantity}
                                                            max={item?.detail?.quantity}
                                                            min={1}


                                                        ></InputNumber>
                                                    </div>

                                                </div>


                                                <div className="book-price-total">Total: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(item?.detail?.price * item?.quantity)}</span></div>

                                            </Col>
                                            <Col span={2} className="book-delete">
                                                <DeleteOutlined
                                                    onClick={() => { handleDeleteCart(item._id) }}
                                                    className="book-delete-button"
                                                />
                                            </Col>

                                        </Row>
                                    )
                                })}
                            </Col>)
                                :
                                (<Col md={18} sm={24} xs={24}> <Empty description={"Cart is empty..."} style={{ backgroundColor: "#fff", minHeight: "60vh", paddingTop: "60px" }}></Empty></Col>)}

                            <Col md={6} sm={24} xs={24} className="order-payment-section">
                                <div className="order-payment">
                                    <div className="order-payment-content">Temporary: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(tmpPrice)}</span></div>
                                    <Divider></Divider>
                                    <div className="order-payment-content">Total: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(totalPrice)}</span></div>
                                    <Divider></Divider>
                                    <div>
                                        <button onClick={handleSubmit1}
                                            className="order-payment-button"
                                            disabled={carts.length > 0 ? false : true}


                                        >
                                            Buy ({carts.length ? (carts.length) : 0})
                                            {isLoading && <span style={{ marginLeft: "5px" }}><LoadingOutlined /> &nbsp;</span>}
                                        </button>
                                    </div>

                                </div>
                            </Col>
                        </>) : (
                            <>
                                {currentStep === 2 ? (<>

                                    {carts.length > 0 ?
                                        (<Col md={18} sm={24} xs={24} className="order-list">
                                            {carts.map((item, index) => {
                                                return (
                                                    <Row gutter={6}
                                                        key={`book-${index}`}
                                                        className="book">
                                                        <Col span={4}>
                                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail.thumbnail}`}></img>

                                                        </Col>

                                                        <Col span={8} className="book-name">
                                                            {item?.detail?.mainText}

                                                        </Col>
                                                        <Col span={10} className="book-price">
                                                            <div>
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(item?.detail?.price)}

                                                                <div className="book-quantity">

                                                                    {/* <span>Quantity</span> */}
                                                                    <InputNumber
                                                                        // disabled={isLoading}
                                                                        onChange={(value) => {
                                                                            handleChangeQuantity(value, item)

                                                                        }}
                                                                        defaultValue={item.quantity}
                                                                        max={item?.detail?.quantity}
                                                                        min={1}
                                                                        disabled


                                                                    ></InputNumber>
                                                                </div>

                                                            </div>


                                                            <div className="book-price-total">Total: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(item?.detail?.price * item?.quantity)}</span></div>

                                                        </Col>
                                                        <Col span={2} className="book-delete">
                                                            {/* <DeleteOutlined
                                                               
                                                                onClick={() => { handleDeleteCart(item._id) }}
                                                                className="book-delete-button"
                                                            /> */}
                                                        </Col>

                                                    </Row>
                                                )
                                            })}
                                        </Col>)
                                        :
                                        (<Col md={18} sm={24} xs={24}><Empty description={"Cart is empty..."} style={{ backgroundColor: "#fff", minHeight: "60vh", paddingTop: "60px" }}></Empty></Col>)}

                                    <Col md={6} sm={24} xs={24} className="order-payment-section">
                                        <div className="order-payment">
                                            <Form layout="vertical" onFinish={handleSubmit}>
                                                <FormItem
                                                    initialValue={user?.fullName ?? ""}
                                                    label="Full name" name={"fullName"}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please insert your full name!"
                                                        }
                                                    ]}

                                                >
                                                    <Input ></Input>
                                                </FormItem>
                                                <FormItem label="Phone" name={"phone"}
                                                    initialValue={user?.phone ?? ""}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please insert your phone!"
                                                        }
                                                    ]}
                                                >
                                                    <Input></Input>
                                                </FormItem>
                                                <FormItem label="Address" name={"address"}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please insert your address!"
                                                        }
                                                    ]}
                                                >
                                                    <TextArea rows={6}></TextArea>
                                                </FormItem>
                                                <FormItem name={"paymentType"} label="Payment type">
                                                    <Radio.Group defaultValue={"cod"}>
                                                        <Radio value={"cod"}>COD</Radio>

                                                    </Radio.Group>
                                                </FormItem>
                                                <div>

                                                    <Button
                                                        htmlType="submit"
                                                        className="order-payment-button"
                                                        disabled={isLoading}

                                                    >Buy ({carts.length ? (carts.length) : 0})
                                                        {isLoading && <span style={{ marginLeft: "5px" }}><LoadingOutlined /> &nbsp;</span>}
                                                    </Button>
                                                    <Button
                                                        onClick={backStep}
                                                        style={{ backgroundColor: "#1677ff", width: "100%", height: "45px", color: "#fff", fontWeight: 600, marginTop: "12px" }}
                                                        disabled={isLoading}

                                                    >Back

                                                    </Button>

                                                </div>
                                            </Form>


                                        </div>
                                    </Col></>) : (<>

                                    </>)

                                }
                            </>

                        )}

                    </Row>
                </>) : (<>

                    <Result
                        icon={<SmileOutlined />}
                        title="Your order is being prepared!"
                        extra={
                            <Button
                                onClick={() => { navi("/history") }}
                                type="primary">
                                Orders history
                            </Button>}
                    />
                </>)

                }



            </div>


        </>
    )
}
export default Order