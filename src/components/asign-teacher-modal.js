import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select,
  TextField
} from '@mui/material';
import axios from 'axios';
import ComboBoxDocentes from './combobox-docentes';

const AsignTeacherModal = ({ open, onClose, student}) => {

  //Datos del estudiante
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [codeInst, setCodeInst] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");


  //Datos del asesor
  const [idAsesor, setIdAsesor] = useState("");
  const [nameAsesor, setNameAsesor] = useState("");
  const [lastNameAsesor, setLastNameAsesor] = useState("");
  const [emailAsesor, setEmailAsesor] = useState("");
  const [dniAsesor, setDniAsesor] = useState("");
  const [gradeAsesor, setGradeAsesor] = useState("");


  const resetFields = () => {
    setName("");
    setLastName("");
    setCodeInst("");
    setEmail("");
    setPhone("");
    setNameAsesor("");
    setLastNameAsesor("");
    setEmailAsesor("");
    setDniAsesor("");
    setGradeAsesor("");
  };

  useEffect(() => {
    if (student) {
      setName(student.name);
      setLastName(student.lastName);
      setCodeInst(student.codeInts);
      setEmail(student.email);
      setPhone(student.phone);
    } else {
      // Reset fields for adding new student
     resetFields();
    }
  }, [student]);

  const sendAsignation = async () => {
    const newAsesor = {
      userId: student.id,
      docenteId: idAsesor
    };
    try {
      const response = await axios.post('http://localhost:8000/tesis/second-phase', {
        newAsesor
      },{withCredentials: true});
      console.log("Data uploaded successfully: ", response.data);
      console.log("Asesor asignado: ", JSON.stringify(newAsesor));

    } catch (error) {
      console.error('Error fetching docentes:', error);
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={() => {onClose(); resetFields();}}>
      <DialogTitle>{"Asignación de Asesor"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
            {/* Primera columna */}
            <Grid item xs={6}>
              <DialogTitle>{"Estudiante"}</DialogTitle>
              <TextField
                margin="dense"
                label="Nombre"
                type="text"
                fullWidth
                name="name"
                value={student && student.name ? student.name : ""}
              />
              <TextField
                margin="dense"
                label="Apellido"
                type="text"
                fullWidth
                name="lastName"
                value={student && student.lastName ? student.lastName : ""}
              />
              <TextField
                margin="dense"
                label="Codigo Institucional"
                type="text"
                fullWidth
                name="codeInst"
                value={student && student.codeInts ? student.codeInts : ""}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                name="email"
                value={student && student.email ? student.email : ""}
              />
              <TextField
                margin="dense"
                label="Grado"
                type="text"
                fullWidth
                name="phone"
                value={student && student.phone ? student.phone : ""}
              />
            </Grid>

            {/* Segunda columna */}
            <Grid item xs={6}>
              <DialogTitle>{"Asesor"}</DialogTitle>
              {/* Combobox para seleccionar al asesor del estudiante */}
              <ComboBoxDocentes
                setIdAsesor={setIdAsesor}
                setNameAsesor={setNameAsesor}
                setLastNameAsesor={setLastNameAsesor}
                setDniAsesor={setDniAsesor}
                setEmailAsesor={setEmailAsesor}
                setGradeAsesor={setGradeAsesor}
              />
              <TextField
                margin="dense"
                label="Nombre"
                type="text"
                fullWidth
                name="Nombre"
                value={nameAsesor}

              />
              <TextField
                margin="dense"
                label="Apellido"
                type="text"
                fullWidth
                name="apellido"
                value={lastNameAsesor}
              />
              <TextField
                margin="dense"
                label="Dni"
                type="text"
                fullWidth
                name="dni"
                value={dniAsesor}
              />
              <TextField
                margin="dense"
                label="Email"
                type="text"
                fullWidth
                name="email"
                value={emailAsesor}
              />
              <TextField
                margin="dense"
                label="Grado"
                type="text"
                fullWidth
                name="grado"
                value={gradeAsesor}
              />
            </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {onClose(); resetFields();}} color="primary">
          Cancelar
        </Button>
        <Button onClick={sendAsignation} color="primary">
          {"Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignTeacherModal;
