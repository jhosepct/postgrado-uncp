import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";

const ComboBoxDocentes = ({ setAsesor, docentes }) => {

  const handleSelectChangeAutoComplete = (_event, newValue) => {
    if (newValue === undefined || newValue === null) {
      setAsesor({
        id: "",
        name: "",
        lastname: "",
        dni: "",
        email: "",
        grado: "",
      });
    } else {
      setAsesor(newValue);
    }
  };

  return (
    <div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={docentes}
        getOptionLabel={(option) => `${option.name} ${option.lastname}`}
        onChange={handleSelectChangeAutoComplete}
        renderInput={(params) => <TextField {...params} label="Selecciona*" />}
      />
    </div>
  );
};

export default ComboBoxDocentes;
