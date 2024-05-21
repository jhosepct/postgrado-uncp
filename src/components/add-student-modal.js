import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const AddStudentModal = ({ open, onClose, onAddStudent, onEditStudent, edit, student }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dni, setDni] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [codeInst, setCodeInst] = useState("");
  const [nameFile, setNameFile] = useState("");

  useEffect(() => {
    console.log("edit", edit);
    console.log("student", student);
    if (edit && student) {
      setName(student.name);
      setLastName(student.lastName);
      setGender(student.gender);
      setCodeInst(student.codeInst);
      setEmail(student.email);
      setPhone(student.phone);
      setAddress(student.address.street);
      setDni(student.dni);
    } else {
      // Reset fields for adding new student
      setName("");
      setLastName("");
      setGender("");
      setCodeInst("");
      setEmail("");
      setPhone("");
      setAddress("");
      setDni("");
    }
  }, [edit, student]);

  const handleAddStudent = () => {
    const newStudent = {
      id: student ? student.id : Math.random().toString(36).substr(2, 9), // Generar un ID temporal si no existe
      name,
      lastName,
      gender,
      codeInst,
      email,
      phone,
      address: {
        street: address,
        city: "N/A",
        state: "N/A",
        country: "N/A",
      },
      dni,
    };

  

    if (edit) {
      onEditStudent(newStudent);
    } else {
      onAddStudent(newStudent);
    }

    onClose();
  };

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleFileChange = (event) => {
    setNameFile(event.target.files[0].name);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{edit ? "Editar Estudiante" : "Agregar Estudiante"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Apellidos"
          type="text"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Codigo Institucional"
          type="text"
          fullWidth
          value={codeInst}
          onChange={(e) => setCodeInst(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Teléfono"
          type="text"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Dirección"
          type="text"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          margin="dense"
          label="DNI"
          type="text"
          fullWidth
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />

        <FormControl variant="filled" fullWidth>
          <InputLabel id="demo-simple-select-filled-label">Genero</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={gender}
            onChange={handleChange}
          >
            <MenuItem value={"male"}>Masculino</MenuItem>
            <MenuItem value={"female"}>Femenino</MenuItem>
          </Select>
        </FormControl>
        {!edit ? (
          <>
            <input
              accept="image/*"
              style={{ display: "none"}}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button fullWidth variant="contained" style={{marginTop: "15px"}} component="span">
                Cargar plan de tesis
              </Button>
              
            <p style={{margin: '0', textAlign: 'end'}}>{nameFile}</p>
            </label>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAddStudent} color="primary">
          {edit ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentModal;
