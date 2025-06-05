import { GetToolsRequest, GetToolsResponse } from 'types/api';

const getToolsRequest = (
  request: GetToolsRequest,
  timeout: number,
): Promise<GetToolsResponse> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);

    window.electron.ipcRenderer
      .getTools(request)
      .then((res: GetToolsResponse) => {
        clearTimeout(timer);
        resolve(res);
        return res;
      })
      .catch((error: GetToolsResponse) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

export default getToolsRequest;
