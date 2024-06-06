import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ButtonFile } from "./button-file";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export const StepCompleted = ({ handleClickFinish }) => {
  const router = useRouter();
  const [file, setFile] = useState({ name: "" });
  const [emptyFile, setEmptyFile] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file.name === "") {
      setEmptyFile(true);
      return;
    }
    const formData = new FormData();
    formData.append("userId", router.query.id);
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8001/tesis/create-acta", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Data uploaded successfully: ", response.data);
      handleClickFinish(false);
    } catch (error) {
      console.error("Error uploading data:", error);
      handleClickFinish(true);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Etapa final" subheader="Acta de sustentación" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: 1.5, mt: 4 }}>
              <ButtonFile
                label="Cargar acta de sustentación"
                handleFileChange={(event) => handleFileChange(event)}
                fileName={file.name}
              ></ButtonFile>
              {emptyFile && (
                <Typography variant="body2" color="error">
                  Este archivo es requerido.
                </Typography>
              )}
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained">
              Enviar
            </Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
};
