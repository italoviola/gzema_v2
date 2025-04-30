import { loadConfig } from 'utils/loadConfig';
import getTools from 'api/getTools/request';
import {
  Config,
  GetToolsRequest,
  GetToolsResponse,
  GetToolsResponseDataItem,
  StoredCncData,
  Tools,
  NotationPattern,
  BAxisSpin,
} from 'types/api';

const getToolsHandle = async (): Promise<
  | { status: 'success'; tools: Tools; cnc: StoredCncData }
  | { status: 'error'; error: string }
  | { status: 'noData' }
  | { status: 'invalidStatusCode'; statusCode: number }
> => {
  const loadedConfig: Config = await loadConfig();

  const request: GetToolsRequest = {
    network: {
      ip: loadedConfig.network.ip as string,
      port: loadedConfig.network.port as number,
    },
    pCodeAddresses: [
      loadedConfig.cnc.notationPattern as number,
      loadedConfig.cnc.hasBAxis as number,
      loadedConfig.tools.tool1Var as number,
      loadedConfig.tools.tool1fixedDiamondQtd as number,
      loadedConfig.tools.tool1refractableDiamondQtd as number,
      loadedConfig.tools.tool1dressingDiscQtd as number,
      loadedConfig.tools.tool1fixedDressingRollerQtd as number,
      loadedConfig.tools.tool1sCtrlMovableDressingRollerQtd as number,
      loadedConfig.tools.tool2Var as number,
      loadedConfig.tools.tool2fixedDiamondQtd as number,
      loadedConfig.tools.tool2refractableDiamondQtd as number,
      loadedConfig.tools.tool2dressingDiscQtd as number,
      loadedConfig.tools.tool2fixedDressingRollerQtd as number,
      loadedConfig.tools.tool2sCtrlMovableDressingRollerQtd as number,
      loadedConfig.tools.tool3Var as number,
      loadedConfig.tools.tool3fixedDiamondQtd as number,
      loadedConfig.tools.tool3refractableDiamondQtd as number,
      loadedConfig.tools.tool3dressingDiscQtd as number,
      loadedConfig.tools.tool3fixedDressingRollerQtd as number,
      loadedConfig.tools.tool3sCtrlMovableDressingRollerQtd as number,
      loadedConfig.tools.tool4Var as number,
      loadedConfig.tools.tool4fixedDiamondQtd as number,
      loadedConfig.tools.tool4refractableDiamondQtd as number,
      loadedConfig.tools.tool4dressingDiscQtd as number,
      loadedConfig.tools.tool4fixedDressingRollerQtd as number,
      loadedConfig.tools.tool4sCtrlMovableDressingRollerQtd as number,
    ],
  };

  try {
    const res: GetToolsResponse = await getTools(request, 100000);

    if (res.statusCode === 200) {
      if (res.data) {
        const newToolsData: Tools = {} as Tools;
        const newCncData: StoredCncData = {} as StoredCncData;

        res.data.forEach((tool: GetToolsResponseDataItem) => {
          Object.keys(loadedConfig).forEach((configKey) => {
            const configSection =
              loadedConfig[configKey as keyof typeof loadedConfig];
            if (typeof configSection === 'object' && configSection !== null) {
              Object.keys(configSection).forEach((key) => {
                if (
                  configSection[key as keyof typeof configSection] === tool.code
                ) {
                  if (key === 'notationPattern' || key === 'hasBAxis') {
                    newCncData[key as keyof StoredCncData] = tool.value as
                      | NotationPattern
                      | BAxisSpin;
                  } else {
                    newToolsData[key as keyof Tools] = tool.value;
                  }
                }
              });
            }
          });
        });

        // window.electron.store.set('tools', newToolsData);
        // window.electron.store.set('cnc', newCncData);
        // newFile()
        return { status: 'success', tools: newToolsData, cnc: newCncData };
      }
      return { status: 'noData' };
    }
    return { status: 'invalidStatusCode', statusCode: res.statusCode };
  } catch (error) {
    return { status: 'error', error: (error as Error).message };
  }
};

export default getToolsHandle;
