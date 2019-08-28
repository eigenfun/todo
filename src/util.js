const getAuthBearer = () => {
    let token = localStorage.getItem('token')
    var bearer = `Bearer ${token}`;
    return bearer
}

const getAuthConfig = () => {
    let bearer = getAuthBearer()
    return {headers: {'authorization' : bearer }}
}

export {getAuthBearer, getAuthConfig}