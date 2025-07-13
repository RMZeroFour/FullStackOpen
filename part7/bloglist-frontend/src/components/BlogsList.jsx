import { Button, List, ListItem, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

function BlogsList() {
  const blogs = useSelector(state => state.blogs);

  return (
    <List component={Paper}>
      {blogs
        .toSorted((a, b) => a.likes - b.likes)
        .map(blog =>
          <ListItem key={blog.id}>
            <Button color="inherit" component={Link} to={`/blogs/${blog.id}`} sx={{ flexGrow: 1 }}>
              {blog.title}
            </Button>
          </ListItem>
        )}
    </List>
  );
}

export default BlogsList;