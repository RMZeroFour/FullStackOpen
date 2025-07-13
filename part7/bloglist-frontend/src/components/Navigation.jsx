import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../reducers/loginReducer";
import { Link } from "react-router";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function Navigation() {
  const dispatch = useDispatch();
  const login = useSelector(state => state.login);

  function handleLogoutClicked() {
    window.localStorage.removeItem('loggedInUser');
    dispatch(logOut());
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        <Button color="inherit" onClick={handleLogoutClicked}>
          Log Out
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography component='div'>
          {login.name} logged in
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
