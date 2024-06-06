import {
  Alert,
  Button,
  Container,
  Grid,
  Step,
  StepButton,
  Stepper,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import AsignReviewers from "src/components/asign-reviewers";
import AsignReviewersUpdated from "src/components/asign-reviewers-update";
import AsignTeacher from "src/components/asign-teacher";
import { Expedito } from "src/components/expedito";
import { FechaSustentacion } from "src/components/fecha-sustentacion";
import { StepCompleted } from "src/components/step-completed";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";

const Page = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [steps, setSteps] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isFinished, setFinished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchFases();
        await fetchTesisbyUser();
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTesisbyUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/tesis/user/${router.query.id}`, {
        withCredentials: true,
      });
      const data = response.data;

      if (data.acta != null) {
        console.log("Acta cargada");
        setFinished(true);
      } else {
        if (data.isFaseCompleted) {
          console.log("Fase completada", data.fase.fase);
          handleCompletePrevious(data.fase.fase);
          setActiveStep(data.fase.fase);
          //handleComplete();
        } else {
          console.log("Fase incompleta", data.fase.fase);
          handleCompletePrevious(data.fase.fase - 1);
          setActiveStep(data.fase.fase - 1);
        }
      }
    } catch (error) {
      console.error("Error fetching docentes:", error);
      setError(true);
    }
  };

  const fetchFases = async () => {
    try {
      const response = await axios.get("http://localhost:8001/fases", { withCredentials: true });
      const data = response.data;
      if (Array.isArray(data)) {
        setSteps(data);
      } else {
        console.error("Error: expected array but got", data);
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching fases:", error);
      setError(true);
    }
  };

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleStep = (step) => () => setActiveStep(step);

  const handleComplete = () => {
    const newCompleted = { ...completed, [activeStep]: true };
    setCompleted(newCompleted);
    handleNext();
  };

  const handleCompletePrevious = (index) => {
    const newCompleted = { ...completed };
    for (let i = 0; i < index; i++) {
      newCompleted[i] = true;
    }
    setCompleted(newCompleted);
  };

  const handleCompleteAll = (index) => {
    const newCompleted = {};
    for (let i = 0; i < totalSteps(index); i++) {
      newCompleted[i] = true;
    }
    setCompleted(newCompleted);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const onHandleClick = (error) => {
    if (error) {
      setError(true);
      setTimeout(() => setError(false), 5000);
    } else {
      handleComplete();
    }
  };

  const onHandleClickFinish = (error) => {
    if (error) {
      setError(true);
      setTimeout(() => setError(false), 5000);
    } else {
      setFinished(true);
    }
  };

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return <AsignTeacher studentId={router.query.id} handleClick={onHandleClick} />;
      case 1:
        return <AsignReviewers studentId={router.query.id} handleClick={onHandleClick} />;
      case 2:
        return <AsignReviewersUpdated studentId={router.query.id} handleClick={onHandleClick} />;
      case 3:
        return <Expedito handleClick={onHandleClick} />;
      case 4:
        return <FechaSustentacion handleClick={onHandleClick} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert variant="filled" severity="error">
          Ocurrió un error en el servidor
        </Alert>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          {isFinished ? (
            <div>
            <Typography variant="h4" gutterBottom>
              ¡Felicidades!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Has culminado exitosamente el proceso de tu tesis. ¡Excelente trabajo!
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Asegúrate de revisar todos los documentos y considera compartir tu logro con tus amigos y familiares.
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                // onClick={handleDownload}
              >
                Descargar Tesis
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                // onClick={handleShare}
                sx={{ ml: 2 }}
              >
                Compartir
              </Button>
            </Box>
          </div>
          ) : (
            <>
              <Stepper
                alternativeLabel={isMobile}
                nonLinear
                activeStep={activeStep}
                sx={{
                  height: isMobile ? "147px" : "max-content",
                  overflow: isMobile ? "auto" : "",
                }}
              >
                {steps.map((step, index) => (
                  <Step key={step.id} completed={completed[index]}>
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {step.name}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
              <div>
                {allStepsCompleted() ? (
                  <Fragment>
                    <StepCompleted handleClickFinish={onHandleClickFinish}></StepCompleted>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div style={{ margin: "2rem 0" }}></div>
                    {renderStep(activeStep)}
                    {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                      Next
                    </Button>
                    {activeStep !== steps.length &&
                      (completed[activeStep] ? (
                        <>
                          <Typography variant="caption" sx={{ display: "inline-block" }}>
                            Step {activeStep + 1} already completed
                          </Typography>
                        </>
                      ) : (
                        <Button onClick={handleComplete}>
                          {completedSteps() === totalSteps() - 1 ? "Finish" : "Complete Step"}
                        </Button>
                      ))}
                  </Box> */}
                  </Fragment>
                )}
              </div>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
