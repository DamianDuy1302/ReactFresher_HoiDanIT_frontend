import { Badge, Descriptions, Drawer } from "antd"
import "./UserViewDetail.css"
import DescriptionsItem from "antd/es/descriptions/Item";
import moment from 'moment';
const UserViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail,
        dataViewDetail, setDataViewDetail } = props
    const onClose = () => {
        setOpenViewDetail(false);

    };

    return (
        <>
            <Drawer title="Detail" 
            onClose={onClose} 
            open={openViewDetail}
            className="user_crud-drawer"
            width={"60vw"}>
                <Descriptions 
                title="User info" 
                bordered
                column={2}
                className="user_crud-description">
                    <Descriptions.Item label={"ID"}>
                        {dataViewDetail?._id}
                    </Descriptions.Item>
                    <Descriptions.Item label={"User name"}>
                        {dataViewDetail?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Email"}>
                        {dataViewDetail?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Phone"}>
                        {dataViewDetail?.phone}
                    </Descriptions.Item>


                    <Descriptions.Item label={"Role"} span={2}>
                        <Badge status="processing" text={dataViewDetail?.role}></Badge>
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
            </Drawer>
        </>
    )
}
export default UserViewDetail