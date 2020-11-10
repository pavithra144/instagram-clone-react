import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase";
import './ImageUpload.css'

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      //selecting the first file we chose, avoiding the multiple selection of files
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshotOne) => {
        //progress for post when upoading
        const progress = Math.round(
          (snapshotOne.bytesTransferred / snapshotOne.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //error func
        console.log(error.message);
        alert(error.message);
      },
      () => {
        //completing func => storing images in db path 'images'
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageupload">
      <progress className="imageupload-progress" value={progress} max="100" />
      <input
        type="text"
        value={caption}
        placeholder="Enter Caption..."
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};
export default ImageUpload;
