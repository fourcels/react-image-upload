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
};

export function Dropzone(props: DropzoneProps) {
  const { className, options } = props;
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
          dragAccept: isDragActive && isDragAccept,
          dragReject: isDragActive && isDragReject,
        }),
      })}
    >
      <input {...getInputProps()} />
      <PlusIcon />
      <div>Upload</div>
    </div>
  );
}
