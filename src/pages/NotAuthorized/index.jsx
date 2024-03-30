import { Button, Result } from "antd"
import notFoundPic from "../../assets/images/notFoundPic.jpg"
import { Link } from "react-router-dom"

const NotAuthorized = () => {
    const style1 = {
        width: "400px",
        height: "400px",
        margin: "auto",
        padding: "60px",
        textAlign: "center"
    }
    const style2 = {
        width: "100%"
    }
    const style3 = {
        margin: "60px 0px 0px 0px",
        minHeight: "89vh",
        // backgroundColor: "#fff"
    }
    return (
        <>
            {/* <div style={style1}>
                <img src={notFoundPic} alt=""  style={style2}/>
                <div>Sorry, the page you visted does not exist...</div>

                <Button style={style3} type="primary"><Link to={"/"}>Back home</Link></Button>
            </div> */}
            <Result
                style={style3}
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary"><Link to={"/"}>Back home</Link></Button>}
            />

        </>
    )
}
export default NotAuthorized