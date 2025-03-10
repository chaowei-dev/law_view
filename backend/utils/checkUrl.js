import axios from 'axios';

export const checkUrls = async (urls) => {
  for (const url of urls) {
    try {
      const response = await axios.get(url);
      // 200 或 405 均表示服務有回應
      if (response.status === 200 || response.status === 405) {
        console.log(`URL: ${url} 可用，狀態碼：${response.status}`);
        return url;
      }
    } catch (error) {
      // 若錯誤中包含 response 並且狀態碼為 405，視為服務啟動
      if (error.response && error.response.status === 405) {
        console.log(`URL: ${url} 可用 (405 Method Not Allowed)`);
        return url;
      }
      console.log(`URL: ${url} 不可用，錯誤：${error.message}`);
    }
  }
  return null;
};
