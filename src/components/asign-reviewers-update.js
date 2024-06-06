import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ButtonFile } from "./button-file";

const AsignReviewersUpdated = ({ handleClick, studentId }) => {
  const [files, setFiles] = useState({});

  const [missingFiles, setMissingFiles] = useState({});

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [docentes, setDocentes] = useState([]);

  const fetchDocentesTesis = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/tesis/reviewers/${studentId}`, {
        withCredentials: true,
      });
      const data = await response.data;
      setDocentes(data);
    } catch (err) {
      console.error("Error: expected array but got");
    }
  };

  useEffect(() => {
    fetchDocentesTesis();
  }, []);

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    const name = event.target.name;
    const data = {
      name: newFile.name,
      file: newFile,
    };

    setFiles({ ...files, [name]: data });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const sendAsignation = async () => {
    let missing = {};
    docentes.forEach((docente) => {
      if (!files[docente.id]) {
        missing[docente.id] = true;
      }
    });
    setMissingFiles(missing);
    if (Object.keys(missing).length > 0) {
      setSnackbarMessage("Por favor, carga todos los archivos requeridos.");
      setOpenSnackbar(true);
    } else {
      console.log(files);
      const phaseFourthArray = Object.entries(files).map(([key, value]) => {
        return {
          docentId: key,
          file: value.file,
        };
      });
      const formData = new FormData();

      phaseFourthArray.forEach((item) => {
        formData.append(`files`, item.file);
        formData.append(`docents`, item.docentId);
      });
      formData.append("userId", studentId);

      try {
        const response = await axios.post("http://localhost:8001/tesis/fourth-phase", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log("Data uploaded successfully: ", response.data);
        handleClick(false);
      } catch (error) {
        console.error("Error uploading data:", error);
        handleClick(true);
      }
    }
  };

  return (
    <Card>
      <CardHeader title="Asignación"></CardHeader>
      <CardContent>
        <Grid container spacing={3}>
          {docentes.map((docente, i) => (
            <Grid item xs={12} key={docente.id}>
              <Card
                variant="outlined"
                sx={{ padding: "1.5rem", background: "#fff", borderRadius: "20px" }}
              >
                <Typography variant="h6" gutterBottom>
                  Revisor {i + 1}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <TextField
                      value={`${docente.name ?? ""} ${docente.lastname ?? ""}`}
                      margin="dense"
                      label="Nombre"
                      color="primary"
                      type="text"
                      fullWidth
                      name="name"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ButtonFile
                      label="Agregar"
                      name={docente.id}
                      id={docente.id}
                      handleFileChange={(event) => handleFileChange(event)}
                      fileName={
                        files[docente.id] ? files[docente.id].name : "No se ha seleccionado archivo"
                      }
                    />
                    {missingFiles[docente.id] && (
                      <Typography variant="body2" color="error">
                        Este archivo es requerido.
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{ marginTop: "1rem" }}
                >
                  <Grid item>
                    <Typography variant="body1">Estado: </Typography>
                  </Grid>
                  <Grid item>
                    <Button variant="contained">Aprobado</Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={sendAsignation}>
          Guardar
        </Button>
      </CardActions>
    </Card>
  );
};

export default AsignReviewersUpdated;
