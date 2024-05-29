import { Button } from "@mui/material";

export const ButtonFile = ({fileName, label, handleFileChange}) => {
  return (
    <>
      <input
        accept=".pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button fullWidth variant="contained" style={{ marginTop: "15px" }} component="span">
          {label}
        </Button>

        <p style={{ margin: "0", textAlign: "end" }}>{fileName}</p>
      </label>
    </>
  );
};
