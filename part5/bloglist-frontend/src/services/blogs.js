import axios from 'axios';

const baseUrl = '/api/blogs';

async function getAll() {
  const response = await axios.get(baseUrl);
  return response.data;
}

async function createNew(token, title, author, url) {
  const response = await axios.post(baseUrl, {
    title, author, url
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

async function updateExisting(blog) {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog);
  return response.data;
}

async function deleteExisting(token, id) {
  const response = await axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default { getAll, createNew, updateExisting, deleteExisting };