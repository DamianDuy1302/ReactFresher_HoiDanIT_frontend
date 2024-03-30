import { Col, Divider, Image, Modal, Row } from "antd"
import { useEffect, useRef, useState } from "react"
import ImageGallery from "react-image-gallery"
import { getBookDetailById } from "../../services/api"
import { useLocation } from "react-router-dom"

const ModalDetailImage = (props) => {
    const { isOpenModal, setIsOpenModal, currentIndex,
        items, title } = props
    const [dataBook, setDataBook] = useState()
    const refGallery = useRef(null)
    let location = useLocation()
    let params = new URLSearchParams(location.search)
    const id = params?.get("id")
    console.log(id)

    useEffect(() => {
        fetchBook(id)
    }, [])

    const fetchBook = async (id) => {
        const res = await getBookDetailById(id)
        if (res && res.data) {
            console.log(res)
            let raw = res.data
            raw.items = getImages(raw)
            setDataBook(raw)
        }
    }
    const getImages = (raw) => {
        const images = []
        if (raw.thumbnail) {
            images.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`
            })
        }
        if (raw.slider) {
            raw.slider.map((item, index) => {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                })
            })
        }
        return images
    }


    return (

        <>
            <Modal
                title={title}
                width={"60vw"}
                open={isOpenModal}
                onCancel={() => { setIsOpenModal(false) }}
                maskClosable={true}
                footer={null}

            >
                <Row gutter={12}>
                    <Col span={16}>
                        <ImageGallery
                            startIndex={currentIndex}
                            ref={refGallery}
                            items={items}
                            showThumbnails={false}
                            renderLeftNav={() => { <></> }}
                            renderRightNav={() => { <></> }}
                            showPlayButton={false}
                            showFullscreenButton={false}
                        // onClick={() => {
                        //     refGallery.current.slideToIndex(index)
                        // }}
                        >

                        </ImageGallery>
                    </Col>
                    <Col span={8}>

                        <Row gutter={[12, 12]}>

                            {items?.map((item, index) => {
                                return (
                                    <Col key={`image-${index}`}>
                                        <Image width={100}
                                            height={100}
                                            src={item.original}
                                            preview={false}
                                            onClick={() => {
                                                refGallery.current.slideToIndex(index)
                                            }}
                                        >

                                        </Image>
                                    </Col>
                                )
                            })}
                            <div style={{ paddingBottom: 12 }}></div>
                        </Row>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
export default ModalDetailImage