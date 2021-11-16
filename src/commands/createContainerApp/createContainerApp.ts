/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActionContext, ICreateChildImplContext } from "vscode-azureextensionui";
import { ext } from "../../extensionVariables";
import { ContainerAppTreeItem } from "../../tree/ContainerAppTreeItem";
import { KubeEnvironmentTreeItem } from "../../tree/KubeEnvironmentTreeItem";
import { IContainerAppContext } from "./IContainerAppContext";
import { showContainerAppCreated } from "./showContainerAppCreated";

export async function createContainerApp(context: IActionContext & Partial<ICreateChildImplContext> & Partial<IContainerAppContext>, node?: KubeEnvironmentTreeItem): Promise<ContainerAppTreeItem> {
    if (!node) {
        node = await ext.tree.showTreeItemPicker<KubeEnvironmentTreeItem>(KubeEnvironmentTreeItem.contextValue, context);
    }

    const caNode: ContainerAppTreeItem = await node.createChild(context);
    void showContainerAppCreated(caNode);

    return caNode;
}