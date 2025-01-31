/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep, nonNullProp } from "@microsoft/vscode-azext-utils";
import { localize } from "../../utils/localize";
import { type DeployWorkspaceProjectContext } from "./DeployWorkspaceProjectContext";
import { getDeployWorkspaceProjectSettings, hasNoDeployWorkspaceProjectSettings, type DeployWorkspaceProjectSettings } from "./deployWorkspaceProjectSettings";

export class ShouldSaveDeploySettingsPromptStep extends AzureWizardPromptStep<DeployWorkspaceProjectContext> {
    public async prompt(context: DeployWorkspaceProjectContext): Promise<void> {
        const settings: DeployWorkspaceProjectSettings = await getDeployWorkspaceProjectSettings(nonNullProp(context, 'rootFolder'));

        if (
            context.registry && settings?.containerRegistryName === context.registry.name &&
            context.containerApp && settings?.containerAppName === context.containerApp.name
        ) {
            context.telemetry.properties.noNewSettings = 'true';
            return;
        }

        context.telemetry.properties.noNewSettings = 'false';

        const saveOrOverwrite: string = hasNoDeployWorkspaceProjectSettings(settings) ? localize('save', 'save') : localize('overwrite', 'overwrite');
        const saveItem = { title: localize('saveItem', 'Save') };
        const dontSaveItem = { title: localize('dontSaveItem', 'Don\'t Save') };

        const userResponse = await context.ui.showWarningMessage(
            localize('saveWorkspaceSettings', `Would you like to ${saveOrOverwrite} your deployment configuration in local project settings?`),
            { modal: true },
            saveItem,
            dontSaveItem
        );

        context.shouldSaveDeploySettings = userResponse === saveItem;
        context.telemetry.properties.shouldSaveDeploySettings = context.shouldSaveDeploySettings ? 'true' : 'false';
    }

    public shouldPrompt(context: DeployWorkspaceProjectContext): boolean {
        return context.shouldSaveDeploySettings === undefined;
    }
}
