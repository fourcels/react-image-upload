import { DropzoneOptions, useDropzone } from "react-dropzone";
import clsx from "clsx";

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

export type DropzoneProps = {
  options?: DropzoneOptions;
  className?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
};

export const Dropzone = (props: DropzoneProps) => {
  const { className, options, children, width, height } = props;
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone(options);

  return (
    <div
      {...getRootProps({
        className: clsx("ImageUpload__dropzone", className, {
          "ImageUpload__dropzone-default": !children,
          dragAccept: isDragActive && isDragAccept,
          dragReject: isDragActive && isDragReject,
        }),
        style: {
          width,
          height,
        },
      })}
    >
      <input {...getInputProps()} />
      {children || (
        <>
          <PlusIcon />
          <div>Upload</div>
        </>
      )}
    </div>
  );
};
