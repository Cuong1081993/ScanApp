import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Row,
  Col,
  Form,
  Table,
  Input,
  Button,
  Space,
  Checkbox,
  Typography,
  Divider,
} from "antd";
import axios from "axios";
// import {Resizable} from 'react-resizable';
import "./index.css";
// import FilterTable from "./FilterTable";
// import ResizableTitle from "./component/ResizableTitle";
import moment from "moment";
// import Highlighter from 'react-highlight-words';
import { FilterOutlined } from "@ant-design/icons";
const dateTypeInput = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const { Text } = Typography;
const CheckboxGroup = Checkbox.Group;
dayjs.extend(utc);
const TableComponent = (props) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState(props.headers);
  const [filter, setFilter] = useState({});
  const [currentDataSource, setCurrentDataSource] = useState({});

  const [dataFilter, setDataFitler] = useState([]);

  useEffect(() => {
    didMount();
  }, []);

  useEffect(() => {
    if (tableData.length > 0) {
      const cols = setUpCols(columns);
      setColumns(cols);
    }
  }, [tableData]);

  const didMount = async () => {
    try {
      let data = setUpTableData(props.tableData);

      setTableData(data);
      setCurrentDataSource(data);

      const dataFitler = setUpDataFilter(data);
      setDataFitler(dataFitler);
    } catch (e) {
      console.log(e);
    }
  };

  const setUpDataFilter = (data) => {
    let dataFitler = {};
    data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        dataFitler[key] = [];
      });
    });
    data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        if (dataFitler[key].findIndex((item) => item.value === value) === -1) {
          dataFitler[key].push({
            text: value.toString(),
            value: value,
          });
        }
      });
    });
    return dataFitler;
  };

  const getSumValue = (data, dataIndex) => {
    if (data.length > 0) {
      let sum = 0;
      data.forEach((itemData, index) => {
        sum += itemData[dataIndex];
      });
      return sum.toLocaleString("US");
    }
  };

  const setUpCols = (columns) => {
    let cols = [];
    const columnss = [...columns];
    const count = columnss.filter((item) => item.sum).length;
    if (props.showIndex && columnss[0].dataIndex !== "index") {
      cols = [
        {
          title: "STT",
          dataIndex: "index",
          fixed: "left",
          key: "index",
          width: 50,
        },
      ].concat(columnss);
    } else {
      cols = columnss;
    }

    cols.forEach((item, index) => {
      if (props.showSum === undefined || props.showSum) {
        item.children = [
          {
            title:
              item.key === "TEN_SP" ? (
                <Text type="danger">TỔNG</Text>
              ) : item.sum ? (
                <Text type="danger">
                  {getSumValue(currentDataSource, item.dataIndex)}
                </Text>
              ) : (
                ""
              ),
            align:
              tableData.length > 0 &&
              typeof tableData[0][item.dataIndex] === "number"
                ? "right"
                : "left",
            dataIndex: item.dataIndex,
            width: item.width,
            render: (text, record) => {
              let value = null;
              if (item.sum) {
                console.log("erorr", typeof record[item.dataIndex]);
                if (record[item.dataIndex]) {
                  value = record[item.dataIndex].toLocaleString("US");
                } else {
                  value = 0;
                }
              } else if (typeof record[item.dataIndex] === "string") {
                if (item.dateType) {
                  value = dayjs(record[item.dataIndex])
                    .utc()
                    .format(item.dateType);
                  // value = moment(record[item.dataIndex], dateTypeInput).format(item.dateType)
                } else {
                  value = record[item.dataIndex];
                }
              } else {
                value = record[item.dataIndex];
              }

              return value;
            },
          },
        ];
      }

      if (item.sort) {
        switch (item.sort) {
          case "string":
            item.sorter = (a, b) =>
              a[item.dataIndex].localeCompare(b[item.dataIndex]);
            break;
          case "number":
            item.sorter = (a, b) => a[item.dataIndex] - b[item.dataIndex];
            break;
          case "date":
            item.sorter = (a, b) => {
              const dateA = moment(
                a[item.dataIndex],
                "YYYY-MM-DDTHH:mm:ss.SSSZ"
              );
              const dateB = moment(
                b[item.dataIndex],
                "YYYY-MM-DDTHH:mm:ss.SSSZ"
              );
              return dateA - dateB;
            };
            break;
          default:
            break;
        }
      }

      if (item.filter) {
        let dataFilter = [];
        currentDataSource.forEach((itemData, index) => {
          if (!dataFilter.includes(itemData[item.dataIndex])) {
            dataFilter.push(itemData[item.dataIndex]);
          }
        });
        cols[index] = {
          ...item,
        };
      }
    });

    return cols;
  };

  const setUpTableData = (data) => {
    if (props.showIndex) {
      data.forEach((item, index) => {
        item.index = index + 1;
      });
    }
    data.forEach((item, index) => {
      item.key = index;
    });

    // const result = addSumaryRow(data)
    // console.log(props.headers)
    return data;
  };

  // const addSumaryRow = (data) => {
  //     const headers = props.headers
  //     const headerSum = headers.filter((item) => item.sum)
  //
  //     let summary = [{
  //         index: 'Tổng',
  //         key: 'sum',
  //     }]
  //     headerSum.forEach((item) => {
  //         summary[0][item.dataIndex] = getSumValue(data, item.dataIndex)
  //     })
  //
  //     const result = summary.concat(data)
  //     return result
  // }

  // const handleResize = (index) => (e, {size}) => {
  //     const nextColumns = [...columns];
  //     nextColumns[index] = {
  //         ...nextColumns[index], width: size.width,
  //     };
  //     setColumns(nextColumns);
  // };

  // const components = {
  //     header: {
  //         cell: ResizableTitle,
  //     },
  // };
  //
  useEffect(() => {
    // const filterTableData = addSumaryRow(currentDataSource.filter((item) => item.key !== "sum"))
    // setfilterTableData(currentDataSource)

    if (tableData.length > 0) {
      const cols = setUpCols(columns);
      setColumns(cols);
    }
  }, [filter]);

  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentDataSource(extra.currentDataSource);
    setDataFitler(setUpDataFilter(extra.currentDataSource));
    if (Object.entries(filters).length > 0) {
      setFilter(filters);
    }
  };
  const [state, setState] = useState({});
  const cols = useMemo(() => {
    return setUpCols(columns).map((col) => {
      if (col.dateType) {
        return {
          ...col,
          render(_, record) {
            console.log(record[col.dataIndex]);
            return (
              <span>
                {record[col.dataIndex]
                  ? dayjs(record[col.dataIndex]).utc().format(col.dateType)
                  : // ? moment(record[col.dataIndex]).format(col.dateType)
                    null}
              </span>
            );
          },
        };
      }

      return col;
    });
  }, []);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({ ...state, [dataIndex]: selectedKeys });
  };

  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters();
    setState({ ...state, [dataIndex]: [] });
    confirm();
  };
  const options = useCallback(
    (col) => {
      const result = tableData
        .filter((item) => {
          const cloneState = { ...state };
          // delete cloneState[col.dataIndex];
          let checkItem = true;
          Object.keys(cloneState).forEach((s) => {
            if (cloneState[s].length && !cloneState[s]?.includes(item[s])) {
              checkItem = false;
            }
          });
          return checkItem;
        })
        .map((record) => {
          return {
            value: record[col.dataIndex],
            label: col.dateType
              ? dayjs(record[col.dataIndex]).utc().format(col.dateType)
              : // ? moment(record[col.dataIndex]).format(col.dateType)
                record[col.dataIndex],
          };
        })
        .filter((value, index, self) => {
          const indexFound = self.findIndex((i) => i.value === value.value);
          return (
            indexFound === index &&
            value.value != undefined &&
            value.value?.toString()?.trim()
          );
        });
      return result?.concat([{ label: "(Blanks)", value: "blank" }]);
    },

    [state, tableData]
  );
  const paginations = props.paginations + 180 || 200;
  return (
    <Table
      // components={components}
      // columns={columns.map((col, index) => ({
      //     ...col,
      //     onHeaderCell: (column) => ({
      //         width: column.width,
      //         onResize: handleResize(index),
      //     }),
      // }))}

      className="Table-List"
      scroll={{ y: `calc(100vh - ${paginations}px)` }}
      size="small"
      columns={cols.map((col) => {
        if (!col.filterDropdown) return col;
        return {
          ...col,
          filterDropdown: {
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          },
          onFilter: (value, record) => {
            if (value === "blank") {
              return !record[col.dataIndex]?.toString()?.trim();
            }
            if (typeof value === "string") {
              return (
                record[col.dataIndex]?.toLowerCase() === value?.toLowerCase()
              );
            }
            if (!Number.isNaN(record[col.dataIndex])) {
              return record[col.dataIndex] === value;
            }
          },
          filterIcon: (filtered) => (
            <FilterOutlined
              style={{ color: filtered ? "#1890ff" : undefined }}
            />
          ),
        };
      })}
      onChange={onChange}
      dataSource={tableData}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            if (props.onClickRow) {
              props.onClickRow(record, rowIndex);
            }
          }, // click row
        };
      }}
      pagination={false}
    />
  );
};

export default TableComponent;
