import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { useTable } from "react-table";

const DynamicTable = ({ specifications, setSpecifications }) => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState(specifications || []);
  const [isEditingHeader, setIsEditingHeader] = useState(null);
  const [headerInput, setHeaderInput] = useState("");

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const addColumn = () => {
    const newCol = `col${columns.length + 1}`;
    setColumns([
      ...columns,
      { Header: `Spesifikasi ${columns.length + 1}`, accessor: newCol },
    ]);
    setData(data.map((row) => ({ ...row, [newCol]: "" })));
  };

  const handleDeleteColumn = (colIndex) => {
    if (colIndex < 0 || colIndex >= columns.length) return;

    const columnToDelete = columns[colIndex].accessor;

    const updatedColumns = columns.filter((_, index) => index !== colIndex);

    const updatedData = data.map((row) => {
      const { [columnToDelete]: _, ...rest } = row; // Hapus properti kolom yang sesuai
      return rest;
    });

    setColumns(updatedColumns);
    setData(updatedData);
  };

  const addRow = () => {
    const newRow = {}; // Initialize an empty object for the new row
    columns.forEach((column) => {
      newRow[column.accessor] = ""; // Set each column's value to an empty string
    });
    setData([...data, newRow]);
  };

  // Inisialisasi data dengan nilai default dari specifications
  useEffect(() => {
    if (specifications.length > 0) {
      const dynamicColumns = Object.keys(specifications[0]).map((key) => ({
        Header: key,
        accessor: key,
      }));
      setColumns(dynamicColumns);
      setData(specifications);
    } else if (columns.length === 0 && data.length === 0) {
      // Jika kolom dan data kosong, set kolom dan data default
      const defaultColumn = {
        Header: "Spesifikasi 1",
        accessor: "spesifikasi1",
      };
      setColumns([defaultColumn]);
      setData([{ spesifikasi1: "" }]); // Baris default
    }
  }, [specifications]);

  useEffect(() => {
    setSpecifications(data);
  }, [data]);

  const handleCellChange = (rowIndex, colId, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][colId] = value;
    setData(updatedData);
  };

  const handleHeaderEditStart = (index, currentHeader) => {
    setIsEditingHeader(index);
    setHeaderInput(currentHeader);
  };

  const handleHeaderEditSave = (index) => {
    const newHeader = headerInput.trim();

    if (!newHeader) {
      alert("Header tidak boleh kosong.");
      return;
    }

    if (columns.some((col, i) => col.Header === newHeader && i !== index)) {
      alert("Header tidak boleh duplikat.");
      return;
    }

    // Perbarui hanya Header, tanpa mengubah accessor
    const updatedColumns = [...columns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      Header: newHeader,
    };

    setColumns(updatedColumns);
    setIsEditingHeader(null);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
  };

  return (
    <Paper>
      <TableContainer>
        <Table {...getTableProps()} style={{ border: "0.2px solid #ccc" }}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={`header-${headerGroup.id}`} // Menggunakan kombinasi 'header-' dan id
                style={{ borderBottom: "0.2px solid #ccc" }}
              >
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    {...column.getHeaderProps()}
                    key={`header-${column.id}`} // Menggunakan kombinasi 'header-' dan id kolom
                    style={{ border: "0.2px solid #ccc", height: "3rem" }}
                  >
                    {isEditingHeader === index ? (
                      <TextField
                        value={headerInput} // Pastikan headerInput sudah diatur dengan benar
                        onChange={(e) => setHeaderInput(e.target.value)}
                        onBlur={() => handleHeaderEditSave(index)} // Menyimpan perubahan saat kehilangan fokus
                        autoFocus
                      />
                    ) : (
                      <Box
                        onClick={() =>
                          handleHeaderEditStart(index, column.render("Header"))
                        }
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignContent: "center",
                          flex: 1,
                        }}
                      >
                        {column.render("Header")}
                        {index > -1 && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation(); // Mencegah klik pada tombol "Hapus" untuk memanggil onClick header
                              handleDeleteColumn(index); // Menghapus kolom tanpa konfirmasi
                            }}
                            sx={{
                              color: "black",
                              minWidth: "unset",
                              padding: 0,
                            }}
                          >
                            Hapus
                          </Button>
                        )}
                      </Box>
                    )}
                  </TableCell>
                ))}

                <TableCell style={{ border: "0.2px solid #ccc" }}>
                  Aksi
                </TableCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody
            {...getTableBodyProps()}
            style={{ border: "0.2px solid #ccc" }}
          >
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  key={`row-${row.id}`} // Menggunakan kombinasi 'row-' dan id baris
                  style={{ borderBottom: "0.2px solid #ccc" }}
                >
                  {row.cells.map((cell) => (
                    <TableCell
                      {...cell.getCellProps()}
                      key={`cell-${cell.column.id}-${rowIndex}`} // Menggunakan kombinasi 'cell-', id kolom, dan indeks baris
                      style={{ border: "0.2px solid #ccc" }}
                    >
                      <TextField
                        value={cell.value || ""}
                        onChange={(e) =>
                          handleCellChange(
                            rowIndex,
                            cell.column.id,
                            e.target.value
                          )
                        }
                        margin="dense"
                        label="Spesifikasi"
                        fullWidth
                        autoFocus
                      />
                    </TableCell>
                  ))}
                  <TableCell style={{ border: "0.2px solid #ccc" }}>
                    <Button
                      sx={{ color: "black" }}
                      onClick={() => handleDeleteRow(rowIndex)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        sx={{
          backgroundColor: "white",
          color: "#555",
          borderColor: "#999",
          mt: 1,
          mr: 1,
        }}
        onClick={addColumn}
      >
        Tambah Kolom
      </Button>
      <Button
        variant="outlined"
        sx={{
          backgroundColor: "white",
          color: "#555",
          borderColor: "#999",
          mt: 1,
        }}
        onClick={addRow}
      >
        Tambah Baris
      </Button>
    </Paper>
  );
};

export default DynamicTable;
