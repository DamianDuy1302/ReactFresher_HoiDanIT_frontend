import { Button, Divider, Form, Input, Modal, Table, message, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import "./UserViewDetail.css"
import { useEffect } from "react"
import { updateUser } from "../../../services/api"
const UpdateUserTable = (props) => {
    const { isOpenUpdateUser, setIsOpenUpdateUser, dataUpdate, setDataUpdate, fetchUsers } = props
    console.log(dataUpdate)
    const handleCancel = () => {
        setIsOpenUpdateUser(false)
        form1.resetFields()
    }
    const [form1] = Form.useForm()
    const onSubmit = async (e) => {
        console.log(e)
        const { fullName, email, phone } = e
        const res = await updateUser(dataUpdate._id, fullName, phone)
        if (res && res.data) {
            message.success("Updated successfully")
            setIsOpenUpdateUser(false)
            await fetchUsers()
        }
        else {
            notification.error({
                message: "Something went worng!",
                description: res.message
            })
        }

        fetchUsers()
    }
    useEffect(() => {
        form1.setFieldsValue(dataUpdate)
    }, [dataUpdate])
    return (
        <>
            <Modal
                maskClosable={false}
                title="Update user" open={isOpenUpdateUser}
                onCancel={handleCancel}
                footer={null}

            >
                <Divider></Divider>
                <Form
                    name="updateForm"
                    form={form1}
                    // initialValues={dataUpdate}
                    labelCol={{ span: 6 }}
                    onFinish={onSubmit}
                >
                    <FormItem
                        name={"fullName"}
                        label={"User name"}
                        rules={[
                            {
                                required: true,
                                message: "Please input your user name!"
                            }
                        ]}
                    >
                        <Input></Input>
                    </FormItem>
                    <FormItem

                        name={"email"}
                        label={"Email"}
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!"
                            }
                        ]}>
                        <Input disabled></Input>
                    </FormItem>
                    <FormItem
                        name={"phone"}
                        label={"Phone"}
                        rules={[
                            {
                                required: true,
                                message: "Please input your phone!"
                            }
                        ]}>
                        <Input></Input>
                    </FormItem>


                    <div className="user_crud-form__buttons">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button htmlType="submit" type="primary">Update</Button>
                    </div>
                </Form>
            </Modal>

        </>
    )
}
export default UpdateUserTable