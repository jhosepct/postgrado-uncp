import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const AddTeacherModal = ({ open, onClose, onAddTeacher, edit, teacher }) => {
  const [name, setName] = useState(edit ? teacher.name : '');
  const [subject, setSubject] = useState(edit ? teacher.subject : '');

  const handleAdd = () => {
    onAddTeacher({ name, subject });
    setName('');
    setSubject('');
    onClose();
  };

  const handleEdit = () => {
    onAddTeacher({ ...teacher, name, subject });
    setName('');
    setSubject('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{edit ? 'Editar Docente' : 'Agregar Docente'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nombre"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="subject"
          label="Materia"
          type="text"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={edit ? handleEdit : handleAdd}>{edit ? 'Guardar' : 'Agregar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeacherModal;