import { Label } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
export const FechaSustentacion = () => {
  const handleSubmit = () => { };
  

  return (
    <>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Fecha de sustentación" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: 1.5, mt: 4 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <DemoItem label={<Label componentName="nombre" valueType="date time" />}>
                    <DateTimePicker />
                  </DemoItem>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }} >
            <Button variant="contained">Guardar</Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
};
