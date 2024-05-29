import { Button, Container, Grid, Step, StepButton, Stepper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useEffect } from "react";
import AsignReviewers from "src/components/asign-reviewers";
import AsignReviewersUpdated from "src/components/asign-reviewers-update";
import AsignTeacher from "src/components/asign-teacher";
import { Expedito } from "src/components/expedito";
import { FechaSustentacion } from "src/components/fecha-sustentacion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";

const steps = [
  "Asignación de asesor",
  "Asignación de revisores",
  "Actualizar estado revisores",
  "Expedito",
  "fecha de sustentación",
];
const Page = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);

  /* useEffect(() => {
      const id = router.query.id;
      setStudentId(id);
      setLoading(false);

    //llamas al servicio:
  }, [router.query.id]); */

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const onHandleClick = () => {
    handleComplete();
  };

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <AsignTeacher studentId={router.query.id} handleClick={onHandleClick}></AsignTeacher>
          </div>
        );
      case 1:
        return (
          <div>
            <AsignReviewers
              studentId={router.query.id}
              handleClick={onHandleClick}
            ></AsignReviewers>
          </div>
        );
      case 2:
        return (
          <div>
            <AsignReviewersUpdated>
              studentId={router.query.id}
              handleClick={onHandleClick}
            </AsignReviewersUpdated>
          </div>
        );
      case 3:
        return (
          <div>
            <Grid
                xs={12}
                md={6}
                lg={8}
            >
              <Expedito></Expedito>
              </Grid>
          </div>
        );
      case 4:
        return (
          <div>
            <Grid
                xs={12}
                md={6}
                lg={8}
            >
              <FechaSustentacion></FechaSustentacion>
              </Grid>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl" >
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" /* onClick={handleStep(index)} */>{label}</StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </Fragment>
          ) : (
              <Fragment>
              <div style={{margin: "2rem 0"}}></div>  
              {renderStep(activeStep)}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
              </Box>
            </Fragment>
          )}
        </div>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
