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

type DropzoneProps = {
  dropzoneOptions?: DropzoneOptions;
  dropzoneClassName?: string;
  width?: number;
  height?: number;
};

export function Dropzone(props: DropzoneProps) {
  const { width, height, dropzoneOptions, dropzoneClassName } = props;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone(dropzoneOptions);

  return (
    <div
      {...getRootProps({
        className: clsx("ImageUpload__dropzone", dropzoneClassName, {
          dragAccept: isDragActive && isDragAccept,
          dragReject: isDragActive && isDragReject,
        }),
        style: {
          height,
          width,
        },
      })}
    >
      <input {...getInputProps()} />
      <PlusIcon />
      <div>Upload</div>
    </div>
  );
}
