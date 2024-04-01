import { Button, Divider, Form, Input, Modal, Table, message, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import "./styles.css"
import { useEffect, useState } from "react"
import { addUser, getUsers } from "../../services/api"
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons"
import UserViewDetail from "../../components/Admin/User/UserViewDetail"
import UserImport from "../../components/Admin/User/UserImport"
import moment from "moment"
import * as XLSX from "xlsx"
import UpdateUserTable from "../../components/Admin/User/UpdateUserTable"
import DeletePopOver from "../../components/Admin/User/DeletePopOver"
const User_CRUD = () => {

    const [tmp, setTmp] = useState(1)
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [userList, setUserList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("")
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [dataViewDetail, setDataViewDetail] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false)
    const [isOpenImportModal, setIsOpenImportModal] = useState(false)
    const [isOpenUpdateUser, setIsOpenUpdateUser] = useState(false)
    const [dataUpdate, setDataUpdate] = useState({})

    useEffect(() => {
        fetchUsers()
    }, [current, pageSize, filter, sortQuery])

    const fetchUsers = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await getUsers(query)
        if (res && res.data) {
            setUserList(res.data.result)
            setTotal(res.data.meta.total)
            setIsLoading(false)
        }
    }

    const onSubmit = (e) => {
        console.log(e)
        let query = ""
        if (e.fullName) {
            query += `&fullName=/${e.fullName}/i`
        }
        if (e.email) {
            query += `&email=/${e.email}/i`
        }
        if (e.phone) {
            query += `&phone=/${e.phone}/i`
        }
        setCurrent(1)
        setFilter(query)

    }

    // const handleSearch = (query) => {
    //     fetchUsers(query)
    // }

    const onClear = () => {
        formReset.resetFields()
    }


    const [formReset] = Form.useForm()
    const [formReset2] = Form.useForm()
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a onClick={() => {
                        setDataViewDetail(record)
                        setOpenViewDetail(true)
                    }}>{record._id}</a>
                )

            }
        },
        {
            title: 'User name',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,

        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            sorter: true,
            render: (text, record, index) => (
                <>
                    {moment(record?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                </>
            )

        },
        {
            title: 'Action',
            render: (text, record, index) => (
                <div className="user_crud-table__actions">

                    <DeletePopOver fetchUsers={fetchUsers} id={record._id} />
                    <EditOutlined onClick={() => {
                        setDataUpdate(record)
                        setIsOpenUpdateUser(true)
                    }} className="icon" />
                </div>
            )
        },
    ];


    const onChange = (pagination, filters, sorter, extra) => {
        if (sorter.field) {
            let tmp = ""
            if (sorter.order === 'ascend') {
                tmp += `&sort=${sorter.field}`
            }
            else if (sorter.order === 'descend') {
                tmp += `&sort=-${sorter.field}`
            }
            setSortQuery(tmp)
        }
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setCurrent(1)
            setPageSize(pagination.pageSize)
        }

        console.log('params', pagination, filters, sorter, extra);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const offModal = () => {
        setIsModalOpen(false);
        formReset2.resetFields();
    };

    const handleAddUser = async (e) => {
        console.log(e)
        setIsSubmit(true)
        const res = await addUser(e.fullName, e.password, e.email, e.phone)
        if (res && res.data) {
            message.success("Add new user successfully!")
            formReset2.resetFields()
            setIsModalOpen(false)
            await fetchUsers()
        }
        else {
            notification.error({
                message: "Something went wrong",
                description: res.message
            })
            setIsModalOpen(false)
        }
    }


    const showImportModal = () => {
        setIsOpenImportModal(true)
    }
    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(userList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    }

    const handleOpenPopOver = () => {

    }
    const renderHeader = () => {
        return (
            <>
                <div className="user_crud-table__header">
                    <span>User list</span>
                    <span>
                        <div className="user_crud-options">
                            <Modal
                                maskClosable={false}
                                title="Add new user"
                                open={isModalOpen}
                                onCancel={offModal}
                                footer={null}
                                isLoading={isSubmit}>
                                <Divider></Divider>
                                <Form onFinish={handleAddUser}
                                    layout="vertical"
                                    name="newUser"
                                    autoComplete="off"
                                    form={formReset2}
                                >
                                    <FormItem
                                        name={"fullName"}
                                        label={"Full name"}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your full name!"
                                            }
                                        ]}>
                                        <Input></Input>
                                    </FormItem>
                                    <FormItem
                                        name={"password"}
                                        label={"Password"}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your password!"
                                            }
                                        ]}>
                                        <Input.Password></Input.Password>
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
                                        <Input></Input>
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
                                        <Button onClick={offModal}>Cancel</Button>
                                        <Button htmlType="submit" type="primary">Add</Button>
                                    </div>

                                </Form>


                            </Modal>

                            <UserImport isOpenImportModal={isOpenImportModal}
                                setIsOpenImportModal={setIsOpenImportModal}
                                fetchUsers={fetchUsers}
                            />

                            <Button type="primary" onClick={handleExport}><ExportOutlined />Export</Button>
                            <Button type="primary" onClick={showImportModal}><ImportOutlined />Import</Button>
                            <Button type="primary" onClick={showModal}><PlusOutlined />Add</Button>
                            <Button onClick={() => {
                                setFilter("")
                                setSortQuery("")
                            }}><RedoOutlined /></Button>
                        </div>
                    </span>
                </div>

            </>

        )
    }
    return (
        <>
            <div className="user_crud pr-20">
                <div className="user_crud-form ">
                    <Form
                        form={formReset}
                        onFinish={onSubmit}

                        layout="vertical">
                        <div className="user_crud-form__input grid">
                            <FormItem name={"fullName"} label={"Full name"} className="user_crud-form__item">
                                <Input></Input>
                            </FormItem>
                            <FormItem name={"email"} label={"Email"} className="user_crud-form__item" >
                                <Input></Input>
                            </FormItem>
                            <FormItem name={"phone"} label={"Phone"} className="user_crud-form__item">
                                <Input></Input>
                            </FormItem>
                        </div>


                        <div className="user_crud-form__buttons">
                            <Button onClick={onClear}>Clear</Button>
                            <Button htmlType="submit" type="primary">Search</Button>
                        </div>
                    </Form>
                </div>


                <div className="user_crud-table mt-30">

                    <Table
                        title={renderHeader}
                        columns={columns}
                        dataSource={userList ? (userList) : ([])}
                        onChange={onChange}
                        rowKey={"_id"}
                        loading={isLoading}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => {
                                return (
                                    <div>
                                        {range[0]}-{range[1]} on {total} rows
                                    </div>
                                )
                            }
                        }} />
                </div>
            </div>

            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateUserTable isOpenUpdateUser={isOpenUpdateUser}
                setIsOpenUpdateUser={setIsOpenUpdateUser}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchUsers={fetchUsers}
            ></UpdateUserTable>

        </>
    )
}
export default User_CRUD