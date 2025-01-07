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

    // Hapus kolom dari daftar kolom
    const updatedColumns = columns.filter((_, index) => index !== colIndex);

    // Hapus data dari semua baris yang terkait dengan kolom yang dihapus
    const updatedData = data.map((row) => {
      const { [columnToDelete]: _, ...rest } = row; // Hilangkan kolom yang dihapus
      return rest;
    });

    setColumns(updatedColumns);
    setData(updatedData);
  };

  const addRow = () => {
    const newRow = {};
    columns.forEach((column) => {
      newRow[column.accessor] = "";
    });
    setData([...data, newRow]);
  };

  useEffect(() => {
    if (specifications && specifications.length > 0) {
      const dynamicColumns = Object.keys(specifications[0]).map((key) => ({
        Header: key,
        accessor: key,
      }));
      setColumns(dynamicColumns);
      setData(specifications);
    } else if (columns.length === 0 && data.length === 0) {
      const defaultColumn = {
        Header: "Spesifikasi 1",
        accessor: "spesifikasi1",
      };
      setColumns([defaultColumn]);
      setData([{ spesifikasi1: "" }]);
    }
  }, [specifications]);

  useEffect(() => {
    setSpecifications(data);
  }, [data]);

  const handleCellChange = (rowIndex, colId, value) => {
    const updatedData = [...data];
    if (updatedData[rowIndex]) {
      updatedData[rowIndex][colId] = value;
    }
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
    if (rowIndex < 0 || rowIndex >= data.length) return;

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
                key={`header-group-${headerGroup.id}`}
                style={{ borderBottom: "0.2px solid #ccc" }}
              >
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    {...column.getHeaderProps()}
                    key={`header-cell-${column.id}`}
                    style={{ border: "0.2px solid #ccc", height: "3rem" }}
                  >
                    {isEditingHeader === index ? (
                      <TextField
                        value={headerInput}
                        onChange={(e) => setHeaderInput(e.target.value)}
                        onBlur={() => handleHeaderEditSave(index)}
                        autoFocus
                      />
                    ) : (
                      <Box
                        onClick={() =>
                          handleHeaderEditStart(index, column.Header)
                        }
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {column.Header}
                        {index > 0 && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation(); // Hindari trigger edit saat menghapus
                              handleDeleteColumn(index);
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
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  key={`row-${rowIndex}`}
                  style={{ borderBottom: "0.2px solid #ccc" }}
                >
                  {row.cells.map((cell) => (
                    <TableCell
                      {...cell.getCellProps()}
                      key={`cell-${rowIndex}-${cell.column.id}`}
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

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "white",
            color: "#555",
            borderColor: "#999",
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
          }}
          onClick={addRow}
        >
          Tambah Baris
        </Button>
      </Box>
    </Paper>
  );
};

export default DynamicTable;
