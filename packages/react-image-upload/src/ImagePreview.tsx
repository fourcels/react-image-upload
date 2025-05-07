import clsx from "clsx";
import { v7 as uuidv7 } from "uuid";
import { useEffect, useState } from "react";
import { PhotoProviderProps } from "react-photo-view/dist/PhotoProvider";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { ImageItem, PreviewIcon, ValueType } from "./ImageUpload";
import { useImageContext } from "./ImageContext";

export type ImagePreviewProps = {
  width?: number;
  height?: number;
  photoProviderProps?: Omit<PhotoProviderProps, "children">;
  value?: ValueType;
  placeholder?: ValueType;
  className?: string;
  itemClassName?: string;
};

export const ImagePreview = (props: ImagePreviewProps) => {
  const {
    width = 100,
    height = width,
    value,
    placeholder,
    photoProviderProps,
    className,
    itemClassName,
  } = props;

  const [images, setImages] = useState<ImageItem[]>([]);
  const { placeholder: placeholderContext } = useImageContext();

  useEffect(() => {
    let newImages = valueToImages(value, placeholder ?? placeholderContext);
    setImages(newImages);
  }, [value, placeholder, placeholderContext]);

  return (
    <PhotoProvider {...photoProviderProps}>
      <div className={clsx("ImageUpload__root", className)}>
        {images.map((item) => (
          <div
            key={item.id}
            className={clsx("ImageUpload__item", itemClassName)}
            style={{ height, width }}
          >
            <img src={item.url} className="ImageUpload__img" alt={item.name} />
            <PhotoView src={item.url}>
              <div className="ImageUpload__preview" title="Preview image">
                <PreviewIcon />
              </div>
            </PhotoView>
          </div>
        ))}
      </div>
    </PhotoProvider>
  );
};

function valueToImages(value?: ValueType, placeholder?: ValueType) {
  let innerValue: ValueType = [];
  if (value) {
    innerValue = value;
    if (!Array.isArray(innerValue)) {
      innerValue = [innerValue];
    }
  }
  if (innerValue.length === 0 && placeholder) {
    innerValue = placeholder;
    if (!Array.isArray(innerValue)) {
      innerValue = [innerValue];
    }
  }

  return innerValue.map<ImageItem>((item) => {
    if (typeof item === "string") {
      item = { url: item };
    }

    return {
      id: uuidv7(),
      ...item,
    };
  });
}
