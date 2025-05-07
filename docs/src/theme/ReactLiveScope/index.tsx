import React from "react";
import {
  ImagePreview,
  ImageProvider,
  ImageUpload,
} from "@fourcels/react-image-upload";

// Add react-live imports you need here
const ReactLiveScope: unknown = {
  React,
  ...React,
  ImageUpload,
  ImagePreview,
  ImageProvider,
};

export default ReactLiveScope;
