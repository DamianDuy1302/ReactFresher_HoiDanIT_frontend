import { Button, Divider, Form, Input, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import "../../styles/styles.css"
import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { callRegister } from "../../services/api"
const RegisterPage = () => {

    const [submitButtonStatus, setSubmitButtonStatus] = useState(false)
    const navi = useNavigate()

    const onSubmit = async (e) => {
        const {fullName, email, password, phone} = e;
        setSubmitButtonStatus(true)
        const res = await callRegister(fullName, email, password, phone)
        
        if(res?.data?._id){
            setTimeout(()=>{
                setSubmitButtonStatus(false)
                notification.success({
                    message: "All set",
                    description: "Your account has been registered!",
                    duration: 3
                })
                console.log("Success", e)
                navi("/login")
            }, 3000)
        }
        else{
            setSubmitButtonStatus(false)
            notification.error({
                message: "Somethings went wrong!",
                description: res.message && Array.isArray(res.message) ? res.message[0] : "",
                duration: 3
            })
        }
        
    }
    return (
        <>
            <div className="form">
                <Form
                    onFinish={onSubmit}
                    name="form__form"
                    className="form__form"
                    autoComplete="off"
                    labelCol={{ span: 24 }}
                >
                    <div className="form__title">Become our member</div>
                    <Divider/>
                    <FormItem
                        className="input-label"
                        label="Fullname"
                        name={"fullName"}
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input />
                    </FormItem>

                    <FormItem
                        className="input-label"
                        label="Email"
                        name={"email"}
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input />
                    </FormItem>

                    <FormItem
                        className="input-label"
                        label="Password"
                        name={"password"}
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password />
                    </FormItem>

                    <FormItem
                        className="input-label"
                        label="Phone"
                        name={"phone"}
                        rules={[{ required: true, message: "Please input your phone number!" }]}
                    >
                        <Input />
                    </FormItem>
                    <div className="form__button">
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            loading={submitButtonStatus}
                        >
                            Submit</Button>
                    </div>

                    <Divider>or</Divider>
                    <div className="tac">
                        Already have an account? <span><Link to={"/login"}>Login</Link></span>
                    </div>
                </Form>
            </div>

        </>
    )
}
export default RegisterPage