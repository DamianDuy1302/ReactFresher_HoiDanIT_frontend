import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Spin, Tabs } from "antd"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import "./styles.css"
import { RedoOutlined } from "@ant-design/icons"
import FormItem from "antd/es/form/FormItem"
import { useEffect, useState } from "react"
import { getBooks, getBooksCategory } from "../../services/api"
const Home = () => {
    const [bookCategory, setBookCategory] = useState([])
    const [bookList, setBookList] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(8)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState(`sort=-sold`)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState()
    const fetchBookCategory = async () => {
        const res = await getBooksCategory()
        if (res && res.data) {
            const tmp = res.data.map(item => {
                return { label: item, value: item }
            })
            setBookCategory(tmp)
        }
    }
    const fetchBooks = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        if (category) {
            query += `&${category}`
        }
        const res = await getBooks(query)
        if (res && res.data) {
            console.log(res)
            setBookList(res.data.result)
            setTotal(res.data.meta.total)
            // setIsLoading(false)
            // console.log(bookList)
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchBooks()
    }, [current, pageSize, filter, sortQuery, category, price])

    useEffect(() => {
        fetchBookCategory()
    }, [])
    const onChangeCheckBox = (checkedValues) => {

        console.log('checked = ', checkedValues);
        let tmpCate = `category=` + checkedValues.join(',')
        // let tmpCate = `category=`
        // checkedValues.map(item => {
        //     tmpCate = tmpCate + `${item},`
        // })
        // tmpCate = tmpCate.substring(0, tmpCate.length - 1)
        console.log(tmpCate)
        setCategory(tmpCate)

    };
    const [form] = Form.useForm()
    const onSubmit = (e) => {
        console.log(e)
        if (e?.range?.from && e?.range?.to) {
            console.log(e)
            let miny = e.range.from
            let maxy = e.range.to

            if (miny > maxy) {
                miny = e.range.to
                maxy = e.range.from
            }

            let f = `price>=${miny}&price<=${maxy}`
            console.log(f)
            console.log(1)
            setFilter(f)
        }
        else {
            let miny = 0
            let maxy = 999999999999
            if (e?.range?.from) {
                miny = e?.range?.from
            }
            if (e?.range?.to) {
                maxy = e?.range?.to
            }

            let f = `price>=${miny}&price<=${maxy}`
            console.log(f)
            setFilter(f)
        }

    }
    const onChangeTab = (key) => {
        console.log(key);
        setSortQuery(`sort=${key}`)

    };

    const items = [
        {
            key: '-sold',
            label: 'Trending',
            children: <></>,
        },
        {
            key: '-updatedAt',
            label: 'Lastest',
            children: <></>,
        },
        {
            key: 'price',
            label: 'Price Asc',
            children: <></>,
        },
        {
            key: '-price',
            label: 'Price Desc',
            children: <></>,
        },
    ];
    const handleChangePag = (p, s) => {
        console.log(p, s)
        setCurrent(p)
    }
    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }
    const nav = useNavigate()
    const handleDirectToDetailBook = (item) => {
        console.log(item)
        const slug = convertSlug(item.mainText)
        nav(`/book/${slug}?id=${item._id}`)

    }
    return (
        <>
            <div className="homePage-container">
                <Row gutter={16}>
                    <Col md={4} sm={0} xs={0}>
                        <Form className="filter-section"
                            layout="vertical"
                            onFinish={onSubmit}
                            form={form}>
                            <div className="filter-title df jcsb">
                                <div className="">
                                    Filter
                                </div>
                                <RedoOutlined onClick={() => {
                                    form.resetFields()
                                    setCategory([])

                                }} style={{ cursor: "pointer" }} />

                            </div>

                            <div className="category">

                                <FormItem name={"category"}
                                    label={"Category"}
                                >
                                    <Checkbox.Group style={{ width: '100%' }} onChange={onChangeCheckBox}>
                                        <Row>
                                            {bookCategory ? (
                                                <>
                                                    {bookCategory.map((item, index) => {
                                                        return (
                                                            <Col span={24} key={`${index}`} style={{ marginBottom: "5px" }}>
                                                                <Checkbox value={`${item.value}`}>{item.label}</Checkbox>
                                                            </Col>
                                                        )
                                                    })}
                                                </>
                                            ) : (<>

                                            </>)}

                                        </Row>
                                    </Checkbox.Group>
                                </FormItem>


                            </div>

                            <div className="price">
                                <FormItem
                                    labelCol={{ span: 24 }}
                                    label={"Price (vnd)"}
                                >
                                    <div className="priceRange df jcsb fw">
                                        <FormItem name={["range", "from"]}
                                        >
                                            <InputNumber

                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                min={0}
                                            />
                                        </FormItem>
                                        <div className="df aic jcc">-</div>
                                        <FormItem name={["range", "to"]}
                                        >
                                            <InputNumber

                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                min={0}
                                            />
                                        </FormItem>
                                    </div>

                                </FormItem>

                            </div>

                            <Button style={{ width: "100%" }} type="primary" htmlType="submit">Apply</Button>

                        </Form>
                    </Col>

                    <Col md={20} sm={24} xs={24} >
                        <div className="products-section">
                            <Tabs defaultActiveKey="-sold" items={items} onChange={onChangeTab} />
                            <div className="products">
                                <Spin spinning={isLoading} tip={"Loading..."}>
                                    <Row gutter={[12, 12]}>
                                        {bookList ? (<>
                                            {bookList.map((item, index) => {
                                                return (
                                                    <Col className="col-customize" md={6} sm={12} xs={12}>
                                                        <div onClick={() => {
                                                            handleDirectToDetailBook(item)
                                                        }} className="wrapper" key={index}>
                                                            <div className="thumbnail">
                                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="" />
                                                            </div>
                                                            <div className="content">
                                                                <div className="mainText">
                                                                    {item.mainText}
                                                                </div>
                                                                <div>
                                                                    <div className="price">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                                    </div>
                                                                    <div className="sold">
                                                                        <div className="rate">
                                                                            <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 6, marginRight: 5 }}></Rate>
                                                                        </div>

                                                                        <span>{item.sold} sold</span>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </Col>
                                                )

                                            })}
                                        </>) : (<>
                                        </>)}

                                    </Row>
                                </Spin>

                            </div>
                            <Col span={24} className="pagination">
                                <Pagination
                                    // showQuickJumper
                                    total={total}
                                    // showTotal={(total, range) => {
                                    //     console.log(range)
                                    //     return (
                                    //         `${range[0]}-${range[1]} of ${total} items`
                                    //     )

                                    // }}
                                    defaultPageSize={pageSize}
                                    defaultCurrent={current}
                                    onChange={(p, s) => { handleChangePag(p, s) }}
                                />
                            </Col>
                        </div>


                    </Col>

                </Row>
            </div >

        </>
    )
}
export default Home