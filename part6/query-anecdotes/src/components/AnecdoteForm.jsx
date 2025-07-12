import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationDispatch } from "./NotificationContext.jsx";
import { createAnecdote } from "../requests.js";

function AnecdoteForm() {
  const queryClient = useQueryClient();

  const notificationDispatch = useNotificationDispatch();

  const newMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
    onError: (error) => {
      notificationDispatch({ type: 'SET', payload: { message: error.response.data.error } });
      setTimeout(() => {
        notificationDispatch({ type: 'RESET', });
      }, 5000);
    }
  });

  function onCreate(event) {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    console.log('new anecdote');
    newMutation.mutate({ content, votes: 0 });

    notificationDispatch({ type: 'SET', payload: { message: `anecdote '${content}' created` } });
    setTimeout(() => {
      notificationDispatch({ type: 'RESET', });
    }, 5000);
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  );
}

export default AnecdoteForm;
