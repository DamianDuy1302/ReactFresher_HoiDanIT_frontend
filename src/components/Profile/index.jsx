import { Modal, Tabs } from "antd"
import { useState } from "react";
import ProfileTab1 from "../ProfileTab1";
import ProfileTab2 from "../ProfileTab2";
import { useSelector } from "react-redux"
const Profile = (props) => {
    const { openProfileModal, setOpenProfileModal } = props
    const user = useSelector(state => state.account.user)

    console.log(user)
    console.log(openProfileModal)
    const items = [
        {
            key: '1',
            label: 'Tab 1',
            children: <>
                <ProfileTab1 user={user} openProfileModal={openProfileModal}
                    setOpenProfileModal={setOpenProfileModal}
                ></ProfileTab1>
            </>,
        },
        {
            key: '2',
            label: 'Tab 2',
            children: <>
                <ProfileTab2 user={user} openProfileModal={openProfileModal}
                    setOpenProfileModal={setOpenProfileModal}
                ></ProfileTab2>
            </>,
        },

    ];
    const onChange = () => {

    }
    return (
        <>

            <Modal
                title={"Profile"}
                open={openProfileModal}
                footer={null}
                onCancel={() => { setOpenProfileModal(false) }}
                maskClosable={false}
            >
                {/* <div style={{ paddingTop: "12px" }}></div> */}
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
        </>

    )
}
export default Profile