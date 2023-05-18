async function fetchPrjList(token, page, count = 10) {
    try {
        const response = await fetch(`/api/v2/projects/list?page=${page}&limit=${count}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        } else {
            throw new Error(`Request failed: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching project list:', error);
        return null;
    }
}

async function fetchPrjDel(token,prjId) {
    try {
        const response = await fetch("/api/v2/projects/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({ _id: prjId }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.r === "ok") {
            console.log("Project deleted successfully");
        } else {
            console.log("Failed to delete project:", result.info);
        }

        return result;

    } catch (error) {
        console.error("Error while deleting project:", error);
        return null;
    }
}

async function fetchPrjDetail({
    prjId,
    token
}) {

    try {

        const response = await fetch("/api/v2/projects/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({ _id: prjId }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.r === "ok") {
            console.log("Project found successfully");
        } else {
            console.log("Failed to find project:", result.info);
        }

        return result;

    }
    catch (err) {
        console.log(err);
    }

    return null;

}

async function fetchPrjEdit(token,prj) {

    try {

        const response = await fetch("/api/v2/projects/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(prj),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.r === "ok") {
            console.log("Project updated successfully");
        } else {
            console.log("Failed to update project:", result.info);
        }

        return result;

    }
    catch (err) {
        console.log(err);
    }

    return null;

}

async function fetchPrjAdd(token,prj) {
    try {
        const response = await fetch('/api/v2/projects/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(prj),
        });

        const result = await response.json();
        if (result.r === 'ok') {
            console.log('Project added successfully');
            return result;
        } else {
            console.error('Failed to add project:', result.info);
            throw new Error(result.info);
        }
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
}


export {
    fetchPrjList,
    fetchPrjDel,
    fetchPrjDetail,
    fetchPrjEdit,
    fetchPrjAdd

}