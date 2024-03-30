import { useLocation } from "react-router-dom"
import BookViewDetailForAll from "../../components/BookViewDetailForAll"
import { useEffect, useState } from "react"
import { getBookDetailById } from "../../services/api"

const BookPage = () => {
    const [dataBook, setDataBook] = useState()
    let location = useLocation()
    let params = new URLSearchParams(location.search)
    const id = params?.get("id")
    console.log(id)

    useEffect(() => {
        fetchBook(id)
    }, [id])

    const fetchBook = async (id) => {
        const res = await getBookDetailById(id)
        if (res && res.data) {
            console.log(res)
            let raw = res.data
            raw.items = getImages(raw)
            setTimeout(() => {
                setDataBook(raw)
            }, 1500)
        }
        else {
            console.log("haah")
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
            <BookViewDetailForAll dataBook={dataBook} />
        </>
    )
}
export default BookPage