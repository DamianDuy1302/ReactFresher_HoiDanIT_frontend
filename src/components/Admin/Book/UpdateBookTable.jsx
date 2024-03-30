import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Upload, message, notification } from "antd"
import FormItem from "antd/es/form/FormItem"
import { useEffect, useState } from "react"
import { callUploadBookImg, getBooksCategory, updateBook } from "../../../services/api"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from 'uuid';
const UpdateBookTable = (props) => {
    const { isOpenUpdateBook, setIsOpenUpdateBook, dataUpdate, setDataUpdate, fetchBooks } = props
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [initForm, setInitForm] = useState(null)
    const [thumbnail, setThumbnail] = useState([])
    const [sliderList, setSliderList] = useState([])
    const [bookCategory, setBookCategory] = useState([])
    const [form] = Form.useForm()
    // console.log(dataUpdate)
    const onSubmit = async (e) => {
        console.log(e)
        if (thumbnail.length === 0) {
            notification.error({
                message: "Validated error",
                description: "Please upload thumbnail image"
            })
            return
        }
        if (sliderList.length === 0) {
            notification.error({
                message: "Validated error",
                description: "Please upload slider image"
            })
            return
        }
        const { author, category, mainText, price, quantity, sold } = e
        const thumbnailImageName = thumbnail.name
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
        console.log(obj)
        const res = await updateBook(e._id, obj)
        console.log(res)
        if (res && res.data) {
            console.log(res)
            message.success("Add new book successfully!")
            form.resetFields()
            setThumbnail([])
            setSliderList([])
            setInitForm(null)
            setIsOpenUpdateBook(false)
            await fetchBooks()
        }
        else {
            notification.error({
                message: "Something went wrong",
                description: res
            })
            setIsOpenUpdateBook(false)
        }


    }
    const offModal = () => {
        setIsOpenUpdateBook(false)
        form.resetFields()
        setInitForm(null)
        setDataUpdate(null)
    }
    useEffect(() => {
        fetchBookCategory()
        console.log(dataUpdate)
        if (dataUpdate?._id) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumbnail,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`,
                }
            ]
            const arrSlider = dataUpdate?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            })

            const init = {
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                category: dataUpdate.category,
                quantity: dataUpdate.quantity,
                sold: dataUpdate.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider },
            }
            console.log(init)
            setInitForm(init)
            setThumbnail(arrThumbnail[0])
            setSliderList(arrSlider)
            form.setFieldsValue(init)
        }
        return () => {
            form.resetFields();
        }
    }, [dataUpdate])
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
    const handleRemove = (file, type) => {
        if (type === "thumbnail") {
            setThumbnail([])
        }
        else if (type === "slider") {
            const newSlider = sliderList.filter(item => item.uid != file.uid)
            setSliderList(newSlider)
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
    const handlePreview = async (file) => {
        if (file.url && file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return
        }
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
    const fetchBookCategory = async () => {
        const res = await getBooksCategory()
        if (res && res.data) {
            // console.log(res.data)
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
    return (

        <>

            <Modal
                maskClosable={false}
                title="Update book"
                open={isOpenUpdateBook}
                onCancel={offModal}
                // onOk={() => { form.submit() }}
                footer={null}
                destroyOnClose={true}
            >

                <Divider></Divider>
                <Form
                    onFinish={onSubmit}
                    layout="vertical"
                    name="newBook"
                    // autoComplete="off"
                    form={form}
                >
                    <Row gutter={12}>
                        <Col hidden>
                            <FormItem

                                name={"_id"}
                                label={"Id"}
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
                                    // name="thumbnail"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    customRequest={handleUploadFileThumbnail}
                                    maxCount={1}
                                    multiple={false}
                                    onPreview={handlePreview}
                                    onRemove={(file) => {
                                        handleRemove(file, "thumbnail")
                                    }}
                                    defaultFileList={initForm?.thumbnail?.fileList ?? []}
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
                            <FormItem >
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
                                    defaultFileList={initForm?.slider?.fileList ?? []}
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
                        <Button htmlType="submit" type="primary">Update</Button>
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
        </>
    )
}

export default UpdateBookTable