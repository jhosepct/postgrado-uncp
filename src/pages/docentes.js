import { useCallback, useEffect, useState, useMemo } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import AddStudentModal from "src/components/add-student-modal";
import AsignTeacherModal from '../components/asign-teacher-modal';
import axios from "axios";
import { useRouter } from "next/router";
import { DocentesTable } from "src/sections/docentes/docentes-table";
import AddDocenteModal from "src/components/add-docente-modal";

const useCustomers = (page, rowsPerPage, searchQuery, data) => {
  const filteredData = useMemo(() => 
    data.filter((customer) => customer.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [searchQuery, data]
  );
  return useMemo(() => applyPagination(filteredData, page, rowsPerPage), [filteredData, page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => customers.map((customer) => customer.id), [customers]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAsigOpen, setIsModalAsigOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [studentSelect, setStudentSelect] = useState(null);

  const router = useRouter();

  const customers = useCustomers(page, rowsPerPage, searchQuery, data);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8001/docentes", { withCredentials: true });
      const data = await response.data;
      setData(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

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

  const handleCloseAddStudentModal = () => {
    setIsModalOpen(false);
    setIsEditStudentModalOpen(false);
  };

  const handleOpenAsignTeacherModal = (student) => {
    router.push(`/seguimiento/${student.id}`);
  };

  const handleCloseAsignTeacherModal = () => {
    setIsModalAsigOpen(false);
  };

  const handleAddStudent = (student) => {
    setData((prevData) => [...prevData, student]);
  };

  const handleEditStudent = (student) => {
    setData((prevData) => prevData.map((item) => (item.id === student.id ? student : item)));
  };

  const handleEditStudentSelection = (student) => {
    console.log(student);
    setIsEditStudentModalOpen(true);
    setStudentSelect(student);
    setIsModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>Docentes</title>
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
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Importar
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Exportar
                  </Button>
                </Stack>
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
            <CustomersSearch onSearch={handleSearch} />
            <DocentesTable
              count={data.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              onEditStudent={handleEditStudentSelection}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
              onAsignTeacher={handleOpenAsignTeacherModal}
            />
          </Stack>
          <AddDocenteModal
            edit={isEditStudentModalOpen}
            student={studentSelect}
            open={isModalOpen}
            onClose={handleCloseAddStudentModal}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
