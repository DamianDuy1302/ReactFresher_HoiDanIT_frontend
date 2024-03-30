import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Table, Upload, message, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import "./styles.css"
import { useEffect, useState } from "react"
import { addBook, addUser, callUploadBookImg, getBooks, getBooksCategory, getUsers } from "../../services/api"
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, LoadingOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons"
import UserViewDetail from "../../components/Admin/User/UserViewDetail"
import UserImport from "../../components/Admin/User/UserImport"
import moment from "moment"
import * as XLSX from "xlsx"
import UpdateUserTable from "../../components/Admin/User/UpdateUserTable"
import DeletePopOver from "../../components/Admin/User/DeletePopOver"
import BookViewDetail from "../../components/Admin/Book/BookViewDetail"
import UpdateBookTable from "../../components/Admin/Book/UpdateBookTable"
import DeleteBook from "../../components/Admin/Book/DeleteBook"
const Book_CRUD = () => {

    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [bookList, setBookList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt")
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [dataViewDetail, setDataViewDetail] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false)
    const [isOpenImportModal, setIsOpenImportModal] = useState(false)
    const [isOpenUpdateBook, setIsOpenUpdateBook] = useState(false)
    const [dataUpdate, setDataUpdate] = useState({})

    useEffect(() => {
        fetchBooks()
    }, [current, pageSize, filter, sortQuery])

    const fetchBooks = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await getBooks(query)
        console.log(res)
        if (res && res.data) {
            setBookList(res.data.result)
            setTotal(res.data.meta.total)
            setIsLoading(false)
        }
    }

    const onSubmit = (e) => {
        console.log(e)
        let query = ""
        if (e.mainText) {
            query += `&mainText=/${e.mainText}/i`
        }
        if (e.email) {
            query += `&author=/${e.author}/i`
        }
        if (e.phone) {
            query += `&category=/${e.category}/i`
        }
        setFilter(query)
    }

    const handleSearch = (query) => {
        fetchBooks(query)
    }

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
            title: "Book's name",
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: "Category",
            dataIndex: 'category',
            sorter: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,

        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            sorter: true,
            // defaultSortOrder: 'descend',
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

                    <DeleteBook fetchBooks={fetchBooks} id={record._id} />
                    <EditOutlined onClick={() => {
                        setDataUpdate(record)
                        setIsOpenUpdateBook(true)
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
        formReset2.resetFields();
        setIsModalOpen(false);
    };

    const showImportModal = () => {
        setIsOpenImportModal(true)
    }


    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(bookList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    }

    const renderHeader = () => {
        const [loading, setLoading] = useState(false);
        const [loadingSlider, setLoadingSlider] = useState(false);
        const [imageUrl, setImageUrl] = useState();
        const [previewOpen, setPreviewOpen] = useState(false);
        const [previewImage, setPreviewImage] = useState('');
        const [previewTitle, setPreviewTitle] = useState('');

        const [fileList, setFileList] = useState([])
        const [thumbnail, setThumbnail] = useState([])
        const [sliderList, setSliderList] = useState([])
        const [bookCategory, setBookCategory] = useState([])

        const getBase64 = (img, callback) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        };
        const beforeUpload = (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        };
        const handleAddBook = async (e) => {
            console.log(e)
            console.log(thumbnail)
            console.log(sliderList)
            // return
            if (thumbnail.length == 0) {
                notification.error({
                    message: "Validated error",
                    description: "Please upload thumbnail image"
                })
                return
            }
            if (sliderList.length == 0) {
                notification.error({
                    message: "Validated error",
                    description: "Please upload slider image"
                })
                return
            }

            const { author, category, mainText, price, quantity, sold } = e
            const thumbnailImageName = thumbnail[0].name
            const sliderImagename = sliderList.map(item => item.name)
            const obj = {
                "thumbnail": thumbnailImageName,
                "slider": sliderImagename,
                "mainText": mainText,
                "author": author,
                "price": price,
                "sold": sold,
                "quantity": quantity,
                "category": category
            }
            setIsSubmit(true)
            const res = await addBook(obj)
            console.log(res)
            if (res && res.data) {
                message.success("Add new user successfully!")
                formReset2.resetFields()
                setThumbnail([])
                setSliderList([])
                setIsModalOpen(false)
                await fetchBooks()
            }
            else {
                notification.error({
                    message: "Something went wrong",
                    description: res.message
                })
                setIsModalOpen(false)
            }
        }
        const handlePreview = async (file) => {
            getBase64(file.originFileObj, (url) => {
                setPreviewImage(url);
                setPreviewOpen(true);
                setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            })

        };
        const handleChange = (info, type) => {
            if (info.file.status === 'uploading') {
                type ? setLoadingSlider(true) : setLoading(true)
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, (url) => {
                    type ? setLoadingSlider(false) : setLoading(false);
                    setImageUrl(url);
                });
            }
        };
        // const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

        const fetchBookCategory = async () => {
            const res = await getBooksCategory()
            if (res && res.data) {
                console.log(res.data)
                let tmp = []
                res.data.map(item => {
                    tmp.push({
                        value: item,
                        label: item
                    })
                })
                setBookCategory(tmp)
            }
        }
        const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
            const res = await callUploadBookImg(file)
            if (res && res.data) {
                console.log(res)
                setThumbnail([{
                    name: res.data.fileUploaded,
                    uid: file.uid
                }])
                onSuccess("ok")
            }
            else {
                onError("Somethings went wrong!")
            }

        }
        const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
            const res = await callUploadBookImg(file)
            if (res && res.data) {
                setSliderList((sliderList) => [...sliderList, {
                    name: res.data.fileUploaded,
                    uid: file.uid
                }])
                onSuccess("ok")
            }
            else {
                onError("Somethings went wrong!")
            }
        }
        const handleRemove = (file, type) => {
            if (type === "thumbnail") {
                setThumbnail([])
            }
            else if (type === "slider") {
                const newSlider = sliderList.filter(item => item.uid != file.uid)
                setSliderList(newSlider)
            }
        }
        useEffect(() => {
            fetchBookCategory()
        }, [])
        return (
            <>
                <div className="user_crud-table__header">
                    <span>Book list</span>
                    <span>
                        <div className="user_crud-options">
                            <Modal
                                maskClosable={false}
                                title="Add new book"
                                open={isModalOpen}
                                onCancel={() => {
                                    formReset2.resetFields()
                                    setIsModalOpen(false)
                                }}
                                footer={null}
                                isLoading={isSubmit}
                                destroyOnClose={true}
                            >

                                <Divider></Divider>
                                <Form
                                    onFinish={handleAddBook}
                                    layout="vertical"
                                    name="newBook"
                                    autoComplete="off"
                                    form={formReset2}
                                >
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem

                                                name={"mainText"}
                                                label={"Book's name"}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please input your book's name!"
                                                    }
                                                ]}>
                                                <Input></Input>
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                name={"author"}
                                                label={"Author"}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please input book's author!"
                                                    }
                                                ]}>
                                                <Input></Input>
                                            </FormItem>
                                        </Col>


                                    </Row>

                                    <Row gutter={12}>
                                        <Col span={8}><FormItem
                                            name={"price"}
                                            label={"Price"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input price!"
                                                }
                                            ]}>
                                            <InputNumber min={0}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                addonAfter={"VND"}></InputNumber>
                                        </FormItem></Col>
                                        <Col span={6}><FormItem
                                            name={"category"}
                                            label={"Category"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input category!"
                                                }
                                            ]}>
                                            <Select
                                                options={bookCategory}
                                                showSearch
                                                allowClear
                                                defaultValue={null}></Select>
                                        </FormItem></Col>
                                        <Col span={6}> <FormItem
                                            name={"quantity"}
                                            label={"Quantity"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input quantity!"
                                                }
                                            ]}>
                                            <InputNumber style={{ width: '100%' }} min={1}></InputNumber>
                                        </FormItem></Col>
                                        <Col span={4}><FormItem
                                            name={"sold"}
                                            label={"Sold"}
                                            // initialValue={0}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input sold!"
                                                }
                                            ]}>
                                            <InputNumber style={{ width: '100%' }} min={0}></InputNumber>
                                        </FormItem></Col>
                                    </Row>

                                    <Row>
                                        <Col span={12}>
                                            {/* <Divider orientation="left">Thumbnail image</Divider> */}
                                            <div className="mb-10">Thumbnail image</div>
                                            <FormItem>
                                                <Upload
                                                    name="thumbnail"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    // showUploadList={false}
                                                    beforeUpload={beforeUpload}
                                                    onChange={handleChange}
                                                    customRequest={handleUploadFileThumbnail}
                                                    maxCount={1}
                                                    multiple={false}
                                                    onPreview={handlePreview}
                                                    onRemove={(file) => {
                                                        handleRemove(file, "thumbnail")
                                                    }}
                                                // fileList={[]}
                                                >
                                                    <div>
                                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>

                                                </Upload>
                                            </FormItem>

                                        </Col>

                                        <Col span={12}>
                                            <div className="mb-10">Sliders images</div>
                                            <FormItem>
                                                <Upload
                                                    name="slider"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    // showUploadList={false}
                                                    beforeUpload={beforeUpload}
                                                    onChange={(info) => handleChange(info, "slider")}
                                                    customRequest={handleUploadFileSlider}
                                                    multiple={true}
                                                    onPreview={handlePreview}
                                                    onRemove={(file) => {
                                                        handleRemove(file, "slider")
                                                    }}

                                                >
                                                    <div>
                                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>

                                                </Upload>
                                            </FormItem>

                                        </Col>
                                    </Row>



                                    <div className="user_crud-form__buttons">
                                        <Button onClick={offModal}>Cancel</Button>
                                        <Button htmlType="submit" type="primary">Add</Button>
                                    </div>

                                </Form>
                                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>


                            </Modal>

                            <Button type="primary" onClick={handleExport}><ExportOutlined />Export</Button>
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
                            <FormItem name={"mainText"} label={"Book's name"} className="user_crud-form__item">
                                <Input></Input>
                            </FormItem>
                            <FormItem name={"author"} label={"Author"} className="user_crud-form__item" >
                                <Input></Input>
                            </FormItem>
                            <FormItem name={"category"} label={"Category"} className="user_crud-form__item">
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
                        dataSource={bookList}
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
                        }}
                    />
                </div>
            </div>

            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateBookTable
                isOpenUpdateBook={isOpenUpdateBook}
                setIsOpenUpdateBook={setIsOpenUpdateBook}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchBooks={fetchBooks}
            ></UpdateBookTable>

        </>
    )
}
export default Book_CRUD