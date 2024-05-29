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

export const Expedito = () => {
  const handleSubmit = () => {};

  return (
    <>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader  title="Expedito" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: 1.5, mt: 4 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    helperText="Please specify the first name"
                    label="First name"
                    name="firstName"
                    //onChange={handleChange}
                    required
                    //value={values.firstName}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained">Save details</Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
};
