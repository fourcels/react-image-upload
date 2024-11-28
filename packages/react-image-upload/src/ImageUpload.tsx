import React, { useCallback } from "react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import { PhotoProvider, PhotoView } from "react-photo-view";
import clsx from "clsx";
import "react-photo-view/dist/react-photo-view.css";
import "./style.css";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const RemoveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const PreviewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export type ImageUploadProps = {
  width?: number;
  height?: number;
  dropzoneProps?: DropzoneProps;
};

export function ImageUpload(props: ImageUploadProps) {
  const { width = 100, height = 100, dropzoneProps } = props;
  const [images, setImages] = React.useState([""]);
  const onDropAccepted = useCallback((acceptedFiles) => {
    setImages((images) => {
      return images.concat(
        acceptedFiles.map((item) => URL.createObjectURL(item))
      );
    });
  }, []);

  const onRemoveImage = useCallback((idx: number) => {
    setImages((images) => {
      return images.filter((_, index) => index != idx);
    });
  }, []);

  return (
    <PhotoProvider>
      <div className="ImageUpload__root">
        {images.map((item, idx) => (
          <div
            key={item}
            className="ImageUpload__item"
            style={{ height, width }}
          >
            <img src={item} className="ImageUpload__img" />
            <div className="ImageUpload__actions">
              <PhotoView src={item}>
                <span
                  className="ImageUpload__actions_btn"
                  title="Preview image"
                >
                  <PreviewIcon />
                </span>
              </PhotoView>
              <span
                onClick={() => onRemoveImage(idx)}
                className="ImageUpload__actions_btn"
                title="Remove image"
              >
                <RemoveIcon />
              </span>
            </div>
          </div>
        ))}
        <Dropzone
          onDropAccepted={onDropAccepted}
          accept={{ "image/*": [] }}
          {...dropzoneProps}
        >
          {({
            getRootProps,
            getInputProps,
            isDragAccept,
            isDragReject,
            isDragActive,
          }) => (
            <div
              {...getRootProps()}
              className={clsx("ImageUpload__dropzone", {
                dragAccept: isDragActive && isDragAccept,
                dragReject: isDragActive && isDragReject,
              })}
              style={{ height, width }}
            >
              <input {...getInputProps()} />
              <PlusIcon />
              <div>Upload</div>
            </div>
          )}
        </Dropzone>
      </div>
    </PhotoProvider>
  );
}
