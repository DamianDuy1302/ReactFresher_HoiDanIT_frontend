
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchDashBoard } from "../../services/api.js"
import CountUp from 'react-countup';
const AdminPage = () => {
    const [dashBoardData, setDashBoardData] = useState({
        countOrder: 0,
        countUser: 0,
    })
    useEffect(() => {
        const initDashBoard = async () => {
            const res = await callFetchDashBoard();
            if (res && res.data) {
                setDashBoardData(res.data)
                // console.log("abc")
            }
            else {

            }
        }
        initDashBoard()
    }, [])
    const formatter = (value) => <CountUp end={value} separator="," />;
    return (
        <>
            <div style={{ paddingRight: 20 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card bordered={false}>
                            <Statistic
                                title="User"
                                value={dashBoardData.countUser}
                                // value={12}
                                precision={0}
                                valueStyle={{
                                    color: '#3f8600',

                                }}
                                formatter={formatter}
                            // prefix={<ArrowUpOutlined />}
                            // suffix="%"
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false}>
                            <Statistic
                                title="Order"
                                value={dashBoardData.countOrder}
                                precision={0}
                                valueStyle={{
                                    color: '#000',
                                }}
                                formatter={formatter}
                            // prefix={<ArrowDownOutlined />}
                            // suffix="%"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

        </>

    )
}
export default AdminPage
