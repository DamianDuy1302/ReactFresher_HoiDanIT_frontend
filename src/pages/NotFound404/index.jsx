import { Button, Result } from "antd"
import notFoundPic from "../../assets/images/notFoundPic.jpg"
import { Link } from "react-router-dom"

const NotFound404Page = () => {
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
        margin: "60px 0px 0px 0px"
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
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary"><Link to={"/"}>Back home</Link></Button>}
            />

        </>
    )
}
export default NotFound404Page