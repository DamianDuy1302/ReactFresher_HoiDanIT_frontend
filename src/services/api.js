import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
    return axios.post("/api/v1/user/register", {
        "fullName": fullName,
        "email": email,
        "password": password,
        "phone": phone,
    })
}

export const callLogin = (email, password) => {
    return axios.post("/api/v1/auth/login", {
        "username": email,
        "password": password,
    })
}

export const callFetchAccount = () => {
    return axios.get("/api/v1/auth/account")
}

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}

export const getUsers = (query) => {
    return axios.get(`/api/v1/user?${query}`)
}

export const addUser = (fullName, password, email, phone) => {
    return axios.post(`/api/v1/user`, {
        fullName: fullName,
        password: password,
        email: email,
        phone: phone
    })
}
export const importUsers = (data) => {
    return axios.post(`/api/v1/user/bulk-create`, data)
}

export const updateUser = (_id, fullName, phone) => {
    return axios.put(`/api/v1/user`, {
        _id: _id,
        fullName: fullName,
        phone: phone
    })
}

export const deleteUser = (id) => {
    return axios.delete(`/api/v1/user/${id}`)
}



/////////////Book/////////////
export const getBooks = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const getBooksCategory = () => {
    return axios.get(`/api/v1/database/category`)
}

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

export const addBook = (obj) => {
    return axios.post(`/api/v1/book`, {
        "thumbnail": obj.thumbnail,
        "slider": obj.slider,
        "mainText": obj.mainText,
        "author": obj.author,
        "price": obj.price,
        "sold": obj.sold,
        "quantity": obj.quantity,
        "category": obj.category
    })
}

export const updateBook = (id, obj) => {
    return axios.put(`/api/v1/book/${id}`, {
        "thumbnail": obj.thumbnail,
        "slider": obj.slider,
        "mainText": obj.mainText,
        "author": obj.author,
        "price": obj.price,
        "sold": obj.sold,
        "quantity": obj.quantity,
        "category": obj.category
    })
}

export const deleteBook = (id) => {
    return axios.delete(`/api/v1/book/${id}`)
}


export const getBookDetailById = (id) => {
    return axios.get(`/api/v1/book/${id}`)
}


export const callPlaceOrder = (data) => {
    return axios.post('/api/v1/order', {
        ...data
    })
}

export const getOrderHistory = () => {
    return axios.get('/api/v1/history')
}


export const uploadAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append("fileImg", fileImg)

    return axios.post({
        method: "post",
        url: '/api/v1/file/upload',
        data: bodyFormData,
        header: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar"
        }
    })
}

export const updateUserInfo = (_id, phone, fullName, avatar) => {
    return axios.put(`/api/v1/user`, {
        _id: _id,
        phone: phone,
        fullName: fullName,
        avatar: avatar,
    })
}

export const updatePassword = (email, oldPassword, newPassword) => {
    return axios.post(`/api/v1/user/change-password`, {
        email: email,
        oldpass: oldPassword,
        newpass: newPassword,
    })
}

export const callFetchDashBoard = () => {
    return axios.get('/api/v1/database/dashboard')
}

export const callFetchOrderWithPaginate = (current, pageSize) => {
    return axios.get(`/api/v1/order?current=${current}&pageSize=${pageSize}`)
}

