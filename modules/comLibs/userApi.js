async function fetchUserList(page, limit) {
    try {
        const response = await fetch(`/api/v2/users/list?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/text',
                'authorization': localStorage.getItem('jwt_token')
            }
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            // Process the response data as needed
            return res;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            // return null;
        }
    } catch (error) {
        console.error(`Fetch error: ${error}`);

    }
    return null;
}

async function deleteUser(option) {
    try {
        const response = await fetch('/api/v2/users/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwt_token')
            },
            body: JSON.stringify({option})
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            return res;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }

    return null;
}

async function getUser({ userId }) {

    try {
        const response = await fetch('/api/v2/users/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwt_token')
            },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            return res;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }

    return null;
}

async function updateUser(userData) {

    try {
        const response = await fetch('/api/v2/users/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwt_token')
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            return res;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }

    return null;
}

async function addUser(userData) {

    try {
        const response = await fetch('/api/v2/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwt_token')
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            return res;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }

    return null;
}

export {
    fetchUserList,
    deleteUser,
    getUser,
    updateUser,
    addUser
}