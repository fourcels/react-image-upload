import React, { createRef, useCallback, useRef } from "react";
import { DropzoneProps, useDropzone } from "react-dropzone";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { v7 as uuidv7 } from "uuid";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
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

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDropAccepted,
    accept: { "image/*": [] },
  });

  return (
    <PhotoProvider>
      <div className="ImageUpload__root">
        <AnimatePresence mode="popLayout">
          {images.map((item, idx) => (
            <motion.div
              key={item.id}
              className="ImageUpload__item"
              style={{ height, width }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
            </motion.div>
          ))}
          {images.length < max && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              {...(getRootProps() as any)}
              className={clsx("ImageUpload__dropzone", {
                dragAccept: isDragActive && isDragAccept,
                dragReject: isDragActive && isDragReject,
              })}
              style={{ height, width }}
            >
              <input {...getInputProps()} />
              <PlusIcon />
              <div>Upload</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhotoProvider>
  );
}
