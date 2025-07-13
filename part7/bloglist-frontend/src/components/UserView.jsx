import { useSelector } from "react-redux";
import { useParams } from "react-router";

function UserView() {
  const { id } = useParams();

  const users = useSelector(state => state.users);
  const user = users.find(u => u.id === id);

  if (!user) {
    return <div>loading...</div>;
  }

  return (
    <>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </>
  );
}

export default UserView;
