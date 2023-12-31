const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5529;

app.use(bodyParser.json());

// 允许所有跨域请求
app.use(cors());

const upload = multer();

// 设置代理路由
/**
 * 获取百度网盘用户信息
 */
app.get('/rest/2.0/xpan/nas', async (req, res) => {
  try {
    const response = await axios.get('https://pan.baidu.com/rest/2.0/xpan/nas', {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

/**
 * 获取百度网盘容量信息
 */
app.get('/api/quota', async (req, res) => {
  try {
    const response = await axios.get('https://pan.baidu.com/api/quota', {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

/**
 * 获取网盘图片文件列表
 */
app.get('/rest/2.0/xpan/file', async (req, res) => {
  try {
    const response = await axios.get('https://pan.baidu.com/rest/2.0/xpan/file', {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

/**
 * 获取网盘图片文件列表(指定类型)
 */
app.get('/rest/2.0/xpan/multimedia', async (req, res) => {
  try {
    const response = await axios.get('http://pan.baidu.com/rest/2.0/xpan/multimedia', {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

/**
 * 单步上传图片文件到网盘
 */
app.post('/rest/2.0/pcs/file', upload.single('file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', new Blob([req.file.buffer]));
    const response = await axios.post(`https://d.pcs.baidu.com/rest/2.0/pcs/file?method=upload&ondup=newcopy&access_token=${req?.body?.access_token}&path=${req?.body?.path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

/**
 * 获取网盘图片文件列表数量(指定类型)
 */
app.get('/api/categoryinfo', async (req, res) => {
  try {
    const response = await axios.get('https://pan.baidu.com/api/categoryinfo', {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

/**
 * 获取文件下载地址
 */
app.get('/rest/2.0/xpan/multimedia/downloadInfo', async (req, res) => {
  try {
    const response = await axios.get('http://pan.baidu.com/rest/2.0/xpan/multimedia', {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

/**
 * 下载图片
 */
app.get('/download/fileitem', async (req, res) => {
  try {
    const response = await axios.get(`${req?.query?.dlink}&access_token=${req?.query?.access_token}`,
      {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'pan.baidu.com',
        }
      },

    );

    // 将 Blob 数据发送给前端
    res.set('Content-Type', 'image/jpeg');
    res.send(response?.data);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.end(response.data, 'binary');
  } catch (error) {
    console.error(error);
  }
});

/**
 * 创建文件夹
 */
app.post('/create/folder', async (req, res) => {
  try {
    const response = await axios.post(`https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=${req?.body?.access_token}`, {
      path: req.body.path,
      isdir: req.body.isdir,
    },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});