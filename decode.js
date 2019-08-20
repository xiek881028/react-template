const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 循环指定目录，输出目录内所有文件列表的数组
// file 文件名或文件夹名
// loop 是否循环遍历所有子目录
// mode 输出类型 all 所有 dir 文件夹 file 文件
function fileTree(file, loop = true, mode = 'all') {
  let fileList = [];
  function walk(file) {
    //如果入参是文件，直接加入数组返回
    if (!fs.statSync(file).isDirectory()) {
      fileList.push(file);
      return;
    }
    let dirlist = fs.readdirSync(file);
    dirlist.forEach(function (item) {
      let itemPath = path.resolve(file, item);
      let isDir = fs.statSync(itemPath).isDirectory();
      if (mode == 'file') {
        !isDir && fileList.push(itemPath);
      } else if (mode == 'dir') {
        isDir && fileList.push(itemPath);
      } else {
        fileList.push(itemPath);
      }
      if (isDir && loop) {
        walk(itemPath);
      }
    });
  };
  walk(file);
  return fileList;
}

function question() {
  rl.question(`请选择要使用的功能：\n\n 1.解密当前目录(忽略node_modules)；\n 2.git自动Add\n 3.解除复制限制\n\n 选择：`, async answer => {
    if(answer == '1') {
      await decode();
      rl.close();
    }else if(answer == '2') {

    }else if(answer == '3') {

    }else {
      console.log(``);
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~`);
      console.log(`输入错误，请重新输入`);
      console.log(``);
      question();
    }
  });
}

function decode() {
  return new Promise(reslove => {
    console.log(`当前目录为：${__dirname}`);
    console.log(`开始解密当前目录...`);
    const fileList = fileTree(__dirname, false);
    fileList.map(item => {
      let itemName = path.basename(item);
      if(itemName == 'decode.js' || itemName == 'node_modules') return;
      let copyName = `${itemName}_decode`;
      let copyDir = path.join(path.dirname(item), copyName);
      fs.copySync(item, copyDir);
      fs.removeSync(item);
      fs.copySync(copyDir, item);
      fs.removeSync(copyDir);
    });
    console.log(`目录解密完成！`);
    reslove();
  });
}

// main
(() => {
  question();
})();
