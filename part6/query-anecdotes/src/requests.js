import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes'

function getAnecdotes() {
  return axios.get(baseUrl).then(res => res.data);
}

function createAnecdote(newAnecdote) {
  return axios.post(baseUrl, newAnecdote).then(res => res.data);
}

function updateAnecdote(changedAnecdote) {
  return axios.put(`${baseUrl}/${changedAnecdote.id}`, changedAnecdote).then(res => res.data);
}

export { getAnecdotes, createAnecdote, updateAnecdote };