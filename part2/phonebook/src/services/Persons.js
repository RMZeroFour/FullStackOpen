import axios from 'axios';

const serverUrl = 'http://localhost:3001/persons';

function getAll() {
    return axios
        .get(serverUrl)
        .then(response => response.data);
}

function addNew(person) {
    return axios.post(serverUrl, person).then(response => response.data);
}

function deleteId(id) {
    return axios.delete(`${serverUrl}/${id}`);
}

function updateExisting(person) {
    return axios.put(`${serverUrl}/${person.id}`, person).then(response => response.data);
}

export default {
    getAll,
    addNew,
    deleteId,
    updateExisting
};