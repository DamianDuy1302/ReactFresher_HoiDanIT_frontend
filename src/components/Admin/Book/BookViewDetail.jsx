import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd"
import "./BookViewDetail.css"
import moment from 'moment';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"
const BookViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail,
        dataViewDetail, setDataViewDetail } = props
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null)
    };
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail = {}, imgSlider = [];
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: "done",
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider]);
        }
    }, [dataViewDetail])
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    return (
        <>
            <Drawer title="Detail"
                onClose={onClose}
                open={openViewDetail}
                className="user_crud-drawer"
                width={"60vw"}>
                <Divider orientation="left">Book's info</Divider>
                <Descriptions
                    // title="User info"
                    bordered
                    column={2}
                    className="user_crud-description">
                    <Descriptions.Item label={"ID"}>
                        {dataViewDetail?._id}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Book's name"}>
                        {dataViewDetail?.mainText}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Author"}>
                        {dataViewDetail?.author}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Price"}>
                        {dataViewDetail?.price} đ
                    </Descriptions.Item>
                    <Descriptions.Item label={"Quantity"}>
                        {dataViewDetail?.quantity}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Sold"}>
                        {dataViewDetail?.sold}
                    </Descriptions.Item>


                    <Descriptions.Item label={"Category"} span={2}>
                        <Badge status="processing" text={dataViewDetail?.category}></Badge>
                    </Descriptions.Item>

                    <Descriptions.Item label={"Created at"}>
                        {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                        {/* {(dataViewDetail?.createdAt)} */}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Updated at"}>
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                        {/* {(dataViewDetail?.updatedAt)} */}
                    </Descriptions.Item>


                </Descriptions>
                <Divider orientation="left">Book's images</Divider>
                <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    className="upload"
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </Drawer>

        </>
    )
}
export default BookViewDetail