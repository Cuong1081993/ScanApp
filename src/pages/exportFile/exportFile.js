
import ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import dayjs from 'dayjs';
const editData = (data) => data?.forEach((e, index) => e['STT'] = index + 1)
const totalRow = (data) => {
	const keyOfElement = Object.keys(data[0]);
	const total = {};
	const firstElement = data[0];
	const typeNumber = keyOfElement.map(e => typeof firstElement[e] === 'number');
	typeNumber.forEach((e, i) => total[keyOfElement[i]] = e ? 0 : '');
	const totalCol = (data, keyOfElement) => {
		let sum = 0;
		data.forEach((e, i) => {
			sum = sum + e[keyOfElement];
		})
		return sum;
	}
	for (let i = 0; i < keyOfElement.length; i++) {
		total[keyOfElement[i]] = typeNumber[i] && keyOfElement[i]!=='ID' && keyOfElement[i]!=='ID_IBT'  ? totalCol(data, keyOfElement[i]) : '';
	}
	data.unshift(total);
	return data;
}
export const exportFile = async (clns, data, a, tolal ) => {
	let data1 = [...data];
	if (tolal) {totalRow(data1);}
	editData(data1);
	const wb = new ExcelJS.Workbook();
	const ws = wb.addWorksheet(`sheet`);
	const mapping = {
		MA_SP: 'Mã hàng',
		TEN_SP: 'Tên hàng',
		SL_TONDAU: 'SL tồn đầu',
		KL_TONDAU: 'KL tồn đầu',
		SL_NHAP: 'SL nhập',
		KL_NHAP: 'KL nhập',
		SL_XUAT: 'SL xuất',
		KL_XUAT: 'KL xuất',
		SL_TONKHO: 'SL tồn cuối',
		KHOI_LUONG: 'KL tồn cuối',
		SO_CONT: 'Cont',
		NGHIEP_VU: 'Nghiệp vụ',
		THOI_GIAN: 'Thời gian',
		BKS: 'Biển kiểm soát',
		TEN_KH: 'Khách mua/bán',
		GHI_CHU: 'Ghi chú',
		ID_IBT: 'Đơn hàng',
		TEN_PLT: 'Tên pallet',
		NGAY_NHAP: 'Ngày nhập',
		ID: 'Mã hàng',
		order: 'order',
		pallet: 'pallet',
		barcode: 'barcode',
		nameProduct:'nameProduct',
		weightCode:'weightCode',

	};

	const modifiedData = clns.map((item) => mapping[item] || item);
	ws.addRow(modifiedData);

	data1?.map((i, index) => {
		return ws.addRow([
			...clns.map((cln) => {
				if (cln === 'STT') {
					if (index === 0) {
						return '';
					} else {
						return i[cln] - 1;
					}
				} else if (cln === 'NSX' || cln === 'HSD' || cln === 'NGAY_NHAP') {
					return i[cln] ? dayjs(i[cln]).format('DD-MM-YYYY') : '';
				} else if (cln === 'THOI_GIAN') {
					return i[cln] ? dayjs(i[cln]).utc().format('DD-MM-YYYY HH:mm') : '';
				} else if (
					[
						'SL_TONDAU',
						'KL_TONDAU',
						'SL_NHAP',
						'KL_NHAP',
						'SL_XUAT',
						'KL_XUAT',
						'SL_TONKHO',
						'KHOI_LUONG',
					].includes(cln)
				) {
					return i[cln]//1// Number(i[cln]).toLocaleString('en-US');
				} else {
					return i[cln];
				}
			}),
		]);
	});

	// Export file
	const buf = await wb.xlsx.writeBuffer();
	FileSaver.saveAs(new Blob([buf], { type: "application/octet-stream" }), `${a}.xlsx`);
	data1 = data;
};