import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, createTheme, ThemeProvider, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import "./Form.css"

// Creación de un tema oscuro personalizado
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3', // Un azul brillante para el botón principal
    },
    text: {
      primary: '#fff',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
      marginBottom: '16px',
      color: '#fff', // Título en color blanco
      textAlign: 'center',
    },
    body2: {
      color: '#bdbdbd',
      textAlign: 'center',
      marginBottom: '16px', // Aumentar el margen inferior para compensar la eliminación del link
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Eliminar border-radius de los inputs
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo semitransparente para los inputs
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 0, // Eliminar border-radius del borde
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2196f3',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2196f3',
          },
        },
        input: {
          color: '#fff',
          padding: '14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#bdbdbd',
          '&.Mui-focused': {
            color: '#2196f3',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Eliminar border-radius del botón
          padding: '12px 24px',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#2196f3',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1976d2',
          },
        },
        outlined: {
          borderColor: '#bdbdbd',
          color: '#bdbdbd',
          borderRadius: 0, // Eliminar border-radius del botón secundario
          '&:hover': {
            borderColor: '#fff',
            color: '#fff',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#f44336',
        },
      },
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: 0, // Eliminar border-radius del contenedor
  maxWidth: 'md',
  backgroundImage: `url(https://optimism.com.ar/wp-content/uploads/2021/08/5669466540_5d37a321d5_b.jpg)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Capa oscura semitransparente
    borderRadius: 0, // Eliminar border-radius de la capa oscura
  },
  zIndex: 0, // Asegurar que la capa oscura esté detrás del contenido
  color: '#fff', // Color de texto predeterminado dentro del contenedor
}));

const StyledForm = styled('form')(({ theme }) => ({
  position: 'relative', // Para que el contenido esté sobre la capa oscura
  zIndex: 1,
  width: '100%',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: '#fff',
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

// Eliminamos StyledLink ya que el texto "¿Ya eres miembro?" se va a eliminar

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://682a5e21ab2b5004cb368b28.mockapi.io/formularios/formularios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Formulario enviado!',
          text: 'Los datos se han guardado correctamente.',
          background: darkTheme.palette.background.paper,
          color: darkTheme.palette.text.primary,
        });
        reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Hubo un problema al enviar los datos.',
          background: darkTheme.palette.background.paper,
          color: darkTheme.palette.text.primary,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '¡Error de conexión!',
        text: 'No se pudo conectar con el servidor.',
        background: darkTheme.palette.background.paper,
        color: darkTheme.palette.text.primary,
      });
      console.error('Hubo un error al comunicarse con la API simulada:', error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme} className="">
      <StyledTypography variant="h4" className='formtitulo'>
          Cargar nuevo afiliado.
      </StyledTypography>
      <StyledContainer>
        <StyledTypography variant="body2" color="textSecondary" align="center" gutterBottom>
          {/* Se elimina el texto "¿Ya eres miembro?" y el enlace */}
        </StyledTypography>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DNI"
                variant="outlined"
                autoComplete="off"
                {...register('dni', { required: 'El DNI es obligatorio', minLength: { value: 6, message: 'El DNI debe tener al menos 6 caracteres' } })}
                error={!!errors.dni}
                helperText={errors.dni?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre y Apellido"
                variant="outlined"
                autoComplete="off"
                {...register('nombreApellido', { required: 'El Nombre y Apellido son obligatorios', minLength: { value: 6, message: 'El Nombre y Apellido deben tener al menos 6 caracteres' } })}
                error={!!errors.nombreApellido}
                helperText={errors.nombreApellido?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                variant="outlined"
                autoComplete="off"
                {...register('direccion', { required: 'La Dirección es obligatoria', minLength: { value: 6, message: 'La Dirección debe tener al menos 6 caracteres' } })}
                error={!!errors.direccion}
                helperText={errors.direccion?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                variant="outlined"
                autoComplete="off"
                {...register('telefono', { required: 'El Teléfono es obligatorio', minLength: { value: 6, message: 'El Teléfono debe tener al menos 6 caracteres' } })}
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del padre"
                variant="outlined"
                autoComplete="off"
                {...register('nombrePadre', { required: 'El Nombre del padre es obligatorio', minLength: { value: 6, message: 'El Nombre del padre debe tener al menos 6 caracteres' } })}
                error={!!errors.nombrePadre}
                helperText={errors.nombrePadre?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la madre"
                variant="outlined"
                autoComplete="off"
                {...register('nombreMadre', { required: 'El Nombre de la madre es obligatorio', minLength: { value: 6, message: 'El Nombre de la madre debe tener al menos 6 caracteres' } })}
                error={!!errors.nombreMadre}
                helperText={errors.nombreMadre?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la foto personal (desde Drive)"
                variant="outlined"
                type="url"
                autoComplete="off"
                {...register('fotoPersonalUrl', { required: 'La URL de la foto es obligatoria', minLength: { value: 6, message: 'La URL de la foto debe tener al menos 6 caracteres' } })}
                error={!!errors.fotoPersonalUrl}
                helperText={errors.fotoPersonalUrl?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Box mt={3} display="flex" justifyContent="flex-end"> {/* Se alinea el botón a la derecha */}
                {/* Se elimina el botón "Cambiar método" */}
                <Button type="submit" variant="containedPrimary">
                  Cargar Afiliado
                </Button>
              </Box>
            </Grid>
          </Grid>
        </StyledForm>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default Form;