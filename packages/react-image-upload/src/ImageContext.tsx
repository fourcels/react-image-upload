import { createContext, useContext } from "react";
import { ValueType } from "./ImageUpload";

type ImageContextType = {
  placeholder?: ValueType;
};

const ImageContext = createContext<ImageContextType>({});

type ImageProviderProps = ImageContextType & {
  children: React.ReactNode;
};

export function ImageProvider({ children, ...rest }: ImageProviderProps) {
  return <ImageContext.Provider value={rest}>{children}</ImageContext.Provider>;
}

export const useImageContext = () => useContext(ImageContext);
