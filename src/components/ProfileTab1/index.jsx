import { LoadingOutlined, UploadOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Form, Input, Row, Upload, message, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import { useState } from "react"
import { updateUser, updateUserInfo, uploadAvatar } from "../../services/api"
import { useDispatch, useSelector } from "react-redux"
import { doUpdateUser } from "../../redux/account/accountSlice"

const ProfileTab1 = (props) => {
    const { user, openProfileModal, setOpenProfileModal } = props
    console.log(user)
    const [form] = Form.useForm()
    const [urlAvatar, setURLAvatar] = useState(user?.avatar ?? "");
    const [isLoading, setIsLoaing] = useState(false)
    const dispatch = useDispatch()
    const handleSubmit = async (e) => {
        setIsLoaing(true)
        const data = {
            ...e,
            avatar: urlAvatar,
            _id: user?.id,
        }
        console.log(data)
        const res = await updateUserInfo(data._id, data.phone, data.fullName, data.avatar)
        if (res && res.data) {
            console.log(res.data)
            dispatch(doUpdateUser({ avatar: data.avatar, phone: data.phone, fullName: data.fullName }))
            message.success("Update info successfully!")
            localStorage.removeItem("accessToken")
        }
        else {
            notification.error({
                message: "Someting went wrong...",
                description: res.message,
            })
        }
        setIsLoaing(false)

    }

    const handleCancel = () => {
        form.resetFields()
        setOpenProfileModal(false)
    }
    const handleUploadAvatar = async (file, onSuccess, onError) => {
        console.log(file)
        const res = await uploadAvatar(file)
        if (res && res.data) {
            console.log(res.data)
            const newAvatar = res.data.fileUploaded;
            dispatch(doUploadAvatarAction({ avatar: newAvatar }))
            setURLAvatar(newAvatar)
            onSuccess("ok")
        }
        else {
            onError("Something went wrong...")
        }
    }
    const propsUpload = {
        maxCount: 1,
        multiple: false,
        // showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            if (info.file.status !== "uploading") {

            }
            if (info.file.status === "done") {
                message.success("Upload successfully!")
            }
            else if (info.file.status === "error") {
                message.error("Something went wrong...")
            }
        }
    }

    return (
        <>
            <div>
                <Row gutter={[12, 12]}>
                    <Col md={10} sm={24} xs={24}>
                        <div style={{ textAlign: "center" }}>
                            <div>
                                <Avatar
                                    shape="circle"
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${urlAvatar}`}
                                    size={{ md: 80, sm: 64, xs: 32 }}

                                ></Avatar>
                            </div>

                            <div style={{ marginTop: "12px" }}>
                                <Upload
                                    disabled
                                    {...propsUpload}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </div>

                        </div>

                    </Col>
                    <Col md={14} sm={24} xs={24}>
                        <Form layout="vertical"
                            onFinish={handleSubmit}
                            form={form}
                        >
                            <FormItem
                                name={"email"}
                                initialValue={user.email}
                                label={"Email"}
                            >
                                <Input disabled></Input>
                            </FormItem>
                            <Form.Item
                                name={"fullName"}
                                rules={[{
                                    required: true,
                                    message: "Please fill in your full name!"
                                },]}
                                label={"Full name"}
                                initialValue={user.fullName}

                            >
                                <Input ></Input>
                            </Form.Item>
                            <FormItem
                                name={"phone"}
                                label={"Phone"}
                                rules={[{
                                    required: true,
                                    message: "Please fill in your phone!"
                                }]}
                                initialValue={user.phone}
                            >
                                <Input ></Input>
                            </FormItem>

                            <div style={{ display: "flex", justifyContent: "end" }}>
                                {/* <Button onClick={handleCancel}>Cancel</Button> */}
                                <Button htmlType="submit" style={{ marginLeft: "8px" }} type="primary">Update {isLoading ? <LoadingOutlined /> : <></>}</Button>
                            </div>

                        </Form>






                    </Col>
                </Row >
            </div >

        </>
    )
}
export default ProfileTab1