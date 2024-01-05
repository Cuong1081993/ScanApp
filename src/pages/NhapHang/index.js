import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, removeUserSession } from "../../utils/common";
import { Space, Card, Table, Upload, Button, Tag, message } from "antd";
import * as XLSX from "xlsx";
import App2 from "../App2";
import fileDownload from "js-file-download";
import {
  FileExcelOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { public_api } from "../../env";
import TableComponent from "../tableComponent";
import { exportFile } from "../exportFile/exportFile";

const NhapHang = (props) => {
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
      const col = Object.entries(modifiedResponse[0]).map(([key]) => {
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

  const uploadFileConfig = async () => {
    try {
      const response = await fetch(`${public_api}/app1/post-config`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const body = await response.json();

      success("Update config successfully!");
      // Handle form submission here, update user data with the form values
      getAppDetails().then((response) => {
        const col = Object.entries(response[0]).map(([key, value]) => {
          return {
            title: key,
            dataIndex: key,
            key: key,
          };
        });
        setCol(col);
        setDataTable(response);
      });
    } catch (error) {
      error("Update config failed!");
    }
  };

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
      const response = await fetch(`${public_api}/app1/get-nhaphang`, {
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

  useEffect(() => {
    if (data.length > 0) {
      uploadFileConfig();
    }
  }, [data]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
    reader.readAsBinaryString(file);
  };

  const columns =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({ title: key, dataIndex: key }))
      : [];
  const downloadConfig = async () => {
    const response = await fetch(`${public_api}/app1/download`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      responseType: "blob",
    });
    const blob = await response.blob();
    fileDownload(blob, `config.xls`);
  };
  const uploadProps = {
    onChange: handleFileUpload,
    multiple: false,
    fileList,
  };

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
      title="Nhập Hàng"
      bordered={true}
      extra={
        <div>
          <Button
            icon={<FileExcelOutlined />}
            style={{ marginRight: "18px" }}
            // onClick={downloadConfig}
            onClick={() => exportFile(clns, dataTable, "DATA NHẬP HÀNG", true)}
          >
            Export to Excel
          </Button>
          {/* 
          <Upload
            beforeUpload={(file) => {
              handleFileUpload(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} className="antd-upload-btn">
              Upload Excel File
            </Button>
          </Upload> */}
        </div>
      }
    >
      {/*{data.length > 0 && (*/}
      {/*    <Table*/}
      {/*        dataSource={data}*/}
      {/*        columns={columns}*/}
      {/*        pagination={{ pageSize: 10 }}*/}
      {/*    />*/}
      {/*)}*/}

      {contextHolder}
      {dataTable && (
        <div id={"customTable"}>
          <TableComponent
            showIndex={true}
            tableData={dataTable}
            headers={headers}
          />
        </div>
      )}
      {/* <Table
        dataSource={dataTable}
        columns={col}
        pagination={{ pageSize: 100 }}
      /> */}
    </Card>
  ) : (
    <App2 />
  );
};

export default NhapHang;
