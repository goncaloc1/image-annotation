type ImageUploaderProps = {
  setBase64Image: (base64Image: string) => void;
};

const ImageUploader = ({ setBase64Image }: ImageUploaderProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64Image(reader.result as string); // base64 string
      };
      reader.readAsDataURL(file); // convert file to Base64
    }
  };

  return (
    <label className="button" style={{ marginRight: "32px" }}>
      Upload Image
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </label>
  );
};

export default ImageUploader;
