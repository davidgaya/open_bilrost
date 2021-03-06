# Version Control API

### GET | Retrieve Workspace Status

**/assetmanager/workspaces/{workspace_name}/status**

A Workspace has an integrity status (related to the integrity of Assets/Resources) and a synchrony status (when compared to the DLC it was cloned from). The result of this request is an object that includes the workspace information, as well as the Workspace's integrity and synchrony statuses.

Synchrony Tokens:

- **UP_TO_DATE**: The Workspace contains exactly the same Assets/Resources as the DLC.
- **OUT_OF_DATE**: There is a newer version of the Workspace on the DLC, compared to the Workspace.
- **MODIFIED**: The Workspace has been modified (Assets and/or Resources have been changed). Changes need to be committed.
- **CONFLICTED**: There have been both local and remote changes since the last time the workspace was synchronized.

Integrity tokens:

- **VALID**: Internal validation passed.
- **PENDING**: This validation is pending.
- **MISSING**: This validation has not been ran yet.
- **INVALID**: This validation has failed.

The response of a Workspace status request looks like this:

```javascript
{ 
    workspace_name: "workspace_name", 
    url: "vcs_url", 
    sync_status: "*synchrony_token*", 
    integrity_status: "*integrity_token*"
    refs: [
        {
            ref: '/assets/test',
            sync_status: 'MODIFIED',
            integrity_status: 'VALID',
        },
        {
            ref: '/resources/test',
            sync_status: 'OUT_OF_DATE',
            integrity_status: 'VALID',
        },
    ],
}
```


Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. It is workspace name. |
|/status/| Is a fixed string that constrains the information we want from the workspace. This route requests the synchrony and integrity statuses of the Workspace. |


Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | ``{ Workspace Status }`` |


## GET | Retrieve Asset/Resource Status

**/assetmanager/workspaces/{workspace_name}/status{asset_ref||resource_ref}**

Each Asset/Resource in a Workspace has a synchrony status. Here are the current status tokens for Assets and Resources (these status tokens were inspired by the 'git status' documentation).

Synchrony tokens:

- **UP_TO_DATE**: The local Asset/Resource is exactly the same as the one on the DLC. *This status is only shown if a specific Asset/Resource is requested upon, not when a root or folder level request is made.* 
- **OUT_OF_DATE**: There is a newer version of the Asset/Resource remotely, compared to the one the user last updated.
- **MODIFIED**: The local Asset/Resource has been changed.
- **DELETED**: The Asset/Resource has been deleted.
- **RENAMED**: The Asset/Resource has changed names or moved.
- **EXTERNAL**: The Asset/Resource is versioned on an external repository.
- **NEW**: The Asset/Resource has been created.
- **CONFLICTED**: There is a conflict between the local changed and remote updated versions of the Asset/Resource.

Integrity tokens:

- **VALID**: Internal validation passed.
- **PENDING**: This validation is pending.
- **MISSING**: This validation has not been ran yet.
- **INVALID**: This validation has failed.

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. It is workspace name. |
|/status/| Is a fixed string that constrains the information we want from the workspace. This route requests the synchrony and integrity statuses of a specific Resources/Assets in the Workspace. |
|{asset_ref\|\|resource_ref}| This is the resource or asset ref. It must start with "resources/" or "assets/" keyword. It indicates its location in the workspace. Example: "resources/test/example.level", "resources/test/" and "assets/". Resource/Asset refs can be capitalized, but it is not allowed to have two asset refs that only differentiate in their capitalization. It must match "/^(assets|resources)\/.*/" regular expression. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | ``{ workspace_name: 'name', vcs_host: 'svn/git', url: 'url', refs: [ { asset_ref/resource_ref: 'path', "sync_status": "*synchrony_token*", "integrity_status": "*integrity_token*" } ] }`` |


## GET | Retrieve Assets from Workspace Stage

**/assetmanager/workspaces/{workspace_name}/stage/**

A Workspace can have Assets added to the stage as a step towards committing local changes to a DLC. 

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. |
|/stage/| Is a fixed string that identifies the Workspace change-list entity. This route requests a list of Assets that have been added to the Workspace stage. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | items: [ 'asset_ref', ... ] |


## POST | Add Assets to Stage

**/assetmanager/workspaces/{workspace_name}/stage/{asset_ref}**

A Workspace can have Assets added to the stage as a step towards committing local changes to a DLC. 

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. |
|/stage/| Is a fixed string that identifies the Workspace change-list entity. This route requests to add (post) an Asset/Resource to the Workspace stage, for a future commit. |
|{asset_ref}| This is the asset ref. It must match "/^(assets)\/.*/" regular expression. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | "Ok" |


## DELETE | Remove Assets from Stage

**/assetmanager/workspaces/{workspace_name}/stage{asset_ref}**

