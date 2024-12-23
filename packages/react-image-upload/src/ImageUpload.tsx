import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DropzoneOptions } from "react-dropzone";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { v7 as uuidv7 } from "uuid";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import "react-photo-view/dist/react-photo-view.css";
import "./style.css";
import { PhotoProviderProps } from "react-photo-view/dist/PhotoProvider";
import { Dropzone } from "./Dropzone";
import { use } from "motion/react-client";

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

type ImageItem = {
  id?: string;
  url?: string;
  name?: string;
  file?: File;
  loading?: boolean;
};

const defaultUpload = (file: File) => URL.createObjectURL(file);

export type ImageUploadProps = {
  width?: number;
  height?: number;
  dropzoneOptions?: DropzoneOptions;
  photoProviderProps?: Omit<PhotoProviderProps, "children">;
  value?: string | ImageItem | (string | ImageItem)[];
  onChange?: (value: ImageItem[]) => void;
  max?: number;
  onUpload?: (file: File) => string | Promise<string>;
  readonly?: boolean;
  className?: string;
  itemClassName?: string;
  dropzoneClassName?: string;
  children?: React.ReactNode;
};

export const ImageUpload = forwardRef<HTMLElement, ImageUploadProps>(
  (props, ref) => {
    const {
      width = 100,
      height = width,
      value = [],
      max = Infinity,
      onChange,
      onUpload = defaultUpload,
      readonly,
      dropzoneOptions,
      photoProviderProps,
      className,
      itemClassName,
      dropzoneClassName,
      children,
    } = props;

    const dropzoneRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => dropzoneRef.current);

    const getImages = useCallback(() => {
      let innerValue = value;
      if (!Array.isArray(innerValue)) {
        innerValue = [innerValue];
      }

      return innerValue
        .map<ImageItem>((item) => {
          if (typeof item === "string") {
            item = { url: item };
          }

          return {
            id: uuidv7(),
            ...item,
          };
        })
        .slice(0, max);
    }, [value, max]);

    const [images, setImages] = useState<ImageItem[]>(() => getImages());

    useEffect(() => {
      setImages(getImages());
    }, [getImages]);

    const onDropAccepted = useCallback(
      async (acceptedFiles: File[]) => {
        const addImages = acceptedFiles
          .slice(0, max - images.length)
          .map<ImageItem>((file) => ({
            id: uuidv7(),
            name: file.name,
            loading: true,
            file,
          }));
        const newImages = images.concat(addImages);
        setImages(newImages);
        Promise.all(
          newImages.map(async (item) => {
            item.url = await onUpload?.(item.file);
            item.loading = false;
            setImages((images) => {
              return [...images];
            });
          })
        ).then(() => onChange?.(newImages));
      },
      [images, max, onChange]
    );

    const onRemoveImage = useCallback(
      (idx: number) => {
        const newImages = images.filter((_, index) => index != idx);
        onChange?.(newImages);
        setImages(newImages);
      },
      [images, onChange]
    );

    return (
      <PhotoProvider {...photoProviderProps}>
        <div className={clsx("ImageUpload__root", className)}>
          <AnimatePresence mode="popLayout">
            {images.map((item, idx) => (
              <motion.div
                key={item.id}
                className={clsx("ImageUpload__item", itemClassName)}
                style={{ height, width }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {item.loading ? (
                  <div className="ImageUpload__loading"></div>
                ) : (
                  <>
                    <img
                      src={item.url}
                      className="ImageUpload__img"
                      alt={item.name}
                    />
                    <PhotoView src={item.url}>
                      <div
                        className="ImageUpload__preview"
                        title="Preview image"
                      >
                        <PreviewIcon />
                      </div>
                    </PhotoView>
                    {!readonly && (
                      <span
                        onClick={() => onRemoveImage(idx)}
                        className="ImageUpload__remove"
                        title="Remove image"
                      >
                        <RemoveIcon />
                      </span>
                    )}
                  </>
                )}
              </motion.div>
            ))}
            {!readonly && images.length < max && (
              <motion.div
                key="dropzone"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dropzone
                  options={{
                    onDropAccepted,
                    accept: { "image/*": [] },
                    ...dropzoneOptions,
                  }}
                  className={dropzoneClassName}
                  width={width}
                  height={height}
                  ref={dropzoneRef}
                >
                  {children}
                </Dropzone>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PhotoProvider>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
