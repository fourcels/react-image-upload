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

type ValueItem = {
  url: string;
  name?: string;
};

type ValueType = string | ValueItem | (string | ValueItem)[];

type ImageItem = {
  id: string;
  url?: string;
  name?: string;
  file?: File;
  loading?: boolean;
};

const checkValue = (a: ValueType, b: ValueType) => {
  return a === b || JSON.stringify(a) === JSON.stringify(b);
};

const defaultUpload = (file: File) => URL.createObjectURL(file);
const defaultTransform = (images: ImageItem[], max: number): ValueType => {
  const value = images.map((item) => item.url);
  if (max === 1) {
    return value.join(",");
  }
  return value;
};

export type ImageUploadProps = {
  width?: number;
  height?: number;
  dropzoneOptions?: DropzoneOptions;
  photoProviderProps?: Omit<PhotoProviderProps, "children">;
  value?: ValueType;
  onChange?: (value: ValueType) => void;
  transform?: (value: ImageItem[], max: number) => ValueType;
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
      value,
      max = Infinity,
      onChange,
      onUpload = defaultUpload,
      transform = defaultTransform,
      readonly,
      dropzoneOptions,
      photoProviderProps,
      className,
      itemClassName,
      dropzoneClassName,
      children,
    } = props;

    const valueRef = useRef<ValueType>();
    const dropzoneRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => dropzoneRef.current);

    const [images, setImages] = useState<ImageItem[]>([]);

    useEffect(() => {
      if (checkValue(valueRef.current, value)) {
        return;
      }
      let newImages = [];
      if (value) {
        let innerValue = value;
        if (!Array.isArray(innerValue)) {
          innerValue = [innerValue];
        }

        newImages = innerValue
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
      }
      valueRef.current = value;
      setImages(newImages);
    }, [value, max]);

    const onChangeInner = useCallback(
      (images: ImageItem[]) => {
        valueRef.current = transform?.(images, max);
        onChange?.(valueRef.current);
      },
      [transform, onChange, max]
    );

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
          addImages.map(async (item) => {
            item.url = await onUpload?.(item.file);
            item.loading = false;
            setImages((images) => {
              return [...images];
            });
          })
        ).then(() => onChangeInner(newImages));
      },
      [images, max, onChange]
    );

    const onRemoveImage = useCallback(
      (idx: number) => {
        const newImages = images.filter((_, index) => index != idx);
        onChangeInner(newImages);
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
