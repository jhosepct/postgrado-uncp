import { Alert, Snackbar } from "@mui/material";
import { useState, useRef } from "react";

export const ButtonFile = ({ fileName, label, handleFileChange, name, id, ...props }) => {
  const [dragOver, setDragOver] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const inputRef = useRef(null);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onHandleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setSnackbarMessage("Por favor, selecciona un archivo PDF.");
      setOpenSnackbar(true);
      inputRef.current.value = ""; // Limpiar el input
      return;
    }
    handleFileChange(e);
    inputRef.current.value = ""; // Limpiar el input
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type !== "application/pdf") {
      setSnackbarMessage("Por favor, arrastra y suelta un archivo PDF.");
      setOpenSnackbar(true);
      return;
    }
    handleFileChange({ target: { files: [file], name } });
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  return (
    <div>
      <input
        ref={inputRef}
        accept="application/pdf"
        style={{ display: "none" }}
        id={`raised-button-file-${id}`}
        name={name}
        type="file"
        onChange={onHandleFileChange}
        {...props}
      />
      <label htmlFor={`raised-button-file-${id}`}>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          //onClick={() => inputRef.current.click()}
          style={{
            border: "2px dashed #aaa",
            padding: "1rem",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragOver ? "#f0f0f0" : "#fff",
            transition: "background-color 0.2s ease",
          }}
        >
          <p
            style={{
              margin: "0",
              color: dragOver ? "#333" : "#aaa",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {fileName || label}
          </p>
        </div>
      </label>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
