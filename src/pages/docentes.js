import { useCallback, useState } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import TeachersTable  from "src/sections/docentes/teachersTable";
import { TeachersSearch } from "src/sections/docentes/teachersSearch";
import AddTeacherModal from "src/components/AddTeacherModal";
import axios from "axios";
import { useEffect } from "react";

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
  const [teacherSelect, setTeacherSelect] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/docentes",{withCredentials: true});
      const data = await response.data;
      setData(data);
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleCloseAddTeacherModal = () => {
    setIsModalOpen(false);
    setIsEditTeacherModalOpen(false);
  };

  const handleAddTeacher = (teacher) => {
    setData((prevData) => [...prevData, teacher]);
  };

  const handleEditTeacher = (teacher) => {
    setData((prevData) => prevData.map((item) => (item.id === teacher.id ? teacher : item)));
  };

  const handleEditTeacherSelection = (teacher) => {
    setIsEditTeacherModalOpen(true);
    setTeacherSelect(teacher);
    setIsModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>Docentes | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Docentes</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => setIsModalOpen(true)}
                >
                  Agregar docente
                </Button>
              </div>
            </Stack>
            <TeachersSearch onSearch={handleSearch} />
            <TeachersTable
              count={data.length}
              items={teachers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              onEditTeacher={handleEditTeacherSelection}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
          <AddTeacherModal
            edit={isEditTeacherModalOpen}
            teacher={teacherSelect}
            open={isModalOpen}
            onClose={handleCloseAddTeacherModal}
            onAddTeacher={handleAddTeacher}
            onEditTeacher={handleEditTeacher}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;