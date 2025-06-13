import { Dispatch, SetStateAction } from "react";
import ImageUploader from "../image-uploader/image-uploader";
import {
  StateManagerActionType,
  useStateManagerDispatch,
} from "@/state/useStateManager";

type ImageControlsProps = {
  setBase64Image: Dispatch<SetStateAction<string | null>>;
};

const ImageControls = ({ setBase64Image }: ImageControlsProps) => {
  const dispatch = useStateManagerDispatch();

  return (
    <div>
      <button onClick={() => dispatch({ type: StateManagerActionType.EXPORT })}>
        Export
      </button>
      <ImageUploader setBase64Image={setBase64Image} />
    </div>
  );
};

export default ImageControls;
