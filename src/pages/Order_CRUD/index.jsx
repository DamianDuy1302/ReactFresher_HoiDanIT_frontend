import { Table } from "antd";
import { useEffect, useState } from "react";
import { callFetchOrderWithPaginate } from "../../services/api";
import moment from "moment";


const Order_CRUD = () => {
    const [data, setData] = useState()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [total, setTotal] = useState(0)
    useEffect(() => {
        const getOrderByPaginate = async () => {
            setIsLoading(true)
            const res = await callFetchOrderWithPaginate(current, pageSize)
            if (res && res.data) {
                setData(res.data.result)
                console.log(data)
                setTotal(res.data.meta.total)
            }
            setIsLoading(false)
        }
        getOrderByPaginate()
    }, [current, pageSize])
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            render: (text, record, index) => {
                console.log(record)
                return (<>
                    <a>{record._id}</a>
                </>)

            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'fullName',
            sorter: (a, b) => a.fullName - b.fullname
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            key: 'price',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'address',
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, record, index) => (
                <>
                    {moment(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </>

            )
        },
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setCurrent(1)
            setPageSize(pagination.pageSize)
        }

        console.log('params', pagination, filters, sorter, extra);
    };

    return (<>

        <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            rowKey={"_id"}
            onChange={onChange}
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

        ></Table>

    </>)
}
export default Order_CRUD