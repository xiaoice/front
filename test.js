import * as vscode from 'vscode';
import { SharedMap } from '@fluidframework/map';
import { ContainerSchema } from '@fluid-experimental/fluid-framework';
import { FrsResources, FrsClient, FrsConnectionConfig, FrsContainerConfig, InsecureTokenProvider } from '@fluid-experimental/frs-client';
import { EditorShared } from '../fluid/editorShared';
import { MainShared } from '../fluid/mainShared';
import { TerminalShared } from '../fluid/terminalShared';
import { getFrsContainer, initBaseInfo } from '../utilities/util';
import { logger } from '../utilities/logger';
import { CSCommands } from '../utilities/constants';
import { session } from '../utilities/session';
import { activateEditor } from '../editor/editorAction';
import { MainAction } from '../main/mainAction';
import { TerminalAction } from '../terminal/terminalAction';


232323232fgnss

23asdfds232
fsdfsagsdf


export async function appStart(context: vscode.ExtensionContext) {
  logger.appendLine('-----appStart----');
  await initBaseInfo(); // 初始化用户基础信息
  const { id, userId, userName } = session.userInfo;
  console.log('session.userInfo-app-init--------------------------', session.userInfo);

  const localConfig: FrsConnectionConfig = {
    tenantId: 'fluid',
    tokenProvider: new InsecureTokenProvider('create-new-tenants-if-going-to-production', {
      id: userId,
      userName
    } as any),
    // orderer: 'https://0-fluid-alfred.cloudstudio.net',
    // storage: 'https://0-fluid-historian.cloudstudio.net',
    orderer: 'http://tinylicious.chikorita.fun:80',
    storage: 'http://tinylicious.chikorita.fun:80',
  };

  const client = new FrsClient(localConfig);
  const containerConfig: FrsContainerConfig = { id: id + '' };
  const containerSchema: ContainerSchema = {
    name: 'metawork-container',
    initialObjects: {
      mainSharedMap: SharedMap,
      editorSharedMap: SharedMap,
      terminalSharedMap: SharedMap,
    },
    dynamicObjectTypes: [SharedMap],
  };
  //@ts-ignore
  const { fluidContainer, containerServices }: FrsResources = await getFrsContainer(client, containerConfig, containerSchema);
  const mainSharedMap: SharedMap = fluidContainer.initialObjects.mainSharedMap as SharedMap;
  const editorSharedMap: SharedMap = fluidContainer.initialObjects.editorSharedMap as SharedMap;
  const terminalSharedMap: SharedMap = fluidContainer.initialObjects.terminalSharedMap as SharedMap;
  session.context = context;
  session.mainShared = new MainShared(mainSharedMap);
  session.editorShared = new EditorShared(editorSharedMap);
  session.terminalShared = new TerminalShared(terminalSharedMap);
  session.containerServices = containerServices;
  session.fluidContainer = fluidContainer;

  context.subscriptions.push(vscode.commands.registerCommand(CSCommands.disposeFluidContainer.cmd, () => {
    try {
      context.subscriptions.forEach(v => v.dispose());
      fluidContainer.dispose();
      // context.subscriptions.splice(0, context.subscriptions.length);
    } catch (error) {
      console.error(error);
    }
  }));

  context.subscriptions.push(new MainAction());
  context.subscriptions.push(new TerminalAction());
  activateEditor(context);

}
