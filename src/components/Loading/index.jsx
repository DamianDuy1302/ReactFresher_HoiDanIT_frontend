import PacmanLoader from "react-spinners/PacmanLoader";


const Loading = () => {
    const style = { 
        position: "fixed", 
        top: "45%", left: "50%", 
        transform: "translate(-50%, -50%)" 
    };
    return (
        <>
            <div>
                <PacmanLoader color="#005b96" style={style}/>
            </div>
        </>

    )
}
export default Loading