import { Table, Tag } from "antd"
import { useEffect, useState } from "react";
import { getOrderHistory } from "../../services/api.js"
import moment from "moment";
import ReactJson from 'react-json-view'
const History = () => {
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const fetchOrderHistory = async () => {

        const res = await getOrderHistory()
        if (res && res.data) {
            setIsLoading(true)
            let tmpData = res?.data?.map((item, index) => {
                return {
                    _id: item._id,
                    detail: item.detail,
                    total: item.totalPrice,
                    createdAt: item.createdAt,
                }
            })

            setData(tmpData)
            setIsLoading(false)
        }
        else {
            console.log(1)
        }
    }
    useEffect(() => {
        fetchOrderHistory()
    }, [data])

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            render: (text, record, index) => {
                return (
                    <>
                        {record._id}
                    </>
                )
            }
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            sorter: (a, b) => a.createdAt - b.createdAt,
            render: (text, record, index) => (
                <>
                    {moment(record?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </>
            )
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
            render: (text, record, index) => {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.total ?? 0)}
                        {/* {record.total} */}
                    </>
                )
            }
        },
        {
            title: 'Status',
            dataIndex: '',
            key: 'status',
            render: (text, record, index) => {
                return (
                    <Tag color="green">Success</Tag>
                )
            }
        },
        {
            title: 'Detail',
            dataIndex: 'detail',
            key: 'detail',
            render: (text, record, index) => {
                // console.log(record)
                return (
                    <>
                        <ReactJson src={record}
                            shouldCollapse={() => { return (true) }} />
                    </>
                )
            }
        },
    ];
    // const onChange = (pagination, filters, sorter, extra) => {
    //     if (sorter.field) {
    //         let tmp = ""
    //         if (sorter.order === 'ascend') {
    //             tmp += `&sort=${sorter.field}`
    //         }
    //         else if (sorter.order === 'descend') {
    //             tmp += `&sort=-${sorter.field}`
    //         }
    //         // setSortQuery(tmp)
    //     }

    //     console.log('params', pagination, filters, sorter, extra);
    // };
    return (
        <>

            < Table
                columns={columns}
                dataSource={data}
                loading={isLoading}
                title={() => { return (<div style={{ fontWeight: "600" }}>Orders list</div>) }}
                pagination={{}}
            // onChange={onChange}

            >

            </Table >
        </>
    )
}
export default History