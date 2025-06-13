import { Dispatch, SetStateAction } from "react";
import ImageUploader from "../image-uploader/image-uploader";
import {
  StateManagementActionType,
  useStateManagementDispatch,
} from "@/state/useStateManagement";

type ImageControlsProps = {
  setBase64Image: Dispatch<SetStateAction<string | null>>;
};

const ImageControls = ({ setBase64Image }: ImageControlsProps) => {
  const dispatch = useStateManagementDispatch();

  return (
    <div>
      <button
        onClick={() => dispatch({ type: StateManagementActionType.EXPORT })}
      >
        Export
      </button>
      <ImageUploader setBase64Image={setBase64Image} />
    </div>
  );
};

export default ImageControls;