A Workspace can have Assets removed from the stage if they have been previously added to the stage, to manipulate a future commit operation. 

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. |
|/stage/| Is a fixed string that identifies the Workspace change-list entity. This route requests to remove an Asset/Resource from the Workspace stage. |
|{asset_ref}| This is the asset ref. It must match "/^(assets)\/.*/" regular expression. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | "Ok" |


## POST | Commit to Project

**/assetmanager/workspaces/{workspace_name}/commits**

Assets in the Workspace stage can be committed. This is an atomic operation that publishes local changes to a DLC in a Project.

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. |
|/commits/| Is a fixed string that informs that the action (post) refers to the Workspace's collection of commits. This route is requesting to commit the local staged changes to the DLC. |

| Body ||
|------|------|
|message| Message to be sent to the repository with the posted commit |


Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | String | 'commit_id' |


## GET | Retrieve Commit Log

**/assetmanager/workspaces/{workspace_name}/commits{asset_ref||resource_ref}**

A Workspace logs all the revisions that were pushed to it. The user can retrieve this log by using this call, either for reference, or to later revert specific Assets/Resources. If no ref is passed, this call returns a list with all the revisions for the DLC.

A revision object typically looks like this:

``
{
    id: '123456789',
    author: 'author',
    date: 'timestamp'
    refs: [ { asset_ref/resource_ref: 'path', "sync_status": "*synchrony_token*" }, ... ]
}

``

Paging can be done by adding these two query parameters to the request:
?start_at_revision={rev_id}&maxResults={int}

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. It is workspace name. |
|/commits/| Is a fixed string that constrains the information we want from the workspace. This route requests the Workspace's collection of commits, or the sub-collection of a specified Asset/Resource. |
|{asset_ref\|\|resource_ref}| Optional. This is the resource or asset ref. It must match "/^(assets|resources)\/.*/" regular expression. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | ``{ items: [ ... ], nextLink: '/assetmanager/workspaces/{workspace_name}/commits/{asset_ref||resource_ref}' `` |


## GET | Retrieve Subscriptions List

**/assetmanager/workspaces/{workspace_name}/subscriptions/**

A Workspace can have Assets, Namespaces or Search Queries added to the Subscription List of a Project. Each Subscription has an Id, type token and descriptor referring. The type tokens divide them into 3 categories:

Subscription tokens:

- **ASSET**: This is a Subscription to a single Asset.
- **NAMESPACE**: This Subscription includes all Assets in a specific Namespace.
- **SEARCH**: This Subscription includes all Assets in a specific Search.

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. |
|/subscriptions/| Is a fixed string that identifies the Workspace subscription list entity. This route requests a list of Assets/Namespaces/Searches that have been added to the Subscription list of this Workspace. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | subscriptions: [ { subscription_id: "*subscription_id*", url: "/assetmanager/workspaces/{workspace_name}/subscriptions/{subscription_id}", type: "ASSET|NAMESPACE|SEARCH", descriptor: "asset_ref|namespace|search_query" }, ... ] |


## POST | Add Asset, Namespace or Search Subscription to Workspace

**/assetmanager/workspaces/{workspace_name}/subscriptions/**

A Workspace can have Assets added to its subscription list, to guarantee depended Resources will be checked out at any times. 

Request:

| Body ||
|------|------|
|type| A token that categorizes the Subscription between ASSET, NAMESPACE and SEARCH. |
|descriptor| A string that describes the Subscription. It depends on the Subscription type. ASSET Subscriptions should have an Asset ref on this field, while NAMESPACE Subscriptions will have a Namespace ref, and a SEARCH Subscription will have a query. |

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. |
|/subscriptions/| Is a fixed string that identifies the Workspace subscription list entity. This route requests to add an Asset ref, Namespace or Search to the subscription list. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | Object | { subscription_id: "*subscription_id*", url: "/assetmanager/workspaces/{workspace_name}/subscriptions/{subscription_id}", type: "ASSET|NAMESPACE|SEARCH", descriptor: "asset_ref|namespace|search_query" } |


## DELETE | Remove Subscription from Workspace

**/assetmanager/workspaces/{workspace_name}/subscriptions/{subscription_id}**

A Workspace can have Asset/Namespace/Search Subscriptions removed from the Subscription List, to manipulate which Assets the user is going to check out automatically. 

Request:

| Path ||
|------|------|
|/workspaces/| Is a fixed string that routes to workspaces module. |
|{workspace_name}| This is the workspace identifier. It is workspace name. |
|/subscriptions/| Is a fixed string that identifies the Workspace Subscription list entity. This route requests to remove an Asset ref, Namespace or Search to the Subscription list. |
|{subscription_id}| This identifies which Subscription should be removed from the Subscription list. |

Response:

| Code | Mimetype | Data type | Data |
|------|--------|--------|----------------------|
| 200 | application/json | String | "Ok" |

#### Copyright (C) 2015-2018 Starbreeze AB All Rights Reserved
#### All other trademarks are the property of their respective owners
