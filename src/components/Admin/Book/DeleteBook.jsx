import { Button, Popconfirm, Popover, message, notification } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
// import "./DeletePopOver.css"
import { useState } from "react"
import { deleteBook, deleteUser } from "../../../services/api"
const DeleteBook = (props) => {
    const { fetchBooks, id } = props
    const [open, setOpen] = useState(false)
    const handleDelete = async () => {
        const res = await deleteBook(id)
        if (res) {
            message.success("Delete successfully!")
            await fetchBooks()
        }
        else {
            message.error("Somethings went wrong!")
        }
        // await fetchBooks()
    }
    const showConfirm = () => {
        setOpen(true)
    }
    const handleCancel = () => {
        setOpen(false)
    }
    const text = <span>Delete book</span>;

    return (
        <>
            <Popconfirm
                placement="leftTop"
                title={text}
                description={"Are you sure delete this book?"}
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

export default DeleteBook