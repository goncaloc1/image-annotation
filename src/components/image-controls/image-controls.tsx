import ImageUploader from "../image-uploader/image-uploader";
import {
  StateManagerActionType,
  useStateManagerDispatch,
} from "@/state/useStateManager";

const ImageControls = () => {
  const dispatch = useStateManagerDispatch();

  return (
    <div>
      <button onClick={() => dispatch({ type: StateManagerActionType.EXPORT })}>
        Export
      </button>
      <ImageUploader
        setBase64Image={(data: string) =>
          dispatch({
            type: StateManagerActionType.SET_BASE64_IMAGE,
            payload: data,
          })
        }
      />
    </div>
  );
};

export default ImageControls;
