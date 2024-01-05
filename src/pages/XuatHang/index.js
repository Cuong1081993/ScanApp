import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, removeUserSession } from "../../utils/common";
import { Card, Button, message } from "antd";
import App2 from "../App2";
import { exportFile } from "../exportFile/exportFile";
import { FileExcelOutlined } from "@ant-design/icons";
import { public_api } from "../../env";
import TableComponent from "../tableComponent";

const XuatHang = (props) => {
  const history = useNavigate();
  const user = getUser();
  const [messageApi, contextHolder] = message.useMessage();
  const [col, setCol] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [data, setData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const token = getToken();
  const success = (text) => {
    messageApi.open({
      type: "success",
      content: text,
    });
  };
  const error = (text) => {
    messageApi.open({
      type: "error",
      content: text,
    });
  };

  // handle click event of logout button
  useEffect(() => {
    getAppDetails().then((response) => {
      const modifiedResponse = response.map((row) => {
        const filteredRow = Object.fromEntries(
          Object.entries(row).filter(
            ([key]) => key !== "__v" && key !== "userId" && key !== "_id"
          )
        );
        return filteredRow;
      });
      const col = Object.entries(modifiedResponse[0]).map(([key, value]) => {
        return {
          title: key,
          dataIndex: key,
          key: key,
        };
      });
      setCol(col);
      setDataTable(response);
    });
  }, []);

  // const handleEdit = async (value) => {
  //   setVisible(true)
  //   setModalData(value)
  // }
  //
  //
  // const handleEditEmail = async (value) => {
  //   setVisibleEmail(true)
  //   setModalEmailData(value.email)
  // }

  // const cancelModal = () => {
  //   setVisible(false)
  // }
  //
  // const cancelModalEmail = () => {
  //   setVisibleEmail(false)
  // }

  // const handleDelete = async (id) => {
  //   const response = await fetch(`http://localhost:3000/app/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       Authorization: 'Bearer ' + token,
  //     },
  //   });
  //   const body = await response.json();
  //   getAppDetails().then(response => {
  //     setDataTable(response)
  //
  //   });
  //   return body;
  // }

  const getAppDetails = async () => {
    try {
      const response = await fetch(`${public_api}/app1/get-xuathang`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const body = await response.json();
      if (body.error) {
        setRegistered(false);
      } else {
        setRegistered(true);
        return body.data;
      }
    } catch (e) {}
  };
  // const downloadConfig = async () => {
  //   const response = await fetch(`${public_api}/app1/download`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //     responseType: "blob",
  //   });
  //   const blob = await response.blob();
  //   fileDownload(blob, `config.xls`);
  // };
  const headers = [
    {
      title: "order",
      dataIndex: "order",
      key: "order",
      width: 150,
      filterDropdown: true,
      sort: "string",
    },
    {
      title: "pallet",
      dataIndex: "pallet",
      key: "pallet",
      width: 150,
      filterDropdown: true,
      sort: "string",
    },
    {
      title: "barcode",
      dataIndex: "barcode",
      key: "barcode",
      width: 250,
      filterDropdown: true,
      sort: "string",
    },
    {
      title: "nameProduct",
      dataIndex: "nameProduct",
      key: "nameProduct",
      width: 150,
      filterDropdown: true,
      sort: "string",
    },
    {
      title: "Khối Lượng",
      dataIndex: "weightCode",
      key: "weightCode",
      width: 70,
      filterDropdown: true,
      sort: "number",
      sum: true,
    },
  ];
  const clns = [
    "STT",
    "order",
    "pallet",
    "barcode",
    "nameProduct",
    "weightCode",
  ];

  return registered ? (
    <Card
      title="Xuất Hàng"
      bordered={true}
      extra={
        <div>
          <Button
            icon={<FileExcelOutlined />}
            style={{ marginRight: "18px" }}
            //onClick={downloadConfig}
            onClick={() => exportFile(clns, dataTable, "DATA XUẤT HÀNG", true)}
          >
            Export to Excel
          </Button>
        </div>
      }
    >
      {contextHolder}
      {dataTable && (
        <div id={"customTable"}>
          <TableComponent
            showIndex={true}
            headers={headers}
            tableData={dataTable || []}
          />
        </div>
      )}
    </Card>
  ) : (
    <App2 />
  );
};

export default XuatHang;
