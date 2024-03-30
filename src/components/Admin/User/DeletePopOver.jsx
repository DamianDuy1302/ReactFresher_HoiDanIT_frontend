import { Button, Popconfirm, Popover, message, notification } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import "./DeletePopOver.css"
import { useState } from "react"
import { deleteUser } from "../../../services/api"
const DeletePopOver = (props) => {
    const { fetchUsers, id } = props
    const [open, setOpen] = useState(false)
    const handleDelete = async () => {
        const res = await deleteUser(id)
        if (res) {
            message.success("Delete successfully!")
            await fetchUsers()
        }
        else {
            message.error("Somethings went wrong!")
        }
    }
    const showConfirm = () => {
        setOpen(true)
    }
    const handleCancel = () => {
        setOpen(false)
    }
    const text = <span>Delete user</span>;

    return (
        <>
            <Popconfirm
                placement="leftTop"
                title={text}
                description={"Are you sure delete this user?"}
                open={open}
                okText={"Yes"}
                onConfirm={handleDelete}
                onCancel={handleCancel}
            >
                <DeleteOutlined
                    className="red icon mr-10"
                    onClick={showConfirm}
                // onFocus={() => { setIsVisible(true) }} 
                />
            </Popconfirm>
        </>
    )
}

export default DeletePopOver