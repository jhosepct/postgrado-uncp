import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    onEditStudent = () => {},
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>NOMBRE</TableCell>
                <TableCell>CORREO</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>CELULAR</TableCell>
                {/* <TableCell>FECHA</TableCell> */}
                <TableCell>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                /* const createdAt = format(customer.createdAt, "dd/MM/yyyy"); */

                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar
                          src={
                            customer.gender == "male"
                              ? "/assets/avatars/avatar-alcides-antonio.png"
                              : "/assets/avatars/avatar-iulia-albu.png"
                          }
                        >
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">{customer.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.dni}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    {/* <TableCell>{createdAt}</TableCell> */}
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Button
                          color="primary"
                          size="small"
                          variant="contained"
                          onClick={() => onEditStudent(customer)}
                        >
                          Edit
                        </Button>
                        <Checkbox
                          {...label}
                          color="primary"
                          icon={<AddCircleIcon />}
                          checkedIcon={<AddCircleIcon />}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: '#6366f1',
                            },
                            '&.Mui-checked .MuiSvgIcon-root': {
                              color: '#6366f1',
                            },
                          }}
                        />
                        {/* <Button color="secondary" size="small" variant="contained">
                          Delete
                        </Button> */}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
