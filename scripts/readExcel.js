const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../Data.xlsx');
const workbook = XLSX.readFile(filePath);

console.log('=== Excel 文件内容 ===');
console.log('工作表数量:', workbook.SheetNames.length);
console.log('工作表名称:', workbook.SheetNames);

workbook.SheetNames.forEach((sheetName) => {
  console.log('\n--- 工作表:', sheetName, '---');
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log('行数:', data.length);
  if (data.length > 0) {
    console.log('列名:', Object.keys(data[0]));
    console.log('\n数据示例:');
    data.slice(0, 5).forEach((row, index) => {
      console.log(`第${index + 1}行:`, JSON.stringify(row));
    });
    if (data.length > 5) {
      console.log(`... 还有 ${data.length - 5} 行`);
    }
  }
});
