import { Dispatch, SetStateAction } from "react";
import ImageUploader from "../image-uploader/image-uploader";

type ImageControlsProps = {
  setBase64Image: Dispatch<SetStateAction<string | null>>;
  setExportTrigger: Dispatch<SetStateAction<number>>;
};

const ImageControls = ({
  setBase64Image,
  setExportTrigger,
}: ImageControlsProps) => {
  return (
    <div>
      <button onClick={() => setExportTrigger((value) => value + 1)}>
        Export
      </button>
      <ImageUploader setBase64Image={setBase64Image} />
    </div>
  );
};

export default ImageControls;
