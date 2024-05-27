import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import axios from 'axios';

const ComboBoxDocentes = ({ setIdAsesor, setNameAsesor, setLastNameAsesor,setDniAsesor, setEmailAsesor, setGradeAsesor }) => {
  const [docentes, setDocentes] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState();
  const fetchDocentes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/docentes',{withCredentials: true});
      const data = await response.data;
      if (Array.isArray(data)) {
        setDocentes(data);
      } else {
        console.error('Error: expected array but got', data);
      }} catch (error) {
      console.error('Error fetching docentes:', error);
    }
  };
  useEffect(() => {
    fetchDocentes();
  }, [selectedDocente]);

  const getDocenteById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/docentes/${id}`,{withCredentials: true});
      const data = await response.data;
      setNameAsesor(data.name);
      setLastNameAsesor(data.lastname);
      setDniAsesor(data.dni);
      setEmailAsesor(data.email);
      setGradeAsesor(data.grado);
    } catch (error) {
      setNameAsesor('');
      setLastNameAsesor('');
      setDniAsesor('');
      setEmailAsesor('');
      setGradeAsesor('');
      console.error('Error fetching docente:', error);
    }
  }


  const handleSelectChange = async (event) => {
    const selectedId = event.target.value;
    setIdAsesor(selectedId);
    setSelectedDocente(selectedId);
    if (selectedId) {
      await getDocenteById(selectedId);
    }else {
      setNameAsesor('');
      setLastNameAsesor('');
      setDniAsesor('');
      setEmailAsesor('');
      setGradeAsesor('');
    }
  };

  return (
    <div>
      {/* Combobox para seleccionar el rol del estudiante */}
      <TextField
        fullWidth
        label="Selecciona"
        name="asesor"
        onChange={handleSelectChange}
        required
        select
        value={selectedDocente}
        SelectProps={{ native: true }} // Para que el combobox se vea como un select nativo
      >
        <option value="">
        </option>
        {docentes && docentes.map((docente) => (
          <option key={docente.id} value={docente.id}>
            {docente.name} {docente.lastname}
          </option>
        ))}
      </TextField>

    </div>
  );
};

export default ComboBoxDocentes;
