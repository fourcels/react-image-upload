import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import styles from "./style.module.css";

export function ImageUpload() {
  const [images, setImages] = React.useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    setImages((images) => {
      return images.concat(
        acceptedFiles.map((item) => URL.createObjectURL(item))
      );
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <PhotoProvider>
      <div className={styles.ImageUpload}>
        {images.map((item, idx) => (
          <PhotoView src={item} key={idx}>
            <img
              src={item}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
          </PhotoView>
        ))}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </div>
    </PhotoProvider>
  );
}
