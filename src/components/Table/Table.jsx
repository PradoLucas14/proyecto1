import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  IconButton,
  Modal,
  Box,
  Typography,
  TextField as MuiTextField,
  Button,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "./Table.css";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    textAlign: 'center', // Center header text
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    borderBottom: false,
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function TableComponent() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

  const theme = useTheme();

  useEffect(() => {
    fetch('https://682a5e21ab2b5004cb368b28.mockapi.io/formularios/formularios')
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((item) =>
    item.dni?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el usuario con ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://682a5e21ab2b5004cb368b28.mockapi.io/formularios/formularios/${id}`, { method: 'DELETE' })
          .then((response) => {
            if (response.ok) {
              Swal.fire('¡Eliminado!', `El usuario con ID ${id} ha sido eliminado.`, 'success');
              setData(data.filter((user) => user.id !== id));
            } else {
              Swal.fire('¡Error!', 'No se pudo eliminar el usuario.', 'error');
            }
          })
          .catch((error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('¡Error!', 'Hubo un problema al eliminar el usuario.', 'error');
          });
      }
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    Object.keys(user).forEach((key) => {
      if (key !== 'id') {
        setValue(key, user?.[key]);
      }
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    reset();
  };

const handleUpdateUser = (updatedData) => {
  if (!selectedUser?.id) return;
  fetch(`https://682a5e21ab2b5004cb368b28.mockapi.io/formularios/formularios/${selectedUser.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
  .then((response) => {
    if (response.ok) {
      Swal.fire('¡Actualizado!', 'Los datos del usuario han sido actualizados.', 'success');
      setData(data.map((user) =>
        user.id === selectedUser.id ? { ...user, ...updatedData } : user
      ));
      handleCloseEditModal();
    } else {
      Swal.fire('¡Error!', 'No se pudieron actualizar los datos del usuario.', 'error');
    }
  })
  .catch((error) => {
    console.error('Error al actualizar:', error);
    Swal.fire('¡Error!', 'Hubo un problema al actualizar los datos del usuario.', 'error');
  });
};

  return (
    <div className='Table'>
      <TextField
        label="Buscar por DNI"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: '100%', maxWidth: 400 }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="enhanced table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Acciones</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>DNI</StyledTableCell>
              <StyledTableCell>Nombre y Apellido</StyledTableCell>
              <StyledTableCell>Dirección</StyledTableCell>
              <StyledTableCell>Teléfono</StyledTableCell>
              <StyledTableCell>Nombre del padre</StyledTableCell>
              <StyledTableCell>Nombre de la madre</StyledTableCell>
              <StyledTableCell>Foto</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredData
            ).map((row) => (
              <StyledTableRow key={row.dni}>
                <TableCell padding="none">
                  <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton aria-label="edit" onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.dni}</TableCell>
                <TableCell>{row.nombreApellido}</TableCell>
                <TableCell>{row.direccion}</TableCell>
                <TableCell>{row.telefono}</TableCell>
                <TableCell>{row.nombrePadre}</TableCell>
                <TableCell>{row.nombreMadre}</TableCell>
                <TableCell>
                  <a href={row.fotoPersonalUrl} target="_blank" rel="noopener noreferrer">
                    Ver Foto
                  </a>
                </TableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={9} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 25, 50, { value: -1, label: 'Todos' }]}
        colSpan={9}
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: { 'aria-label': 'filas por página' },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* Modal de Edición */}
      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-user-modal"
        aria-describedby="modal para editar los datos del usuario"
      >
        <Box sx={modalStyle}>
          <Typography id="edit-user-modal" variant="h6" component="h2" gutterBottom>
            Editar Usuario
          </Typography>
          <form onSubmit={handleSubmit(handleUpdateUser)}>
            <MuiTextField
              fullWidth
              label="ID"
              variant="outlined"
              value={selectedUser?.id || ''}
              sx={{ mb: 2 }}
              disabled
            />
            <MuiTextField
              fullWidth
              label="DNI"
              variant="outlined"
              {...register('dni', { required: 'El DNI es obligatorio', minLength: { value: 6, message: 'El DNI debe tener al menos 6 caracteres' } })}
              error={!!errors.dni}
              helperText={errors.dni?.message}
              sx={{ mb: 2 }}
            />
            <MuiTextField
              fullWidth
              label="Nombre y Apellido"
              variant="outlined"
              {...register('nombreApellido', { required: 'El Nombre y Apellido son obligatorios', minLength: { value: 6, message: 'El Nombre y Apellido deben tener al menos 6 caracteres' } })}
              error={!!errors.nombreApellido}
              helperText={errors.nombreApellido?.message}
              sx={{ mb: 2 }}
            />
            <MuiTextField
              fullWidth
              label="Dirección"
              variant="outlined"
              {...register('direccion', { required: 'La Dirección es obligatoria', minLength: { value: 6, message: 'La Dirección debe tener al menos 6 caracteres' } })}
              error={!!errors.direccion}
              helperText={errors.direccion?.message}
              sx={{ mb: 2 }}
            />
            <MuiTextField
              fullWidth
              label="Teléfono"
              variant="outlined"
              {...register('telefono', { required: 'El Teléfono es obligatorio', minLength: { value: 6, message: 'El Teléfono debe tener al menos 6 caracteres' } })}
              error={!!errors.telefono}
              helperText={errors.telefono?.message}
              sx={{ mb: 2 }}
            />
            <MuiTextField
              fullWidth
              label="Nombre del padre"
              variant="outlined"
              {...register('nombrePadre', { required: 'El Nombre del padre es obligatorio', minLength: { value: 6, message: 'El Nombre del padre debe tener al menos 6 caracteres' } })}
              error={!!errors.nombrePadre}
              helperText={errors.nombrePadre?.message}
              sx={{ mb: 2 }}
            />
            <MuiTextField
              fullWidth
              label="Nombre de la madre"
              variant="outlined"
              {...register('nombreMadre', { required: 'El Nombre de la madre es obligatorio', minLength: { value: 6, message: 'El Nombre de la madre debe tener al menos 6 caracteres' } })}
              error={!!errors.nombreMadre}
              helperText={errors.nombreMadre?.message}
              sx={{ mb: 2 }}
            />
            <MuiTextField
              fullWidth
              label="URL de la foto personal (desde Drive)"
              variant="outlined"
              type="url"
              {...register('fotoPersonalUrl', { required: 'La URL de la foto es obligatoria', minLength: { value: 6, message: 'La URL de la foto debe tener al menos 6 caracteres' } })}
              error={!!errors.fotoPersonalUrl}
              helperText={errors.fotoPersonalUrl?.message}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Guardar Cambios
            </Button>
            <Button onClick={handleCloseEditModal} sx={{ mt: 2 }}>
              Cancelar
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default TableComponent;