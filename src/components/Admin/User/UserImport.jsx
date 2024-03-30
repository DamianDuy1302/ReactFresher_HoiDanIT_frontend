import { InboxOutlined } from "@ant-design/icons"
import { Button, Form, Modal, Table, notification } from "antd"
import Dragger from "antd/es/upload/Dragger"
import "./UserImport.css"
import { message, Upload } from 'antd';
import { useState } from "react";
import * as XLSX from 'xlsx';
import { useForm } from "antd/es/form/Form";
import { importUsers } from "../../../services/api";
import templateFile from "../User/data/test.xlsx?url"
const UserImport = (props) => {
    const { isOpenImportModal, setIsOpenImportModal, fetchUsers } = props
    const [isImported, setIsImported] = useState(true)
    const [data, setData] = useState([])
    const [showUpLoadList, setShowUpLoadList] = useState(true)
    const { Dragger } = Upload;

    const handleCancel = () => {
        setIsOpenImportModal(false)
        setData([])
        setShowUpLoadList(false)
    }
    

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 2000);
    };

    const tableTitle = () => {
        return (
            <strong>Uploaded data</strong>
        )
    }
    let propsImport = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        customRequest: dummyRequest,
        onChange(info) {
            setShowUpLoadList(true)
            console.log(info)
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                
                if (info.fileList && info.fileList[0].originFileObj) {
                    const file = info.fileList[0].originFileObj;
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        let data = new Uint8Array(e.target.result);
                        let workbook = XLSX.read(data, { type: 'array' });
                        // find the name of your sheet in the workbook first
                        let worksheet = workbook.Sheets['Trang tính1'];

                        // convert to json format
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                            header: ["fullName", "email", "phone"],
                            range: 1, //skip cai dong dau tien la header
                        });
                        if(jsonData && jsonData.length > 0){
                            setData(jsonData)
                        }
                    };
                    
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = async ()=>{
        const new_data = data.map((item)=>{
            item.password = "123456"
            return item
        })
        const res = await importUsers(new_data)
        if(res.data){
            notification.success({
                description: `Success ${res.data.countSuccess}, Error ${res.data.countError}`,
                message: "Upload successfully!"
            })
            setData([])
            setShowUpLoadList(false)
            setIsOpenImportModal(false)
            fetchUsers()
        }
        else{
            notification.error({
                description: res.message,
                message: "Somethings went wrong!"
            })
        }
    }

    return (
        <>
            <Modal
                className="modal"
                maskClosable={false}
                title={"Import data users"}
                open={isOpenImportModal}
                onCancel={handleCancel}
                footer={null}>
                <div className="dragger">
                    <Dragger
                    showUploadList={showUpLoadList}
                        {...propsImport}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload or 
                            <a onClick={e=>{e.stopPropagation()}} href={templateFile} download> Download sample file</a>
                        </p>
                        <p className="ant-upload-hint">
                            
                        </p>
                    </Dragger>
                </div>

                <div className="table">
                    <Table
                        title={tableTitle}
                        dataSource={data}
                        pagination = {{
                            pageSize: 4
                        }}
                        columns={[
                            {
                                title: "User name",
                                dataIndex: "fullName",
                                key: "fullName"
                            },
                            {
                                title: "Email",
                                dataIndex: "email",
                                key: "email"
                            },
                            {
                                title: "Phone",
                                dataIndex: "phone",
                                key: "phone"
                            },

                        ]}>

                    </Table>
                    <div className="user_crud-form__buttons">
                        <Button onClick={handleCancel}>Cancle</Button>
                        <Button disabled={data.length>0 ? (false) : (true)} onClick={handleSubmit} type="primary">Import</Button>
                    </div>
                </div>

            </Modal>

        </>
    )
}
export default UserImport