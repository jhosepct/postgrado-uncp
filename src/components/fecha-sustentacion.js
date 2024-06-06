import { useState } from "react";
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
  Box,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import { useRouter } from "next/router";
import { ButtonFile } from "./button-file";

export const FechaSustentacion = ({handleClick}) => {
  const router = useRouter();
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [emptyDate, setEmptyDate] = useState(false);
  const [file, setFile] = useState({ name: "" });
  const [emptyFile, setEmptyFile] = useState(false);
  const [place, setPlace] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file.name === "" && !selectedDateTime) {
      setEmptyDate(true);
      setTimeout(() => {
        setEmptyDate(false);
      }, 5000);
      setEmptyFile(true);
      setTimeout(() => {
        setEmptyFile(false);
      }, 5000);
      return;
    } else if (file.name === "") {
      setEmptyFile(true);
      setTimeout(() => {
        setEmptyFile(false);
      }, 5000);
      return;
    } else if (!selectedDateTime) {
      setEmptyDate(true);
      setTimeout(() => {
        setEmptyDate(false);
      }, 5000);
      return;
    }

    const formData = new FormData();

    const createSupportDate = {
      date: selectedDateTime,
      place: place,
      userId: router.query.id,
    }

    formData.append("createSupportDate", JSON.stringify(createSupportDate));
    formData.append("file", file);


    try {
      const response = await axios.post(
        "http://localhost:8001/tesis/support-date",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Data uploaded successfully: ", response.data);
      handleClick(false);
    } catch (error) {
      console.error("Error uploading data:", error);
      handleClick(true);
    }
  };

  const onHandleChangeDateTime = (date) => {
    setSelectedDateTime(date);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Card sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
        <CardHeader
          title="Fecha de Sustentación"
          titleTypographyProps={{ variant: "h6", align: "center" }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                label="Lugar de sustentación"
                placeholder="Ingrese el lugar de sustentación"
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <DemoItem label="Seleccione la fecha y hora de sustentación">
                <DateTimePicker
                  onChange={onHandleChangeDateTime}
                  renderInput={(props) => <TextField {...props} fullWidth />}
                />
              </DemoItem>
            </Grid>
            {emptyDate && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error" align="center">
                  Por favor, seleccione una fecha y hora de sustentación.
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <ButtonFile
                label="Agregar Resolución"
                handleFileChange={(event) => handleFileChange(event)}
                fileName={file.name}
              ></ButtonFile>
              {emptyFile && (
                <Typography variant="body2" color="error" align="center">
                  Este archivo es requerido.
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "center", p: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
