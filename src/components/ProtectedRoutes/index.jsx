import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import NotFound404Page from "../../pages/NotFound404"
import NotAuthorized from "../../pages/NotAuthorized"


const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith("/admin")
    const user = useSelector(state => state.account.user)
    const userRole = user.role
    // console.log(userRole)
    if (isAdminRoute && userRole === "ADMIN") {
        return (<>{props.children}</>)
    }
    else {
        return (<NotAuthorized />)
    }
}

const ProtectedRoutes = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated)
    console.log(isAuthenticated)
    return (
        <>
            {isAuthenticated === true ? (
                <>
                    <RoleBaseRoute>
                        {props.children}
                    </RoleBaseRoute>

                </>
            ) : (
                <>
                    {/* <Navigate to={"/login"} /> */}
                </>

            )}
        </>
    )
}
export default ProtectedRoutes