import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { commentOnBlog, likeBlog } from "../reducers/blogsReducer";

function BlogView() {
  const dispatch = useDispatch();

  const { id } = useParams();

  const blogs = useSelector(state => state.blogs);
  const blog = blogs.find(b => b.id === id);

  function handleLikeClicked() {
    dispatch(likeBlog(blog));
  }

  function handleCommentAdded(event) {
    event.preventDefault();
    dispatch(commentOnBlog(blog, event.target.comment.value));
    event.target.comment.value = '';
  }

  if (!blog) {
    return <div>loading...</div>;
  }

  return (
    <>
      <h2>{blog.title}</h2>
      <p>{blog.url}</p>
      <div>
        <span>{blog.likes} likes</span>
        <button onClick={handleLikeClicked}>like</button>
      </div>
      <div>added by {blog.user.name}</div>

      <h3>comments</h3>
      <form onSubmit={handleCommentAdded}>
        <input name='comment'/>
        <button>add comment</button>
      </form>
      <ul>
        {blog.comments.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </>
  );
}

export default BlogView;
