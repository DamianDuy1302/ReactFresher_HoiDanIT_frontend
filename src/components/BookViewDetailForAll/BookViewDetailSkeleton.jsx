import { Col, Row, Skeleton } from "antd"

const BookViewDetailSkeleton = () => {
    return (
        <>
            <div className="skeleton" style={{ width: "100%" }}>
                <Row gutter={16}>
                    <Col md={16} sm={24} xs={24}>
                        <Skeleton.Input
                            active={true}
                            block={true}
                            style={{ width: "100%", height: "350px" }} />

                        <div style={{ display: "flex", gap: "30px", marginTop: "20px", justifyContent: "center" }}>
                            <Skeleton.Image active={true}></Skeleton.Image>
                            <Skeleton.Image active={true}></Skeleton.Image>
                            <Skeleton.Image active={true}></Skeleton.Image>
                        </div>
                    </Col>
                    <Col md={8} sm={24} xs={24}>
                        <Skeleton active={true}
                            paragraph={{ rows: 3 }}
                        />
                        <Skeleton active={true}
                            paragraph={{ rows: 2 }}
                        />
                        <div style={{ marginTop: 49, gap: 20, display: "flex" }} >
                            <Skeleton.Button active={true} style={{ height: 32 }}></Skeleton.Button>
                            <Skeleton.Button active={true} style={{}}></Skeleton.Button>
                        </div>

                    </Col>

                </Row>
            </div>


        </>
    )
}
export default BookViewDetailSkeleton