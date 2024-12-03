import React, { createRef, useCallback, useRef } from "react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { v7 as uuidv7 } from "uuid";
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
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
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
  value?: string | ValueItem | (string | ValueItem)[];
  onChange?: (value: ImageItem[]) => void;
  max?: number;
};

type ValueItem = {
  url: string;
  name?: string;
};

type ImageItem = {
  id: string;
  url: string;
  name?: string;
  nodeRef: React.RefObject<HTMLDivElement>;
};

export function ImageUpload(props: ImageUploadProps) {
  const {
    width = 100,
    height = width,
    value,
    max = Infinity,
    onChange,
    dropzoneProps,
  } = props;

  const [images, setImages] = React.useState<ImageItem[]>(() => {
    let valueInner: (string | ValueItem)[] = [];
    if (!value) {
      valueInner = [];
    } else if (Array.isArray(value)) {
      valueInner = value;
    } else {
      valueInner = [value];
    }
    return valueInner.map<ImageItem>((item) => {
      if (typeof item === "string") {
        return {
          id: uuidv7(),
          nodeRef: createRef(),
          url: item,
        };
      } else {
        return {
          id: uuidv7(),
          nodeRef: createRef(),
          ...item,
        };
      }
    });
  });

  const dropzoneRef = useRef<HTMLDivElement>();

  const onDropAccepted = useCallback((acceptedFiles) => {
    setImages((images) => {
      images = images.concat(
        acceptedFiles.map((item) => ({
          id: uuidv7(),
          url: URL.createObjectURL(item),
          name: item.name,
          nodeRef: createRef(),
        }))
      );
      onChange?.(images);
      return images;
    });
  }, []);

  const onRemoveImage = useCallback((idx: number) => {
    setImages((images) => {
      images = images.filter((_, index) => index != idx);
      onChange?.(images);
      return images;
    });
  }, []);

  return (
    <PhotoProvider>
      <TransitionGroup className="ImageUpload__root">
        {images.map((item, idx) => (
          <CSSTransition
            nodeRef={item.nodeRef}
            key={item.id}
            timeout={200}
            classNames="ImageUpload__fade"
          >
            <div
              ref={item.nodeRef}
              className="ImageUpload__item"
              style={{ height, width }}
            >
              <img
                src={item.url}
                className="ImageUpload__img"
                alt={item.name}
              />
              <PhotoView src={item.url}>
                <div className="ImageUpload__preview" title="Preview image">
                  <PreviewIcon />
                </div>
              </PhotoView>
              <span
                onClick={() => onRemoveImage(idx)}
                className="ImageUpload__remove"
                title="Remove image"
              >
                <RemoveIcon />
              </span>
            </div>
          </CSSTransition>
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
            <CSSTransition
              nodeRef={dropzoneRef}
              timeout={200}
              classNames="ImageUpload__fade"
            >
              <div
                ref={dropzoneRef}
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
            </CSSTransition>
          )}
        </Dropzone>
      </TransitionGroup>
    </PhotoProvider>
  );
}
