import React, { useState, useEffect } from "react";
import {
  Box,
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
import axios from "axios";
import ComboBoxDocentes from "./combobox-docentes";

const AsignTeacher = ({ studentId, handleClick }) => {
  //Datos del estudiante
  const [student, setStudent] = useState({
    id: "",
    codeInst: "",
    name: "",
    lastname: "",
    dni: "",
    email: "",
  });

  //Datos del asesor
  const [asesor, setAsesor] = useState({
    id: "",
    name: "",
    lastname: "",
    dni: "",
    email: "",
    grado: "",
  });

  const [docentes, setDocentes] = useState([]);

  const fetchDocentes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/docentes", { withCredentials: true });
      const data = await response.data;
      if (Array.isArray(data)) {
        setDocentes(data);
      } else {
        console.error("Error: expected array but got", data);
      }
    } catch (error) {
      console.error("Error fetching docentes:", error);
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/users/${studentId}`, {
        withCredentials: true,
      });
      const data = await response.data;
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchDocentes();
  }, []);

  const sendAsignation = async () => {

    try {
      const response = await axios.post(
        "http://localhost:8000/tesis/second-phase",
        {
          docentId: asesor.id,
          userId: studentId,
        },
        { withCredentials: true }
      );
      console.log("Data uploaded successfully: ", response.data);
      handleClick(false);
    } catch (error) {
      console.error("Error fetching docentes:", error);
      handleClick(true);
    }

    //resetFields();
  };

  return (
    <Card>
      <CardHeader title="Asignación de Asesor"></CardHeader>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Grid container spacing={2}>
            {/* Primera columna */}
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                Estudiante
              </Typography>
              <TextField
                margin="dense"
                label="Nombre"
                type="text"
                fullWidth
                disabled
                name="name"
                value={student.name}
                readOnly
              />
              <TextField
                margin="dense"
                label="Apellido"
                type="text"
                disabled
                fullWidth
                name="lastName"
                value={student.lastName}
                readOnly
              />
              <TextField
                margin="dense"
                label="Codigo Institucional"
                type="text"
                fullWidth
                name="codeInst"
                disabled
                value={student.codeInts}
                readOnly
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                name="email"
                disabled
                value={student.email}
                readOnly
              />
              <TextField
                margin="dense"
                label="Teléfono"
                type="text"
                fullWidth
                name="phone"
                disabled
                value={student.phone}
                readOnly
              />
            </Grid>

            {/* Segunda columna */}
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                Asesor
              </Typography>
              {/* Combobox para seleccionar al asesor del estudiante */}
              <ComboBoxDocentes setAsesor={setAsesor} docentes={docentes} />
              <TextField
                margin="dense"
                label="Nombre"
                type="text"
                disabled
                fullWidth
                name="Nombre"
                value={asesor.name}
                readOnly
              />
              <TextField
                margin="dense"
                label="Apellido"
                type="text"
                fullWidth
                name="apellido"
                disabled
                value={asesor.lastname}
                readOnly
              />
              <TextField
                margin="dense"
                label="Dni"
                type="text"
                disabled
                fullWidth
                name="dni"
                value={asesor.dni}
                readOnly
              />
              <TextField
                margin="dense"
                label="Email"
                type="text"
                fullWidth
                name="email"
                disabled
                value={asesor.email}
                readOnly
              />
              <TextField
                margin="dense"
                disabled
                label="Grado"
                type="text"
                fullWidth
                name="grado"
                value={asesor.grado}
                readOnly
              />
            </Grid>
          </Grid>
        </div>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={sendAsignation}>
          Guardar
        </Button>
      </CardActions>
    </Card>
  );
};

export default AsignTeacher;
