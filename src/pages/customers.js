import { useCallback, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
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
import { useEffect } from "react";
import axios from "axios";

const now = new Date();

const useCustomers = (page, rowsPerPage, searchQuery, data) => {

    const filteredData = data.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return applyPagination(filteredData, page, rowsPerPage);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  //const customers = useCustomers(page, rowsPerPage, searchQuery, data);
  const [ customers, setCustomers ] = useState([]);
  //const customersIds = useCustomerIds(customers);
  const [ customersIds, setCustomersIds ] = useState([]);
  //const customersSelection = useSelection(customersIds);
  const [ customersSelection, setCustomersSelection ] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAsigOpen, setIsModalAsigOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [studentSelect, setStudentSelect] = useState(null);


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users",{withCredentials: true});
      const data = await response.data;
      setData(data);
      setCustomers(useCustomers(page, rowsPerPage, searchQuery, data));
      setCustomersIds(useCustomerIds(customers));
      setCustomersSelection(useSelection(customersIds));
    } catch (error) {
      console.error('Error fetching students:', error);
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

  const handleCloseAddStudentModal = () => {
    setIsModalOpen(false);
    setIsEditStudentModalOpen(false);
  };
  const handleOpenAsignTeacherModal = (student) => {
    setStudentSelect(student);
    setIsModalAsigOpen(true);
  }
  const handleCloseAsignTeacherModal = () => {
    setIsModalAsigOpen(false);
  }

  const handleAddStudent = (student) => {
    setData((prevData) => [...prevData, student]);
  };


  const handleEditStudent = (student) => {
    setData((prevData) => prevData.map((item) => (item.id === student.id ? student : item)));
  };

  const handleEditStudentSelection = (student) => {
    setIsEditStudentModalOpen(true);
    setStudentSelect(student);
    setIsModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>Customers | Devias Kit</title>
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
                <Typography variant="h4">Estudiantes</Typography>
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
                  Agregar estudiante
                </Button>
              </div>
            </Stack>
            <CustomersSearch onSearch={handleSearch} />
            <CustomersTable
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
          <AddStudentModal
            edit={isEditStudentModalOpen}
            student={studentSelect}
            open={isModalOpen}
            onClose={handleCloseAddStudentModal}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
          />
          <AsignTeacherModal
            open={isModalAsigOpen}
            onClose={handleCloseAsignTeacherModal}
            student={studentSelect}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
