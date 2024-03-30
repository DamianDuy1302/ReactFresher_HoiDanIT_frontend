import { Button, Divider, Form, Input, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { callLogin } from "../../services/api"
import { useDispatch } from "react-redux"
import { doLoginAction } from "../../redux/account/accountSlice"

const LoginPage = () => {
    const[submitButtonStatus, setSubmitButtonStatus] = useState(false)
    const dispatch = useDispatch()
    const navi = useNavigate()

    const onSubmit = async (e) => {
        setSubmitButtonStatus(true)
        const {username, password} = e
        const res = await callLogin(username, password)

        if(res?.data?.access_token){
            setTimeout(() => {
                console.log(res)
                localStorage.setItem("access_token", res.data.access_token)
                dispatch(doLoginAction(res.data))
                setSubmitButtonStatus(false)
                // notification.success({
                //     message: "Login successfully!",
                //     description: (res?.data?.user?.fullName) ? `Welcome, ${res.data.user.fullName}` : "",
                //     duration: 3,
                // })
                navi("/")
            }, 3000);
            
        }
        else{
            setSubmitButtonStatus(false)
            notification.error({
                message: "Somethings went wrong!",
                description: res.message ? res.message : "",
                duration: 3
            })
        }
    }
    return (
        <>
            <div className="form">
                <Form
                    onFinish={onSubmit}
                    autoComplete="off"
                    name="form__form"
                    labelCol={{span: 24}}
                    className="form__form"
                >
                    <div className="form__title">Login</div>
                    <Divider/>

                    <FormItem 
                        name={"username"}
                        label={"Email"}
                        rules={[{required: true, message:"Please input your email!"}]}
                    >
                        <Input/>
                    </FormItem>
                    <FormItem 
                        name={"password"}
                        label={"Password"}
                        rules={[{required: true, message:"Please input your password!"}]}
                    >
                        <Input.Password/>
                    </FormItem>
                    <div className="form__button">
                        <Button type={"primary"} htmlType="submit"
                        loading={submitButtonStatus}
                        >Login</Button>
                    </div>

                    <Divider>or</Divider>
                    <div className="tac">
                        Don't have any account? <span><Link to={"/register"}>Register</Link></span>
                    </div>
                </Form>
            </div>

        </>
    )
}
export default LoginPage