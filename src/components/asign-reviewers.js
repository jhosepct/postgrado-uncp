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

const AsignReviewers = ({ studentId, handleClick }) => {
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

  //Datos del asesor
  const [asesor1, setAsesor1] = useState({
    id: "",
    name: "",
    lastname: "",
    dni: "",
    email: "",
    grado: "",
  });

  const [asesor2, setAsesor2] = useState({
    id: "",
    name: "",
    lastname: "",
    dni: "",
    email: "",
    grado: "",
  });

  const [asesor3, setAsesor3] = useState({
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
      const response = await axios.get("http://localhost:8001/docentes", { withCredentials: true });
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
      const response = await axios.get(`http://localhost:8001/users/${studentId}`, {
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
    // send a notification email
    /* const res = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //body: JSON.stringify(newAsesor),
    });

    
    const data = await res.json();
    console.log(data); */

    const phaseThird = {
      docentId1: asesor1.id.toString(),
      docentId2: asesor2.id.toString(),
      docentId3: asesor3.id.toString(),
      userId: studentId,
    };

    const formData = new FormData();
    formData.append("phaseThird", JSON.stringify(phaseThird));
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8001/tesis/third-phase", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Data uploaded successfully: ", response.data);
      handleClick(false);
    } catch (error) {
      handleClick(true);
      console.error("Error fetching docentes:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <Card>
      <CardHeader title="Asignación de revisores"></CardHeader>
      <CardContent>
        <div>
          <Grid>
            <p>Revisor 1</p>
            <ComboBoxDocentes setAsesor={setAsesor1} docentes={docentes} />
            <p>Revisor 2</p>
            <ComboBoxDocentes setAsesor={setAsesor2} docentes={docentes} />
            <p>Revisor 3</p>
            <ComboBoxDocentes setAsesor={setAsesor3} docentes={docentes} />
            <br />
            <ButtonFile
              label="Cargar borrador de tesis"
              handleFileChange={handleFileChange}
              fileName={file.name}
            ></ButtonFile>
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

export default AsignReviewers;
