import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  Typography,
} from "@mui/material";
import axios from "axios";
import { ButtonFile } from "./button-file";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  lastName: Yup.string().required("Los apellidos son obligatorios"),
  gender: Yup.string().required("El género es obligatorio"),
  codeInts: Yup.string().required("El código institucional es obligatorio"),
  email: Yup.string().email("Formato de correo electrónico inválido").required("El email es obligatorio"),
  phone: Yup.string().required("El teléfono es obligatorio"),
  dni: Yup.string().required("El DNI es obligatorio"),
});

const AddStudentModal = ({ open, onClose, onAddStudent, onEditStudent, edit, student }) => {
  const [emptyFile, setEmptyFile] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      name: edit ? student.name : "",
      lastName: edit ? student.lastName : "",
      gender: edit ? student.gender : "",
      codeInts: edit ? student.codeInts : "",
      email: edit ? student.email : "",
      phone: edit ? student.phone : "",
      dni: edit ? student.dni : "", 
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("first");
      console.log(values);
      const formData = new FormData();
      formData.append("user", JSON.stringify(values));
      formData.append("file", values.file);


      try {
        const response = await axios.post("http://localhost:8001/tesis/first-phase", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log("File uploaded successfully:", response.data);
        
        onAddStudent(response.data.user);
  
        onClose();
      } catch (error) {
        console.error("Error uploading file:", error);
      }

      
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("file", event.target.files[0]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{edit ? "Editar Estudiante" : "Agregar Estudiante"}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            margin="dense"
            label="Apellidos"
            type="text"
            fullWidth
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            margin="dense"
            label="Codigo Institucional"
            type="text"
            fullWidth
            name="codeInts"
            value={formik.values.codeInts}
            onChange={formik.handleChange}
            error={formik.touched.codeInts && Boolean(formik.errors.codeInts)}
            helperText={formik.touched.codeInts && formik.errors.codeInts}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            type="text"
            fullWidth
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            margin="dense"
            label="DNI"
            type="text"
            fullWidth
            name="dni"
            value={formik.values.dni}
            onChange={formik.handleChange}
            error={formik.touched.dni && Boolean(formik.errors.dni)}
            helperText={formik.touched.dni && formik.errors.dni}
          />
          <FormControl variant="filled" fullWidth>
            <InputLabel id="demo-simple-select-filled-label">Genero</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
            >
              <MenuItem value={"male"}>Masculino</MenuItem>
              <MenuItem value={"female"}>Femenino</MenuItem>
            </Select>
          </FormControl>
          {!edit ? (
            <>
              <ButtonFile
                label="Cargar plan de tesis"
                handleFileChange={handleFileChange}
                fileName={formik.values.file ? formik.values.file.name : ""}
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            {edit ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddStudentModal;
