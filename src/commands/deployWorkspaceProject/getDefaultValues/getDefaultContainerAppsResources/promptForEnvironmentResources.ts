/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ContainerAppsAPIClient, ManagedEnvironment } from "@azure/arm-appcontainers";
import { uiUtils } from "@microsoft/vscode-azext-azureutils";
import { IAzureQuickPickItem, ISubscriptionActionContext, nonNullProp } from "@microsoft/vscode-azext-utils";
import { SetTelemetryProps } from "../../../../telemetry/SetTelemetryProps";
import { DeployWorkspaceProjectTelemetryProps as TelemetryProps } from "../../../../telemetry/telemetryProps";
import { createContainerAppsAPIClient } from "../../../../utils/azureClients";
import { localize } from "../../../../utils/localize";
import { DefaultContainerAppsResources } from "./getDefaultContainerAppsResources";
import { getResourcesFromManagedEnvironmentHelper } from "./getResourceHelpers";

const noMatchingResources = {
    resourceGroup: undefined,
    managedEnvironment: undefined,
    containerApp: undefined
};

export async function promptForEnvironmentResources(context: ISubscriptionActionContext & SetTelemetryProps<TelemetryProps>): Promise<DefaultContainerAppsResources> {
    const client: ContainerAppsAPIClient = await createContainerAppsAPIClient(context)
    const managedEnvironments: ManagedEnvironment[] = await uiUtils.listAllIterator(client.managedEnvironments.listBySubscription());

    if (!managedEnvironments.length) {
        return noMatchingResources;
    }

    const picks: IAzureQuickPickItem<ManagedEnvironment | undefined>[] = [
        {
            label: localize('newManagedEnvironment', '$(plus) Create new container apps environment'),
            description: '',
            data: undefined
        },
        ...managedEnvironments.map(env => {
            return {
                label: nonNullProp(env, 'name'),
                description: '',
                data: env
            };
        })
    ];

    context.telemetry.properties.promptedForEnvironment = 'true';

    const placeHolder: string = localize('selectManagedEnvironment', 'Select a container apps environment');
    const managedEnvironment: ManagedEnvironment | undefined = (await context.ui.showQuickPick(picks, { placeHolder })).data;

    if (!managedEnvironment) {
        return noMatchingResources;
    }

    return await getResourcesFromManagedEnvironmentHelper(context, managedEnvironment);
}