import { Col, Rate, Row } from "antd"
import "./styles.css"
import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import ModalDetailImage from "./ModalDetailImage";
import BookViewDetailSkeleton from "./BookViewDetailSkeleton";
import { doAddBookAction } from "../../redux/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
const BookViewDetailForAll = (props) => {
    const { dataBook } = props
    console.log(dataBook)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [currentQuantity, setCurrentQuantity] = useState(1)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [book, setBook] = useState()
    const refGallery = useRef(null)
    const dispatch = useDispatch()
    const handleOnClickImage = () => {
        setBook(dataBook)
        setIsOpenModal(true)
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleAddBookToCart = (quantity, book) => {
        console.log(quantity)
        dispatch(doAddBookAction({ quantity: quantity, _id: book._id, detail: book }))
    }
    const handleChangeButton = (type) => {
        if (type === "minus") {
            if (currentQuantity - 1 <= 0) return
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === "plus") {
            if (currentQuantity === +dataBook.quantity) return
            setCurrentQuantity(currentQuantity + 1)
        }
    }

    return (
        <>
            <ModalDetailImage
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                items={dataBook?.items}
                title={dataBook?.mainText}
                currentIndex={currentIndex}
            />

            <div className="container">
                {dataBook && dataBook?._id ? (
                    <Row>
                        <Col md={16} sm={24}>
                            <div className="images-section">
                                <ImageGallery
                                    ref={refGallery}
                                    items={dataBook.items ? (dataBook.items) : ([])}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true} //onHover: auto scroll image
                                    onClick={() => handleOnClickImage()}
                                />
                            </div>
                        </Col>
                        <Col md={8} sm={24}>
                            <div className="content-section">
                                <div className="author">
                                    <span>Author: </span>
                                    <span style={{ color: "#00aeef" }}>{dataBook.author ? (dataBook.author) : ("")}</span>
                                </div>
                                <div className="mainText">
                                    {dataBook.mainText}
                                </div>
                                <div className="sold">
                                    <div className="rate">
                                        <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10, marginRight: 15 }}></Rate>
                                    </div>

                                    <span>{dataBook.sold} sold</span>
                                </div>

                                <div className="price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price ?? 0)}
                                </div>

                                <div className="transport">
                                    <span>Transport</span>
                                    <span className="ship">Free ship</span>
                                </div>
                                <div className="quantity">
                                    <span>Quantity</span>
                                    <div className="quantity-adjustment">
                                        <div className="minus" onClick={() => {
                                            handleChangeButton("minus")
                                        }}>-</div>
                                        <input type={"number"} id="number" className="number" value={currentQuantity} defaultValue={1} min={1} max={dataBook.quantity}
                                            onChange={() => {
                                                const number = document.getElementById("number")
                                                const maxQuantity = dataBook.quantity
                                                if (number.value >= maxQuantity) {
                                                    number.value = maxQuantity
                                                }
                                                setCurrentQuantity(number.value)
                                            }}
                                        />
                                        <div className="plus" onClick={() => {
                                            handleChangeButton("plus")
                                        }}>+</div>
                                    </div>
                                </div>
                                <div className="payment">
                                    <div className="add-to-cart" onClick={() => {
                                        const number = document.getElementById("number")
                                        handleAddBookToCart(currentQuantity, dataBook)
                                    }}>Add to cart</div>
                                    <div className="buy-now">Buy now</div>
                                </div>
                            </div>
                        </Col>

                    </Row>

                ) : (<BookViewDetailSkeleton>
                </BookViewDetailSkeleton>)}
            </div>
        </>
    )
}
export default BookViewDetailForAll