import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";
import { auth } from "firebase";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

//Material ui styles
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, SetOpenSignIn] = useState(false);

  console.log(db);
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({
        id : doc.id,
        post: doc.data()
        })));
      })
  }, []);
  useEffect(() => {
    const unSubscribe = auth().onAuthStateChanged((authuser) => {
      if (authuser) {
        //if user logged in
        console.log(authuser);
        setUser(authuser);
      } else {
        //or if user logged out
        setUser(null);
      }
    });
    return () => {
      //perform cleanup actions before u refire useeffect
      unSubscribe();
    };
  }, [user, username]);

  const signUp = (e) => {
    e.preventDefault();
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };
  const signIn = (event) => {
    event.preventDefault();
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    SetOpenSignIn(false);
  };
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          {/* SignUp form - when clicking on sign up*/}
          <form className="app-signup">
            <center>
              <img
                className="app-headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign up </Button>
          </form>
        </div>
      </Modal>

      {/* For Sign in form */}
      <Modal open={openSignIn} onClose={() => SetOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          {/* SignIn form - when clicking on signin */}
          <form className="app-signup">
            <center>
              <img
                className="app-headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign in </Button>
          </form>
        </div>
      </Modal>

      {/* header */}
      <div className="app-header">
        <img
          className="app-headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {/* new user signin */}
        {user ? (
          <Button onClick={() => auth().signOut()}> LogOut</Button>
        ) : (
          <div className="app-loginContainer">
            <Button onClick={() => SetOpenSignIn(true)}>Sign In </Button>
            <Button onClick={() => setOpen(true)}> Sign up</Button>
          </div>
        )}
      </div>

      {/* posts iteration */}
      <div className="app-posts">
        <div className="app-postsLeft">
          {posts.map(({id,post}) => (
            <Post
              Id={id}
              postId={id}
              user={user}
              username={post.username} 
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app-postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h1>sorry you need to login</h1>
      )}
    </div>
  );
}

export default App;
