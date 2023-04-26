/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { IGitHubContext } from "./IGitHubContext";
import { createOctokitClient } from "./createOctokitClient";

export type UserRepos = RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"];
export type GetUserReposReqParams = RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["parameters"];

export async function getRepositoriesByUser(context: IGitHubContext, reqParams?: GetUserReposReqParams): Promise<UserRepos> {
    const client: Octokit = await createOctokitClient(context);
    return (await client.repos.listForAuthenticatedUser(reqParams)).data;
}

export type OrgRepos = RestEndpointMethodTypes["repos"]["listForOrg"]["response"]["data"];
export type GetOrgReposReqParams = RestEndpointMethodTypes["repos"]["listForOrg"]["parameters"] & { org: string };  // Make 'org' required

export async function getRepositoriesByOrg(context: IGitHubContext, reqParams: GetOrgReposReqParams): Promise<OrgRepos> {
    const client: Octokit = await createOctokitClient(context);
    return (await client.repos.listForOrg(reqParams)).data;
}
