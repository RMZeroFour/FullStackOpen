import { useRef } from "react";
import { Typography } from "@mui/material";
import BlogsList from "./BlogsList";
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";

function HomeView() {
  const newBlogToggleable = useRef(null);

  async function handleBlogAdded() {
    newBlogToggleable.current.toggle();
  }

  return (
    <>
      <Typography variant='h6'>
        Blogs
      </Typography>
      <BlogsList />
      <Toggleable ref={newBlogToggleable} buttonLabel='new blog'>
        <BlogForm onBlogAdd={handleBlogAdded} />
      </Toggleable>
    </>
  );
}

export default HomeView;
