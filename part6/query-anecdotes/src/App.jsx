import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AnecdoteForm from './components/AnecdoteForm.jsx';
import Notification from './components/Notification.jsx';
import { getAnecdotes, updateAnecdote } from './requests.js';
import { NotificationContextProvider, useNotificationDispatch } from './components/NotificationContext.jsx';

function App() {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  });

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
  });

  const notificationDispatch = useNotificationDispatch();

  if (result.isLoading) {
    return <div>loading data...</div>;
  } else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  function handleVote(anecdote) {
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });

    notificationDispatch({ type: 'SET', payload: { message: `anecdote '${anecdote.content}' voted` } });
    setTimeout(() => {
      notificationDispatch({ type: 'RESET', });
    }, 5000);
  }

  return (
    <>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
