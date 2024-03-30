import { LoadingOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import { useState } from "react"
import { updatePassword } from "../../services/api"

const ProfileTab2 = (props) => {
    const { user, openProfileModal, setOpenProfileModal } = props
    const [form] = Form.useForm()
    const [isLoading, setIsLoaing] = useState(false)
    const onSubmit = async (e) => {
        console.log(e)
        setIsLoaing(true)
        const res = await updatePassword(e.email, e.oldPassword, e.newPassword)
        if (res && res.data) {
            message.success("Update password successfully!")
            form.setFieldValue("oldPassword", "")
            form.setFieldValue("newPassword", "")
        }
        else {
            notification.error({
                message: "Something went wrong...",
                description: res.message
            })
        }
        setIsLoaing(false)
    }
    const handleCancel = () => {
        form.resetFields()
    }

    return (
        <>
            <Form form={form}
                onFinish={onSubmit}
                layout="vertical"
            >
                <FormItem label={"Email"}
                    name={"email"}
                    initialValue={user.email}

                >
                    <Input disabled></Input>
                </FormItem>
                <FormItem label={"Old password"}
                    name={"oldPassword"}
                    rules={[{
                        required: true,
                        message: "Please fill in your full name!"
                    },]}
                >
                    <Input.Password>
                    </Input.Password>
                </FormItem>
                <FormItem label={"New password"}
                    name={"newPassword"}
                    rules={[{
                        required: true,
                        message: "Please fill in your full name!"
                    },]}
                >
                    <Input.Password>
                    </Input.Password>
                </FormItem>
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleCancel}>Clear</Button>
                    <Button htmlType="submit" style={{ marginLeft: "8px" }} type="primary">Update {isLoading ? <LoadingOutlined /> : <></>}</Button>
                </div>
            </Form>
        </>
    )
}
export default ProfileTab2