import React, { useCallback } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
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

const LoadingIcon = () => (
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
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export type ImageUploadProps = {
  width?: number;
  height?: number;
  dropzoneOptions?: DropzoneOptions;
  value?: string | ValueItem | (string | ValueItem)[];
  onChange?: (value: ImageItem[]) => void;
  max?: number;
  onUpload?: (file: File) => Promise<string>;
};

type ValueItem = {
  url: string;
  name?: string;
};

type ImageItem = {
  id: string;
  url?: string;
  name?: string;
  file?: File;
  loading?: boolean;
};

export function ImageUpload(props: ImageUploadProps) {
  const {
    width = 100,
    height = width,
    value = [],
    max = Infinity,
    onChange,
    onUpload,
    dropzoneOptions,
  } = props;

  const [images, setImages] = React.useState<ImageItem[]>(() => {
    let valueInner = value;
    if (!Array.isArray(valueInner)) {
      valueInner = [valueInner];
    }

    return valueInner.map<ImageItem>((item) => {
      if (typeof item === "string") {
        item = { url: item };
      }
      return {
        id: uuidv7(),
        loading: false,
        ...item,
      };
    });
  });

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setImages((images) => {
      images = images.concat(
        acceptedFiles.map((file) => {
          const imageItem: ImageItem = {
            id: uuidv7(),
            name: file.name,
            loading: true,
            file: file,
          };
          onUpload?.(file).then((url) =>
            setImages((images) =>
              images.map((item) => {
                if (item.id === imageItem.id) {
                  item.loading = false;
                  item.url = url;
                }
                return item;
              })
            )
          );
          return imageItem;
        })
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
    ...dropzoneOptions,
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
              {item.loading ? (
                <LoadingIcon />
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          ))}
          {images.length < max && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
