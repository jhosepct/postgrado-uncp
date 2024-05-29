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
import { ButtonFile } from "./button-file";

const AsignReviewersUpdated = ({ studentId, handleClick }) => {
  const [file, setFile] = useState("");
  //Datos del estudiante
  const [student, setStudent] = useState({
    id: "",
    codeInst: "",
    name: "",
    lastname: "",
    dni: "",
    email: "",
  });

  const [docentes, setDocentes] = useState([]);

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

  const fetchDocentesTesis = async () => {
    try {
      /* const response = await axios.get(
        `http://localhost:8000/users/docentes-tesis/${studentId}`,
        {
          withCredentials: true,
        }
      );
      const data = await response.data; */
      const data = [
        {
          id: 1,
          name: "Docente 1",
          lastname: "Apellido 1",
          dni: "12345678",
          email: "dyogho14@gmail.com",
        },
        {
          id: 2,
          name: "Docente 2",
          lastname: "Apellido 2",
          dni: "12341234",
          email: "kevinjhosepct@gmail.com",
        },
        {
          id: 3,
          name: "Docente 3",
          lastname: "Apellido 3",
          dni: "12341214",
          email: "kevinjhosepct7@gmail.com",
        },
      ];
      setDocentes(data);
    } catch (err) {
      console.error("Error: expected array but got", data);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchDocentesTesis();
  }, []);

  const sendAsignation = async () => {
    //realizar la logica para pasar a la siguiente step
    handleClick();
    console.log(newAsesor);
    // try {
    //   const response = await axios.post(
    //     "http://localhost:8000/tesis/second-phase",
    //     {
    //       newAsesor,
    //     },
    //     { withCredentials: true }
    //   );
    //   console.log("Data uploaded successfully: ", response.data);
    //   console.log("Asesor asignado: ", JSON.stringify(newAsesor));
    // } catch (error) {
    //   console.error("Error fetching docentes:", error);
    // }
    resetFields();
  };

  const handleFileChange = (e) => {
    setFile(event.target.files[0]);
  };

  return (
    <Card>
      <CardHeader title="Asignación"></CardHeader>
      <CardContent>
        <div>
          <Grid>
            {docentes.map((docente, i) => {
              return (
                <div key={docente.id}>
                  <p>Revisor {i + 1}</p>
                  <div
                    style={{
                      padding: "1.5rem",
                      background: "#f2f2ff",
                      border: "1px",
                      borderRadius: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flexGrow: "5" }}>
                        <TextField
                          value={docente.name}
                          margin="dense"
                          label="Nombre"
                          color="primary"
                          type="text"
                          fullWidth
                          name="name"
                          readOnly
                        />
                      </div>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <p>Archivo: </p>
                        <ButtonFile
                          label="Agregar"
                          handleFileChange={handleFileChange}
                          fileName={file.name}
                        ></ButtonFile>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "end",
                        gap: "1rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <p>Estado: </p>
                      <Button variant="contained">Aprobado</Button>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default AsignReviewersUpdated;
